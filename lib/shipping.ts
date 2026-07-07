/**
 * Shipping cost calculation — SKELETON.
 *
 * Provider not finalised (PRD Section 10: RajaOngkir vs Biteship, and which
 * courier accounts Koka Scent uses). Returns dummy rates for now so checkout
 * can be scaffolded. Env: RAJAONGKIR_API_KEY.
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

/**
 * TODO: call RajaOngkir/Biteship to get real courier rates.
 * For now returns static dummy options.
 */
export async function getShippingRates(
  _req: ShippingRateRequest,
): Promise<ShippingRate[]> {
  // TODO: replace with real courier API integration.
  return [
    { courier: "JNE", service: "REG", cost: 18000, etd: "2-3" },
    { courier: "SiCepat", service: "BEST", cost: 22000, etd: "1-2" },
    { courier: "AnterAja", service: "Reguler", cost: 16000, etd: "2-4" },
  ];
}
