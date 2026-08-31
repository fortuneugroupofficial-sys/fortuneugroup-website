export const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || "919490237465";
export const BUSINESS_EMAIL = process.env.REACT_APP_BUSINESS_EMAIL || "fortuneugroupofficial@gmail.com";


export const whatsappLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text || "Hello Fortune U Group, I would like to know more about your financial planning services.")}`;

// Backend API (Render) — all lead forms submit here
const API_BASE = "https://fortunegroup-website.onrender.com";

export async function submitLead(type, payload) {

  let webhook = "";

switch (type) {
  // AI chat stays on n8n (it returns an AI reply, not a lead store)
  case "ai-chat":
    webhook = "https://n8n.fortuneugroup.in/webhook/ai-chat";
    break;

  // All lead types (consultation / contact / sip / insurance) -> Render backend
  default:
    webhook = `${API_BASE}/api/v1/leads`;
}
  const body = {
  type,
  timestamp: new Date().toISOString(),
  name: payload.name,
  mobile: payload.mobile,
  email: payload.email,
  city: payload.city,
  financial_goal: payload.financial_goal,
  message: payload.message,
  insuranceType: payload.insuranceType,
monthlyIncome: payload.monthlyIncome,
sipBudget: payload.sipBudget,
age: payload.age,
familyMembers: payload.familyMembers,
coverageRequirement: payload.coverageRequirement,
};

  if (!webhook) {
    console.warn("[MOCKED LEAD]", body);
    await new Promise((r) => setTimeout(r, 400));
    return { ok: true, mocked: true };
  }
  try {
    const res = await fetch(webhook, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Lead submit failed: ${res.status}`);
    return { ok: true };
  } catch (e) {
    console.error("Lead submit failed", e);
    return { ok: false };
  }
}
