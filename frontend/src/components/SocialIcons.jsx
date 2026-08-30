import React from "react";
import { Phone } from "lucide-react";
import { trackEvent } from "./Analytics";
import { WHATSAPP_NUMBER } from "../lib/api";

/* ------------------------------------------------------------------
   Official social-brand assets (inline SVG paths — no text substitutes)

   - Instagram : official outline glyph filled with the brand multicolour
                 gradient (yellow → orange → pink → purple → blue).
                 No single colour, no white circular ring inside.
   - YouTube   : official red rounded-rectangle with a white play triangle.
                 The red shape itself is a rounded rectangle, not a circle.
   - Facebook  : official blue (#1877F2) circular background with a small,
                 centred white lowercase "f".
   - WhatsApp  : solid official WhatsApp green (#25D366) circular
                 background with the white phone/chat glyph.

   All rendered at full opacity — no filters, no opacity reduction.
------------------------------------------------------------------- */

const InstagramGlyph = ({ size = 24 }) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const gid = `fug-ig-${uid}`;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gid} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FEDA75" />
          <stop offset="26%" stopColor="#FA7E1E" />
          <stop offset="52%" stopColor="#D62976" />
          <stop offset="78%" stopColor="#962FBF" />
          <stop offset="100%" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="none" stroke={`url(#${gid})`} strokeWidth="2" />
      <circle cx="12" cy="12" r="4.6" fill="none" stroke={`url(#${gid})`} strokeWidth="2" />
      <circle cx="17.4" cy="6.6" r="1.4" fill={`url(#${gid})`} />
    </svg>
  );
};

const YouTubeGlyph = ({ size = 28 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
    <rect x="1.5" y="4.5" width="21" height="15" rx="4.2" fill="#FF0000" />
    <polygon points="9.7,9.1 15.5,12 9.7,14.9" fill="#FFFFFF" />
  </svg>
);

/* Official Facebook "f" (simple-icons path), scaled down to a small,
   centred f so it does not look oversized inside the blue circle. */
const FACEBOOK_F_PATH =
  "M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z";

const FacebookGlyph = ({ size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
    <path
      d={FACEBOOK_F_PATH}
      fill="#FFFFFF"
      transform="translate(5.9 5.65) scale(0.51)"
    />
  </svg>
);

/* Official WhatsApp glyph (simple-icons path) — full white phone/chat shape. */
const WHATSAPP_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

const WhatsAppGlyph = ({ size = 26 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
    <path d={WHATSAPP_PATH} fill="#FFFFFF" fillRule="evenodd" />
  </svg>
);

const socials = [
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/fortuneugroup/?hl=en",
    // white circular button; brand gradient glyph inside
    buttonClass: "bg-white",
    glyph: <InstagramGlyph />,
    testId: "social-instagram",
  },
  {
    key: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@FortuneUGroupOfficial",
    // white circular button; red rounded-rectangle logo inside
    buttonClass: "bg-white",
    glyph: <YouTubeGlyph />,
    testId: "social-youtube",
  },
  {
    key: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61589015788132",
    // blue circular background with small centred white "f"
    buttonClass: "bg-[#1877F2]",
    glyph: <FacebookGlyph />,
    testId: "social-facebook",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/919490237465",
    // solid official green circular background with white glyph
    buttonClass: "bg-[#25D366]",
    glyph: <WhatsAppGlyph />,
    testId: "floating-whatsapp-fab",
  },
];

/**
 * The four floating social buttons.
 * Size is kept identical to the current floating circular buttons
 * (56px circle: p-4 + 24px icon = 56px ⇒ w-14 h-14).
 */
export const SocialLinks = () => (
  <>
    {socials.map((s) => (
      <a
        key={s.key}
        href={s.href}
        target="_blank"
        rel="noreferrer"
        aria-label={s.label}
        title={s.label}
        onClick={() => trackEvent("social_click", { platform: s.key, source: "fab" })}
        data-testid={s.testId}
        className={`flex items-center justify-center rounded-full w-14 h-14 shadow-2xl ${s.buttonClass} hover:scale-110 transition-transform duration-200`}
      >
        {s.glyph}
      </a>
    ))}
  </>
);

/**
 * Floating right-side social dock. Keeps the existing geometry exactly:
 * fixed bottom-right, 12px equal vertical gaps (gap-3), right-aligned items.
 * The mobile-only Call button is preserved at the bottom of the stack.
 */
export const SocialDock = () => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end" data-testid="floating-actions">
    <SocialLinks />
    <a
      href={`tel:+${WHATSAPP_NUMBER}`}
      onClick={() => trackEvent("call_click", { source: "fab" })}
      data-testid="floating-call-fab"
      className="rounded-full shadow-2xl bg-brand-navy text-white p-4 hover:scale-110 transition-transform sm:hidden"
      aria-label="Call Now"
    >
      <Phone className="w-6 h-6" />
    </a>
  </div>
);

export default SocialDock;
