import { useEffect } from "react";

const DEFAULTS = {
  site: "Fortune U Group",
  url: "https://www.fortuneugroup.in",
  image: "https://images.pexels.com/photos/5402587/pexels-photo-5402587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

const setMeta = (selector, attr, value) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const [k, v] = selector.replace(/[\[\]"']/g, "").split("=");
    el.setAttribute(k, v);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const setLink = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
  el.setAttribute("href", href);
};

const setSchema = (id, json) => {
  let el = document.getElementById(id);
  if (!el) { el = document.createElement("script"); el.id = id; el.type = "application/ld+json"; document.head.appendChild(el); }
  el.textContent = JSON.stringify(json);
};

const SEO = ({ title, description, path = "", image, schema }) => {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${DEFAULTS.site}` : DEFAULTS.site;
    document.title = fullTitle;
    const url = `${DEFAULTS.url}${path}`;
    const img = image || DEFAULTS.image;
    setMeta('meta[name="description"]', "content", description || "");
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description || "");
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", img);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description || "");
    setMeta('meta[name="twitter:image"]', "content", img);
    setLink("canonical", url);
    if (schema) setSchema("page-schema", schema);
  }, [title, description, path, image, schema]);
  return null;
};

export default SEO;
