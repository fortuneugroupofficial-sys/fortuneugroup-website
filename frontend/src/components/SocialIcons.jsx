/* ─────────────────────────────────────────────────────────
   Fortune U Group — shared social brand icon system
   Original brand-color SVG icons (official-style glyphs):

   • Instagram  → gradient (purple/pink/red/orange/yellow) + white glyph
   • YouTube    → red (#FF0000) + white play button
   • Facebook   → blue (#1877F2) + white "f"
   • WhatsApp   → green (#25D366) + white glyph

   Used by BOTH the footer "Connect With Fortune U Group"
   section and the floating social stack (single shared set).
────────────────────────────────────────────────────────── */
import { useId } from "react";

export const SOCIALS = [
  {
    id: "instagram",
    type: "instagram",
    label: "Instagram",
    title: "Follow Fortune U Group on Instagram",
    href: "https://www.instagram.com/fortuneugroup/?hl=en",
  },
  {
    id: "youtube",
    type: "youtube",
    label: "YouTube",
    title: "Watch Fortune U Group on YouTube",
    href: "https://www.youtube.com/@FortuneUGroupOfficial",
  },
  {
    id: "facebook",
    type: "facebook",
    label: "Facebook",
    title: "Follow Fortune U Group on Facebook",
    href: "https://www.facebook.com/profile.php?id=61589015788132",
  },
  {
    id: "whatsapp",
    type: "whatsapp",
    label: "WhatsApp",
    title: "Chat with Fortune U Group on WhatsApp",
    href: "https://wa.me/919490237465",
  },
];

/* Official WhatsApp glyph (Simple Icons path) — white speech bubble
   with the phone handset rendered as a transparent cut-out. */
const WHATSAPP_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z";

/* Brand glyph renderer — each icon keeps its OWN brand colours. */
export function BrandGlyph({ type, className = "w-6 h-6" }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`ig-grad-${uid}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFDC80" />
            <stop offset="15%" stopColor="#F77737" />
            <stop offset="30%" stopColor="#FD1D1D" />
            <stop offset="45%" stopColor="#E1306C" />
            <stop offset="60%" stopColor="#C13584" />
            <stop offset="75%" stopColor="#833AB4" />
            <stop offset="88%" stopColor="#5851DB" />
            <stop offset="100%" stopColor="#405DE6" />
          </linearGradient>
        </defs>
        <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill={`url(#ig-grad-${uid})`} />
        <rect x="6.3" y="6.3" width="11.4" height="11.4" rx="3" fill="none" stroke="#ffffff" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="3.05" fill="none" stroke="#ffffff" strokeWidth="1.7" />
        <circle cx="16.8" cy="7.2" r="1.15" fill="#ffffff" />
      </svg>
    );
  }

  if (type === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
        <rect x="1" y="4.75" width="22" height="14.5" rx="4" fill="#FF0000" />
        <path d="M9.75 8.75v6.5l5.9-3.25z" fill="#ffffff" />
      </svg>
    );
  }

  if (type === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="11" fill="#1877F2" />
        <path
          d="M13.3 21.5v-6.42h2.16l.32-2.5H13.3v-1.6c0-.72.2-1.21 1.24-1.21h1.31V7.29c-.23-.03-1.01-.1-1.92-.1-1.9 0-3.2 1.16-3.2 3.29v1.1H8.42v2.5h2.31v6.42h2.57z"
          fill="#ffffff"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="11" fill="#25D366" />
      <path d={WHATSAPP_PATH} fill="#ffffff" />
    </svg>
  );
}

/* Circular social button — shared by footer and floating stack.
   The button is a neutral container; the glyph carries its own brand colour. */
export function SocialIconButton({ social, variant = "footer", className = "" }) {
  const base =
    "group inline-flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2";
  const variants = {
    footer:
      "bg-white/10 border border-white/10 w-12 h-12 focus-visible:ring-offset-[#0A2540]",
    floating:
      "bg-white shadow-[0_4px_14px_rgba(10,37,64,0.15)] w-12 h-12 focus-visible:ring-offset-white",
  };
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      title={social.title}
      className={`${base} ${variants[variant]} ${className}`}
    >
      <BrandGlyph type={social.type} className="w-6 h-6" />
    </a>
  );
}
