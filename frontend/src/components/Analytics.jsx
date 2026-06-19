import { useEffect } from "react";

const GA4_ID = process.env.REACT_APP_GA4_ID;

const Analytics = () => {
  useEffect(() => {
    if (!GA4_ID) return;
    if (document.getElementById("ga4-loader")) return;
    const s = document.createElement("script");
    s.id = "ga4-loader";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(s);
    const inline = document.createElement("script");
    inline.id = "ga4-init";
    inline.textContent = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA4_ID}');`;
    document.head.appendChild(inline);
  }, []);
  return null;
};

export const trackEvent = (name, params = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
};

export default Analytics;
