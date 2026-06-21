export const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || "919533304441";
export const BUSINESS_EMAIL = process.env.REACT_APP_BUSINESS_EMAIL || "fortuneugroupofficial@gmail.com";
export const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbzhUL6lw-T-c-AZ7ejQq9vTJxYfljRTLh5GsMRYqFPFZGMtqsyZ2jvt1GiU2OH4Z1LO/exec";

export const whatsappLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text || "Hello Fortune U Group, I would like to know more about your financial planning services.")}`;

/**
 * Submit a lead to Google Sheets via Apps Script web app.
 * If REACT_APP_SHEETS_WEBHOOK is not set, this MOCKS by logging to console.
 * Uses mode:"no-cors" so the request goes through without preflight CORS issues
 * (the response cannot be read, but Apps Script will receive and store the row).
 */
export async function submitLead(type, payload) {
  const body = { type, timestamp: new Date().toISOString(), ...payload };
  console.log("FORM DATA", body);
  if (!SHEETS_WEBHOOK) {
    console.warn("[MOCKED LEAD]", body);
    await new Promise((r) => setTimeout(r, 400));
    return { ok: true, mocked: true };
  }
  try {
    await fetch(SHEETS_WEBHOOK, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
    });
    return { ok: true };
  } catch (e) {
    console.error("Sheets submit failed", e);
    return { ok: false };
  }
}
