/**
 * Shipping cost calculation.
 *
 * Two providers supported, switched at runtime via SHIPPING_PROVIDER env:
 *   - "biteship"    — https://api.biteship.com/v1/rates/couriers
 *   - "rajaongkir"  — https://rajaongkir.komerce.id/api/v1/...
 *
 * Both are POST-REST APIs that need origin config + a destination postal code
 * + weight in grams. They return different shapes; `mapXxxToRates` normalises
 * them to our flat `ShippingRate[]` consumed by the storefront.
 *
 * PRD: Section 4 "Shipping Cost", Feature 2.
 */

export type ShippingRateRequest = {
  destinationCity: string;
  destinationPostalCode: string;
  weightGrams: number;
};

export type ShippingRate = {
  courier: string;
  service: string;
  cost: number; // IDR
  etd: string; // estimated days, e.g. "2-3"
};

type Provider = "biteship" | "rajaongkir";

export class ShippingError extends Error {
  constructor(
    public kind: "missing_config" | "upstream_error" | "unknown_provider",
    message: string,
  ) {
    super(message);
    this.name = "ShippingError";
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

export async function getShippingRates(
  req: ShippingRateRequest,
): Promise<ShippingRate[]> {
  const provider = resolveProvider();
  switch (provider) {
    case "biteship":
      return getBiteshipRates(req);
    case "rajaongkir":
      return getRajaOngkirRates(req);
  }
}

/**
 * Pure — exported for testability. Returns "biteship" if SHIPPING_PROVIDER is
 * unset, missing, or unrecognised. Anything explicit like "rajaongkir" is
 * passed through so a typo surfaces as an `unknown_provider` error.
 */
export function resolveProvider(env: NodeJS.ProcessEnv = process.env): Provider {
  const raw = env.SHIPPING_PROVIDER?.trim().toLowerCase();
  if (!raw) return "biteship";
  if (raw === "biteship" || raw === "rajaongkir") return raw;
  throw new ShippingError(
    "unknown_provider",
    `Unknown SHIPPING_PROVIDER "${raw}". Expected "biteship" or "rajaongkir".`,
  );
}

// ─── Biteship ──────────────────────────────────────────────────────────────

type BiteshipPricingRow = {
  courier_name?: string;
  courier_service_name?: string;
  price?: number;
  shipment_duration_range?: string;
};

const BITESHIP_RATES_URL = "https://api.biteship.com/v1/rates/couriers";

/** Pure mapper: Biteship `pricing[]` → `ShippingRate[]`. */
export function mapBiteshipPricingToRates(
  pricing: BiteshipPricingRow[],
): ShippingRate[] {
  const rates: ShippingRate[] = [];
  for (const row of pricing) {
    const courier = row.courier_name?.trim();
    const service = row.courier_service_name?.trim();
    const cost = row.price;
    const etd = row.shipment_duration_range?.trim();
    if (!courier || !service || !cost || cost <= 0) continue;
    rates.push({ courier, service, cost, etd: etd || "-" });
  }
  return rates;
}

async function getBiteshipRates(
  req: ShippingRateRequest,
): Promise<ShippingRate[]> {
  const apiKey = required("BITESHIP_API_KEY");
  const originPostalCode = required("BITESHIP_ORIGIN_POSTAL_CODE");
  const couriers = process.env.BITESHIP_COURIERS ?? "jne,sicepat,anteraja";

  const url = new URL(BITESHIP_RATES_URL);
  url.searchParams.set("origin_postal_code", originPostalCode);
  url.searchParams.set("destination_postal_code", req.destinationPostalCode);
  url.searchParams.set("couriers", couriers);

  const res = await fetch(url, {
    method: "POST",
    headers: { authorization: apiKey, "content-type": "application/json" },
    body: JSON.stringify({
      items: [
        {
          name: "Koka Scent Order",
          value: 0,
          quantity: 1,
          weight: req.weightGrams,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw await upstreamError(res, "Biteship");
  }

  const json = (await res.json()) as {
    success?: boolean;
    pricing?: BiteshipPricingRow[];
  };
  if (!json.success || !Array.isArray(json.pricing)) {
    throw new ShippingError(
      "upstream_error",
      "Biteship response missing pricing array",
    );
  }
  return mapBiteshipPricingToRates(json.pricing);
}

// ─── RajaOngkir (Komerce) ──────────────────────────────────────────────────

type RajaOngkirCostRow = {
  shipping_name?: string;
  service_name?: string;
  shipping_cost_net?: number;
  etd?: string;
};

const RAJAONGKIR_BASE = "https://rajaongkir.komerce.id/api/v1";
const RAJAONGKIR_COURIERS_DEFAULT = "jne:sicepat:anteraja";

// In-memory cache: RajaOngkir district IDs (origin is constant per process).
// Destination lookups are per-request and not cached.
let cachedOriginDistrictId: string | null = null;

type RajaOngkirDestination = {
  id: string;
  zip_code?: string;
};

/** Pure mapper: RajaOngkir `calculate_reguler[]` → `ShippingRate[]`. */
export function mapRajaOngkirCostsToRates(
  rows: RajaOngkirCostRow[],
): ShippingRate[] {
  const rates: ShippingRate[] = [];
  for (const row of rows) {
    const courier = row.shipping_name?.trim();
    const service = row.service_name?.trim();
    const cost = row.shipping_cost_net;
    const etd = row.etd?.trim();
    if (!courier || !service || !cost || cost <= 0) continue;
    rates.push({ courier, service, cost, etd: etd || "-" });
  }
  return rates;
}

async function getRajaOngkirRates(
  req: ShippingRateRequest,
): Promise<ShippingRate[]> {
  const apiKey = required("RAJAONGKIR_API_KEY");
  const originPostal = required("RAJAONGKIR_ORIGIN_POSTAL_CODE");
  const couriers =
    process.env.RAJAONGKIR_COURIERS ?? RAJAONGKIR_COURIERS_DEFAULT;

  const [originDistrictId, destinationDistrictId] = await Promise.all([
    getOriginDistrictId(originPostal, apiKey),
    lookupDistrictId(req.destinationPostalCode, apiKey),
  ]);

  const body = new URLSearchParams({
    origin: originDistrictId,
    destination: destinationDistrictId,
    weight: String(req.weightGrams),
    courier: couriers,
  });

  const res = await fetch(`${RAJAONGKIR_BASE}/calculate/district/domestic-cost`, {
    method: "POST",
    headers: { key: apiKey, "content-type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) throw await upstreamError(res, "RajaOngkir");

  const json = (await res.json()) as {
    meta?: { status?: string; message?: string };
    data?: { calculate_reguler?: RajaOngkirCostRow[] };
  };
  if (json.meta?.status !== "success" || !json.data?.calculate_reguler) {
    throw new ShippingError(
      "upstream_error",
      `RajaOngkir response invalid: ${json.meta?.message ?? "no calculate_reguler"}`,
    );
  }
  return mapRajaOngkirCostsToRates(json.data.calculate_reguler);
}

async function getOriginDistrictId(
  postalCode: string,
  apiKey: string,
): Promise<string> {
  if (cachedOriginDistrictId) return cachedOriginDistrictId;
  cachedOriginDistrictId = await lookupDistrictId(postalCode, apiKey);
  return cachedOriginDistrictId;
}

async function lookupDistrictId(
  postalCode: string,
  apiKey: string,
): Promise<string> {
  const url = new URL(`${RAJAONGKIR_BASE}/destination/domestic-destination`);
  url.searchParams.set("search", postalCode);
  url.searchParams.set("limit", "1");
  url.searchParams.set("offset", "0");

  const res = await fetch(url, { headers: { key: apiKey } });
  if (!res.ok) throw await upstreamError(res, "RajaOngkir");

  const json = (await res.json()) as {
    meta?: { status?: string };
    data?: RajaOngkirDestination[];
  };
  if (json.meta?.status !== "success" || !json.data?.length) {
    throw new ShippingError(
      "upstream_error",
      `RajaOngkir could not resolve postal code "${postalCode}"`,
    );
  }
  return json.data[0].id;
}

// ─── Shared helpers ────────────────────────────────────────────────────────

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new ShippingError("missing_config", `${name} is not set`);
  }
  return v;
}

async function upstreamError(
  res: Response,
  provider: string,
): Promise<ShippingError> {
  const body = await res.text().catch(() => "");
  return new ShippingError(
    "upstream_error",
    `${provider} returned ${res.status}: ${body.slice(0, 200)}`,
  );
}
