import React, { createContext, useContext, useState, useEffect } from "react";

const LangContext = createContext(null);

const DICT = {
  en: {
    nav: { home: "Home", about: "About", services: "Services", products: "Products", tools: "Tools", blog: "Blog", contact: "Contact", admin: "Admin", start: "Start Your Journey", call: "Call Now" },
    hero: {
     eyebrow: "Mutual Fund Distributor • Financial Planning • SIP Investments",

     title: "Achieve Your Financial Goals With Expert Planning",

     sub: "Mutual Funds • SIP Planning • Goal-Based Investing • Retirement Planning • Insurance Guidance",

     ctaPrimary: "Start Your Financial Plan",

     ctaSecondary: "Free WhatsApp Consultation",
   },
    home: {
      whyEyebrow: "Why Fortune U",
      whyTitle: "Education-first. Goal-driven. Built for the long haul.",
      whySub: "We don't sell schemes. We teach families how money works, design a goal-based plan, and stay with you for the journey.",
      consultEyebrow: "Free Consultation",
      consultTitle: "Tell us your goal. We'll build the plan.",
      consultSub: "A no-obligation, 30-minute conversation. Get clarity on where your money should go — for the next 5, 10 and 30 years.",
      testEyebrow: "Investor stories",
      testTitle: "Real families. Real journeys.",
      faqEyebrow: "Common questions",
      faqTitle: "Investing FAQs",
    },
    about: {
      eyebrow: "About Fortune U Group",
      title: "A trusted financial education & wealth planning partner for Indian families.",
      lead: "Fortune U Group was founded on a simple belief: financial freedom is built through education, planning and disciplined investing — not by chasing markets. We work with salaried employees, business owners, professionals, families and retirement planners to design goal-based portfolios that compound for decades.",
      mission: "Our Mission", missionT: "Helping Indian families achieve Financial Freedom through Education, Planning, and Disciplined Investing.",
      vision: "Our Vision", visionT: "To become India's most trusted Financial Education and Wealth Planning platform — known for transparency, depth and long-term client outcomes.",
      valuesEyebrow: "Our Values", valuesTitle: "What we stand for",
    },
    services: { eyebrow: "Our Services", title: "Eight ways we help Indian families build long-term wealth.", sub: "From your first SIP to your retirement corpus — Fortune U Group is your education + planning + investment partner under one roof." },
    tools: { eyebrow: "Free Calculators", title: "Plan your future in numbers. Then turn it into a plan.", sub: "Use our interactive calculators to see exactly how much you need to invest — and what your money can become." },
    blog: { eyebrow: "Investor Education", title: "Articles to help you invest smarter.", search: "Search articles…" },
    contact: { eyebrow: "Get in touch", title: "Let's design your financial roadmap.", sub: "Reach us via form, WhatsApp or email. Most queries are answered within 4 working hours.", form: "Send message", reach: "Multiple ways to connect" },
    common: { learnMore: "Learn more", readMore: "Read article", sendMessage: "Send message", submit: "Submit", calculate: "Calculate", bookConsult: "Book Free Consultation" },
  },
  te: {
    nav: { home: "హోమ్", about: "మా గురించి", services: "సేవలు", tools: "టూల్స్", blog: "బ్లాగ్", contact: "సంప్రదించండి", admin: "అడ్మిన్", start: "మొదలు పెట్టండి", call: "ఇప్పుడే కాల్" },
    hero: {
     eyebrow: "మ్యూచువల్ ఫండ్ డిస్ట్రిబ్యూటర్ • ఫైనాన్షియల్ ప్లానింగ్",

     title: "మీ ఆర్థిక లక్ష్యాలను నిపుణుల ప్రణాళికతో సాధించండి ",

     sub: "మ్యూచువల్ ఫండ్స్ • SIP • రిటైర్మెంట్ ప్లానింగ్ • గోల్ బేస్డ్ ఇన్వెస్టింగ్",

     ctaPrimary: "మీ పెట్టుబడి ప్రారంభించండి",

     ctaSecondary: "WhatsApp సంప్రదించండి",
    },
    home: {
      whyEyebrow: "ఎందుకు Fortune U",
      whyTitle: "విద్య మొదట. లక్ష్యం ప్రధానం. దీర్ఘకాలానికి నిర్మించబడింది.",
      whySub: "మేము స్కీములను అమ్మము. డబ్బు ఎలా పనిచేస్తుందో కుటుంబాలకు బోధిస్తాము, లక్ష్య ఆధారిత ప్రణాళికను రూపొందిస్తాము, మీతో పాటు ఉంటాము.",
      consultEyebrow: "ఉచిత సంప్రదింపు",
      consultTitle: "మీ లక్ష్యం చెప్పండి. మేము ప్రణాళికను నిర్మిస్తాము.",
      consultSub: "నిబంధనలు లేని, 30 నిమిషాల సంభాషణ. తదుపరి 5, 10, 30 సంవత్సరాలకు మీ డబ్బు ఎక్కడికి వెళ్లాలో స్పష్టత పొందండి.",
      testEyebrow: "పెట్టుబడిదారుల కథలు",
      testTitle: "నిజమైన కుటుంబాలు. నిజమైన ప్రయాణాలు.",
      faqEyebrow: "సాధారణ ప్రశ్నలు",
      faqTitle: "పెట్టుబడి FAQs",
    },
    about: {
      eyebrow: "Fortune U Group గురించి",
      title: "భారతీయ కుటుంబాలకు నమ్మదగిన ఆర్థిక విద్య & సంపద ప్రణాళిక భాగస్వామి.",
      lead: "Fortune U Group ఒక సరళమైన నమ్మకంపై స్థాపించబడింది: ఆర్థిక స్వేచ్ఛ విద్య, ప్రణాళిక మరియు క్రమశిక్షణతో కూడిన పెట్టుబడుల ద్వారా నిర్మించబడుతుంది — మార్కెట్‌లను వెంబడించడం ద్వారా కాదు.",
      mission: "మా లక్ష్యం", missionT: "విద్య, ప్రణాళిక మరియు క్రమశిక్షణతో కూడిన పెట్టుబడి ద్వారా భారతీయ కుటుంబాలకు ఆర్థిక స్వేచ్ఛను సాధించడంలో సహాయం చేయడం.",
      vision: "మా దృష్టి", visionT: "భారతదేశంలో అత్యంత నమ్మదగిన ఆర్థిక విద్య మరియు సంపద ప్రణాళిక వేదికగా మారడం.",
      valuesEyebrow: "మా విలువలు", valuesTitle: "మేము నిలబడేవి",
    },
    services: { eyebrow: "మా సేవలు", title: "భారతీయ కుటుంబాలకు దీర్ఘకాలిక సంపదను నిర్మించడంలో సహాయపడే ఎనిమిది మార్గాలు.", sub: "మీ మొదటి SIP నుండి రిటైర్‌మెంట్ కార్పస్ వరకు — Fortune U Group మీ విద్య + ప్రణాళిక + పెట్టుబడి భాగస్వామి." },
    tools: { eyebrow: "ఉచిత కాలిక్యులేటర్లు", title: "మీ భవిష్యత్తును సంఖ్యలలో ప్లాన్ చేయండి.", sub: "మీరు ఎంత పెట్టుబడి పెట్టాలో మరియు మీ డబ్బు ఏమి కావచ్చో చూడటానికి మా ఇంటరాక్టివ్ కాలిక్యులేటర్‌లను ఉపయోగించండి." },
    blog: { eyebrow: "పెట్టుబడిదారుల విద్య", title: "తెలివిగా పెట్టుబడి పెట్టడంలో సహాయపడే వ్యాసాలు.", search: "వ్యాసాలను శోధించండి…" },
    contact: { eyebrow: "సంప్రదించండి", title: "మీ ఆర్థిక రోడ్‌మ్యాప్‌ను రూపొందిద్దాం.", sub: "ఫారం, వాట్సాప్ లేదా ఇమెయిల్ ద్వారా మమ్మల్ని చేరుకోండి. చాలా ప్రశ్నలకు 4 పని గంటల్లో సమాధానం ఇవ్వబడుతుంది.", form: "సందేశం పంపండి", reach: "మాతో కనెక్ట్ అయ్యే అనేక మార్గాలు" },
    common: { learnMore: "మరింత తెలుసుకోండి", readMore: "ఆర్టికల్ చదవండి", sendMessage: "సందేశం పంపండి", submit: "సమర్పించండి", calculate: "లెక్కించు", bookConsult: "ఉచిత సంప్రదింపు బుక్ చేయండి" },
  },
};

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem("fu_lang") || "en");
  useEffect(() => { localStorage.setItem("fu_lang", lang); document.documentElement.lang = lang === "te" ? "te" : "en"; }, [lang]);
  const t = (path) => {
    const parts = path.split(".");
    let v = DICT[lang];
    for (const p of parts) v = v?.[p];
    if (v == null) { v = DICT.en; for (const p of parts) v = v?.[p]; }
    return v ?? path;
  };
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);
