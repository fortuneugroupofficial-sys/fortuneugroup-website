import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Falls back to the GA4 id already configured in public/index.html so SPA
// page views are tracked even when the Vercel env var is not set.
const GA4_ID = process.env.REACT_APP_GA4_ID || "G-5P0R5EM9C6";

const Analytics = () => {
  const location = useLocation();

  // Load gtag.js once (skip if public/index.html already loaded it)
  useEffect(() => {
    if (!GA4_ID) return;
    if (typeof window.gtag === "function") return;
    if (document.getElementById("ga4-loader")) return;
    const s = document.createElement("script");
    s.id = "ga4-loader";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(s);
    const inline = document.createElement("script");
    inline.id = "ga4-init";
    inline.textContent = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag = gtag; gtag('js', new Date()); gtag('config', '${GA4_ID}', { send_page_view: false });`;
    document.head.appendChild(inline);
  }, []);

  // Track SPA pageviews on route change
  useEffect(() => {
    if (!GA4_ID || typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  return null;
};

export const trackEvent = (name, params = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
};

export default Analytics;
