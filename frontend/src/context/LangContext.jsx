import React, { createContext, useContext, useState, useEffect } from "react";

const LangContext = createContext(null);

const DICT = {
  en: {
    nav: { home: "Home", about: "About", services: "Services", tools: "Tools", blog: "Blog", contact: "Contact", admin: "Admin", start: "Start Your Journey" },
    hero: {
      eyebrow: "Financial Education → Planning → Freedom",
      title: "Build Your Financial Future With Confidence",
      sub: "Mutual Funds · SIP Planning · Goal-Based Investing · Insurance Guidance · Retirement Planning",
      ctaPrimary: "Start Your Investment Journey",
      ctaSecondary: "WhatsApp Consultation",
    },
    common: { learnMore: "Learn more", readMore: "Read article", sendMessage: "Send message", submit: "Submit", calculate: "Calculate" },
  },
  te: {
    nav: { home: "హోమ్", about: "మా గురించి", services: "సేవలు", tools: "టూల్స్", blog: "బ్లాగ్", contact: "సంప్రదించండి", admin: "అడ్మిన్", start: "మొదలు పెట్టండి" },
    hero: {
      eyebrow: "ఆర్థిక విద్య → ప్లానింగ్ → స్వేచ్ఛ",
      title: "మీ ఆర్థిక భవిష్యత్తును ఆత్మవిశ్వాసంతో నిర్మించండి",
      sub: "మ్యూచువల్ ఫండ్స్ · SIP ప్లానింగ్ · లక్ష్యాధారిత పెట్టుబడి · బీమా · రిటైర్‌మెంట్ ప్లానింగ్",
      ctaPrimary: "మీ పెట్టుబడి ప్రారంభించండి",
      ctaSecondary: "వాట్సాప్ సంప్రదింపు",
    },
    common: { learnMore: "మరింత తెలుసుకోండి", readMore: "ఆర్టికల్ చదవండి", sendMessage: "సందేశం పంపండి", submit: "సమర్పించండి", calculate: "లెక్కించు" },
  },
};

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem("fu_lang") || "en");
  useEffect(() => { localStorage.setItem("fu_lang", lang); }, [lang]);
  const t = (path) => {
    const parts = path.split(".");
    let v = DICT[lang];
    for (const p of parts) v = v?.[p];
    if (v == null) {
      v = DICT.en;
      for (const p of parts) v = v?.[p];
    }
    return v;
  };
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);
