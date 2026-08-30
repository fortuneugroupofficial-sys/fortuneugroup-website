export const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || "919490237465";
export const BUSINESS_EMAIL = process.env.REACT_APP_BUSINESS_EMAIL || "fortuneugroupofficial@gmail.com";


export const whatsappLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text || "Hello Fortune U Group, I would like to know more about your financial planning services.")}`;

/**
 * Submit a lead to the n8n webhook.
 * Returns { ok: true } when the webhook accepts the request (HTTP 2xx),
 * otherwise { ok: false } so the UI can show a proper error to the user.
 */
export async function submitLead(type, payload) {

  let webhook = "";

switch (type) {
  case "insurance":
    webhook = "https://n8n.fortuneugroup.in/webhook/insurance";
    break;

  case "sip":
    webhook = "https://n8n.fortuneugroup.in/webhook/sip";
    break;

  case "ai-chat":
    webhook = "https://n8n.fortuneugroup.in/webhook/ai-chat";
    break;

  default:
    webhook = "https://n8n.fortuneugroup.in/webhook/book-consultation";
}
  const body = {
  type,
  timestamp: new Date().toISOString(),
  name: payload.name,
  mobile: payload.mobile,
  email: payload.email,
  city: payload.city,
  financial_goal: payload.financial_goal || payload.financialGoal || payload.goal_type || "",
  message: payload.message,
  insuranceType: payload.insuranceType,
monthlyIncome: payload.monthlyIncome,
sipBudget: payload.sipBudget,
age: payload.age,
familyMembers: payload.familyMembers,
coverageRequirement: payload.coverageRequirement,
};

  try {
    const res = await fetch(webhook, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error("Lead webhook returned", res.status, res.statusText);
      return { ok: false };
    }
    return { ok: true };
  } catch (e) {
    console.error("Lead submit failed", e);
    return { ok: false };
  }
}
