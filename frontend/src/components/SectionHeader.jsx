import React from "react";

export const SectionHeader = ({ eyebrow, title, sub, align = "left", testid }) => (
  <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`} data-testid={testid}>
    {eyebrow && (
      <div className="text-xs tracking-[0.2em] uppercase font-bold text-brand-green mb-3">{eyebrow}</div>
    )}
    <h2 className="font-display text-3xl md:text-4xl tracking-tight text-brand-navy font-semibold leading-tight">{title}</h2>
    {sub && <p className="mt-4 text-base text-brand-mute leading-relaxed">{sub}</p>}
  </div>
);
