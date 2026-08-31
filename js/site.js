(function () {
  const C = window.FUG || {};
  const wa = "https://wa.me/91" + C.phone + "?text=" + encodeURIComponent("Hi Fortune U Group, I would like to talk about insurance / SIP.");
  const tel = "tel:+91" + C.phone;
  const path = (location.pathname.replace(/\/+$/, "") || "/").toLowerCase();
  const on = (href) => {
    const p = href.replace(".html", "");
    if (p === "/" || p === "/index") return path === "/" || path.endsWith("/index.html") || path.endsWith("/index");
    return path.endsWith(p) || path.endsWith(p + ".html");
  };
  const nav = [
    ["Home", "/index.html"],
    ["Health cover", "/health.html"],
    ["Services", "/services.html"],
    ["SIP tool", "/tools.html"],
    ["Disclosures", "/disclosure.html"],
    ["Contact", "/contact.html"],
  ];

  function licenceBlock(plain) {
    const hasIrdai = !!(C.irdaiLicence && C.irdaiLicence.trim());
    const hasArn = !!(C.arn && C.arn.trim());
    const life = (C.lifeInsurers || []).join(", ");
    const health = (C.healthInsurers || []).join(", ");
    const bits = [];
    bits.push("Fortune U Group");
    if (hasIrdai) bits.push("IRDAI licensed appointments · Ref. " + C.irdaiLicence);
    if (life) bits.push("Life: " + life);
    if (health) bits.push("Health: " + health);
    bits.push("Insurance is the subject matter of solicitation. Policies are issued by the insurer, not by Fortune U Group.");
    if (hasArn) {
      bits.push("AMFI-registered Mutual Fund Distributor · ARN-" + C.arn.replace(/^ARN-?/i, ""));
      bits.push("Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.");
    } else {
      bits.push("Mutual fund distribution: AMFI ARN not yet allotted. We do not currently distribute mutual fund units. SIP figures on this site are educational illustrations only.");
    }
    bits.push("Fortune U Group is not a SEBI-registered Investment Adviser. Commission is paid by insurers" + (hasArn ? " and AMCs" : "") + ". No advisory fee is charged.");
    return bits.join(plain ? "\n" : "<br>");
  }

  const igSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.7 6.3a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1z"/></svg>';
  const ytSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM9.8 15.5v-6.6l6.3 3.3-6.3 3.3z"/></svg>';
  const fbSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 8.5V6.8c0-.7.5-1 1.1-1H17V3h-2.3C12.2 3 11 4.4 11 6.6v1.9H9v2.8h2V21h3.5v-9.7h2.4l.4-2.8h-2.8z"/></svg>';
  const waSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.1-.3c0-.1 0-.3-.1-.4s-.5-1.3-.7-1.8-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3a2.1 2.1 0 0 0-.7 1.6 3.7 3.7 0 0 0 .8 2c.1.1 1.4 2.2 3.5 3 2 .9 2 .6 2.4.6a2 2 0 0 0 1.3-.6 1.7 1.7 0 0 0 .4-1.2c0-.1 0-.2-.2-.3z"/></svg>';

  const socials = [
    C.instagram && { href: C.instagram, cls: "social-ig", label: "Instagram", svg: igSvg },
    C.youtube && { href: C.youtube, cls: "social-yt", label: "YouTube", svg: ytSvg },
    C.facebook && C.facebook !== "https://www.facebook.com/" && { href: C.facebook, cls: "social-fb", label: "Facebook", svg: fbSvg },
    { href: wa, cls: "social-wa", label: "WhatsApp", svg: waSvg },
  ].filter(Boolean);

  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <header class="site-header">
        <div class="wrap nav">
          <a class="brand" href="/index.html">
            <img src="/images/logo-180.png" alt="Fortune U Group logo">
            <div class="brand-name">FORTUNE U GROUP<span>TIRUPATI</span></div>
          </a>
          <button class="menu-btn" type="button" id="menuBtn" aria-label="Menu">Menu</button>
          <nav class="nav-links" id="navLinks">
            ${nav.map(([l, h]) => `<a class="${on(h) ? "active" : ""}" href="${h}">${l}</a>`).join("")}
            <a class="btn btn-gold" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>
          </nav>
        </div>
      </header>`;
    const btn = document.getElementById("menuBtn");
    const links = document.getElementById("navLinks");
    if (btn) btn.onclick = () => links.classList.toggle("open");
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="wrap">
          <div class="foot-grid">
            <div>
              <h4>Fortune U Group</h4>
              <p>Licensed insurance agency and (after ARN) mutual fund distribution for families in Tirupati and nearby districts.</p>
              <p>${C.city}<br><a href="${tel}">${C.phoneDisplay}</a><br><a href="mailto:${C.email}">${C.email}</a></p>
            </div>
            <div>
              <h4>Explore</h4>
              <p>
                <a href="/health.html">Health insurance</a><br>
                <a href="/services.html">Services</a><br>
                <a href="/tools.html">SIP illustration</a><br>
                <a href="/disclosure.html">Regulatory disclosures</a><br>
                <a href="/privacy.html">Privacy</a><br>
                <a href="/terms.html">Terms</a>
              </p>
            </div>
            <div>
              <h4>Connect</h4>
              <div class="social-row">
                ${socials.map((s) => `<a class="${s.cls}" href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}">${s.svg}</a>`).join("")}
              </div>
            </div>
          </div>
          <div class="fineprint">${licenceBlock(false)}<br><br>© ${new Date().getFullYear()} Fortune U Group. All rights reserved.</div>
        </div>
      </footer>`;
  }

  const dock = document.createElement("div");
  dock.className = "social-dock";
  dock.setAttribute("aria-label", "Social links");
  dock.innerHTML = socials.map((s) => `<a class="${s.cls}" href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}">${s.svg}</a>`).join("");
  document.body.appendChild(dock);

  window.FUG_WA = wa;
  window.FUG_licenceText = licenceBlock;

  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.setAttribute("href", wa);
  });
  document.querySelectorAll("[data-tel]").forEach((el) => {
    el.setAttribute("href", tel);
    if (!el.textContent.trim()) el.textContent = C.phoneDisplay;
  });
  document.querySelectorAll("[data-email]").forEach((el) => {
    el.setAttribute("href", "mailto:" + C.email);
    if (!el.textContent.trim()) el.textContent = C.email;
  });

  const form = document.getElementById("consultForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const box = document.getElementById("formMsg");
      const data = Object.fromEntries(new FormData(form).entries());
      box.className = "notice";
      box.textContent = "Sending…";
      try {
      fetch(`${C.apiBase}/api/v1/leads`, ...)   // → https://fortunegroup-website.onrender.com/api/v1/leads
        const res = await fetch(C.webhookConsult, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: "fortuneugroup-website", ...data }),
        });
        if (!res.ok) throw new Error("bad status");
        box.className = "notice ok";
        box.textContent = "Received. We will contact you on the number you shared.";
        form.reset();
      } catch (err) {
        const msg = `Hi Fortune U Group, I am ${data.name || ""}. Goal: ${data.goal || ""}. Please call me.`;
        box.className = "notice err";
        box.innerHTML = `Could not send from this browser. <a href="https://wa.me/91${C.phone}?text=${encodeURIComponent(msg)}">Continue on WhatsApp</a>.`;
      }
    });
  }

  const sip = document.getElementById("sipForm");
  if (sip) {
    const out = () => {
      const p = Number(document.getElementById("sipAmt").value || 0);
      const y = Number(document.getElementById("sipYrs").value || 0);
      const r = Number(document.getElementById("sipRate").value || 0);
      document.getElementById("sipAmtLabel").textContent = "₹" + p.toLocaleString("en-IN");
      document.getElementById("sipYrsLabel").textContent = y + " years";
      document.getElementById("sipRateLabel").textContent = r + "%";
      const i = r / 12 / 100;
      const n = y * 12;
      const fv = i === 0 ? p * n : p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const inv = p * n;
      document.getElementById("sipInvested").textContent = "₹" + Math.round(inv).toLocaleString("en-IN");
      document.getElementById("sipEst").textContent = "₹" + Math.round(fv).toLocaleString("en-IN");
    };
    sip.addEventListener("input", out);
    out();
  }
})();
