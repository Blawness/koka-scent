export const WHATSAPP_URL = "https://api.whatsapp.com/message/3RBJQFHFLBF7K1";
export const INSTAGRAM_URL = "https://www.instagram.com/koka_scent";
export const SHOPEE_URL = "https://shopee.co.id/koka_scent";
export const TOKOPEDIA_URL = "https://www.tokopedia.com/kokascent";

export function whatsappLink(message: string) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}
