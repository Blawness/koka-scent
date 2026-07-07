/**
 * Midtrans Snap integration — SKELETON ONLY.
 *
 * ⚠️ DO NOT IMPLEMENT YET. Per PRD Section 10 (Open Questions), the payment
 * provider is not finalised (Midtrans Snap recommended, Xendit is the
 * alternative). This file is a placeholder so the order flow can compile and
 * so the integration surface is agreed before wiring real credentials.
 *
 * When confirmed, implement against:
 *   - Snap token creation:      POST https://app.sandbox.midtrans.com/snap/v1/transactions
 *   - Webhook signature check:  sha512(order_id + status_code + gross_amount + ServerKey)
 *
 * Env: MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, MIDTRANS_IS_PRODUCTION.
 */

export type SnapTransactionParams = {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerPhone: string;
};

export type SnapTransaction = {
  token: string;
  redirectUrl: string;
};

/**
 * TODO: Create a Midtrans Snap transaction and return its token + redirect URL.
 * Currently returns a dummy token so the checkout flow can be scaffolded.
 */
export async function createSnapTransaction(
  params: SnapTransactionParams,
): Promise<SnapTransaction> {
  // TODO: replace with real Midtrans Snap API call once provider is confirmed.
  return {
    token: `dummy-snap-token-${params.orderId}`,
    redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/dummy-${params.orderId}`,
  };
}

export type MidtransNotification = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
};

/**
 * TODO: Verify the SHA-512 signature of an incoming Midtrans webhook.
 * Returns `false` for now so no unverified notification is ever trusted.
 */
export function verifyMidtransSignature(
  _notification: MidtransNotification,
): boolean {
  // TODO: implement sha512(order_id + status_code + gross_amount + serverKey).
  return false;
}
