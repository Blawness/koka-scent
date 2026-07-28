import { describe, expect, it } from "vitest";
import {
  mapBiteshipPricingToRates,
  mapRajaOngkirCostsToRates,
  resolveProvider,
  ShippingError,
} from "./shipping";

describe("mapBiteshipPricingToRates", () => {
  it("maps a Biteship pricing row to ShippingRate shape", () => {
    const result = mapBiteshipPricingToRates([
      {
        courier_name: "JNE",
        courier_service_name: "City to City (CTC)",
        price: 11000,
        shipment_duration_range: "2-3",
      },
    ]);
    expect(result).toEqual([
      { courier: "JNE", service: "City to City (CTC)", cost: 11000, etd: "2-3" },
    ]);
  });

  it("preserves input order (cheapest-first if Biteship returns it that way)", () => {
    const result = mapBiteshipPricingToRates([
      { courier_name: "JNE", courier_service_name: "CTC", price: 11000, shipment_duration_range: "2-3" },
      { courier_name: "SiCepat", courier_service_name: "Reguler", price: 35000, shipment_duration_range: "1-2" },
      { courier_name: "AnterAja", courier_service_name: "Reguler", price: 10000, shipment_duration_range: "2" },
    ]);
    expect(result.map((r) => r.courier)).toEqual(["JNE", "SiCepat", "AnterAja"]);
  });

  it("returns an empty array for an empty Biteship response", () => {
    expect(mapBiteshipPricingToRates([])).toEqual([]);
  });

  it("skips rows missing a courier name (defensive — should never happen)", () => {
    const result = mapBiteshipPricingToRates([
      { courier_name: "", courier_service_name: "CTC", price: 11000, shipment_duration_range: "2-3" },
      { courier_name: "JNE", courier_service_name: "CTC", price: 11000, shipment_duration_range: "2-3" },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].courier).toBe("JNE");
  });

  it("skips rows missing a price (defensive — should never happen)", () => {
    const result = mapBiteshipPricingToRates([
      { courier_name: "JNE", courier_service_name: "CTC", price: 0, shipment_duration_range: "2-3" },
    ]);
    expect(result).toEqual([]);
  });

  it("defaults etd to '-' when Biteship omits the duration", () => {
    const result = mapBiteshipPricingToRates([
      { courier_name: "JNE", courier_service_name: "CTC", price: 11000, shipment_duration_range: "" },
    ]);
    expect(result[0].etd).toBe("-");
  });
});

describe("mapRajaOngkirCostsToRates", () => {
  it("maps a RajaOngkir cost row to ShippingRate shape", () => {
    const result = mapRajaOngkirCostsToRates([
      {
        name: "Jalur Nugraha Ekakurir (JNE)",
        code: "jne",
        service: "REG",
        cost: 12000,
        etd: "2 day",
      },
    ]);
    expect(result).toEqual([
      { courier: "Jalur Nugraha Ekakurir (JNE)", service: "REG", cost: 12000, etd: "2 day" },
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(mapRajaOngkirCostsToRates([])).toEqual([]);
  });

  it("skips rows missing required fields", () => {
    const result = mapRajaOngkirCostsToRates([
      { name: "", service: "REG", cost: 18000, etd: "2-3" },
      { name: "JNE", service: "REG", cost: 0, etd: "2-3" },
    ]);
    expect(result).toHaveLength(0);
  });

  it("keeps a row missing only etd (defaults to '-')", () => {
    const result = mapRajaOngkirCostsToRates([
      { name: "JNE", service: "CTC", cost: 18000 },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].etd).toBe("-");
  });

  it("defaults etd to '-' when RajaOngkir omits it", () => {
    const result = mapRajaOngkirCostsToRates([
      { name: "JNE", service: "CTC", cost: 18000, etd: "" },
    ]);
    expect(result[0].etd).toBe("-");
  });
});

describe("resolveProvider", () => {
  it("defaults to 'biteship' when SHIPPING_PROVIDER is unset", () => {
    expect(resolveProvider({})).toBe("biteship");
  });

  it("defaults to 'biteship' on empty string", () => {
    expect(resolveProvider({ SHIPPING_PROVIDER: "" })).toBe("biteship");
  });

  it("accepts 'rajaongkir'", () => {
    expect(resolveProvider({ SHIPPING_PROVIDER: "rajaongkir" })).toBe("rajaongkir");
  });

  it("is case-insensitive and trims whitespace", () => {
    expect(resolveProvider({ SHIPPING_PROVIDER: "  Biteship  " })).toBe("biteship");
  });

  it("throws ShippingError on an unknown provider (so a typo surfaces loudly)", () => {
    expect(() => resolveProvider({ SHIPPING_PROVIDER: "bithesip" })).toThrow(
      ShippingError,
    );
    try {
      resolveProvider({ SHIPPING_PROVIDER: "bithesip" });
    } catch (e) {
      expect((e as ShippingError).kind).toBe("unknown_provider");
    }
  });
});
