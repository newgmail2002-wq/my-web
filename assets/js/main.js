/* ==========================================================================
   Jaskaran Singh — site engine
   Vanilla JS, no dependencies.

   --------------------------------------------------------------------------
   WHATSAPP (primary): the contact form hands off to WhatsApp with the
   enquiry pre-written. Country code + number, digits only — no +, no spaces.
   91 = India.
   --------------------------------------------------------------------------
   FORMSPREE (optional backup): leave as-is and the form is WhatsApp-only.
   If you add an ID, you ALSO get an email copy of every enquiry — worth doing,
   because WhatsApp only delivers if the customer actually presses Send.
       1. Sign up free at https://formspree.io
       2. Create a form -> you get https://formspree.io/f/xyzabcd
       3. Paste just the last part (xyzabcd) below.
   ========================================================================== */

const WHATSAPP_NUMBER = "919501347341";
const FORMSPREE_ID = "YOUR_FORMSPREE_ID";

(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ------------------------------------------------------------------ *
   * Footer year
   * ------------------------------------------------------------------ */
  $$("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ------------------------------------------------------------------ *
   * Sticky nav
   * ------------------------------------------------------------------ */
  const nav = $(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * Mobile drawer
   * ------------------------------------------------------------------ */
  const burger = $(".burger");
  const drawer = $(".drawer");

  if (burger && drawer) {
    const setDrawer = (open) => {
      burger.setAttribute("aria-expanded", String(open));
      drawer.classList.toggle("is-open", open);
      document.body.classList.toggle("is-locked", open);
      drawer.setAttribute("aria-hidden", String(!open));
    };

    burger.addEventListener("click", () => {
      setDrawer(burger.getAttribute("aria-expanded") !== "true");
    });

    // Close on link tap or Escape
    $$("a", drawer).forEach((a) => a.addEventListener("click", () => setDrawer(false)));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        setDrawer(false);
        burger.focus();
      }
    });

    // Reset when resizing back up to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 940 && drawer.classList.contains("is-open")) setDrawer(false);
    });
  }

  /* ------------------------------------------------------------------ *
   * Scroll progress bar
   * ------------------------------------------------------------------ */
  const progress = $(".progress");
  if (progress) {
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      progress.style.transform = `scaleX(${Math.min(pct, 1)})`;
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /* ------------------------------------------------------------------ *
   * Scroll reveal
   * ------------------------------------------------------------------ */
  const revealables = $$("[data-reveal], .step");

  if (revealables.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealables.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            io.unobserve(entry.target); // reveal once, then stop watching
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealables.forEach((el) => io.observe(el));
    }
  }

  /* ------------------------------------------------------------------ *
   * Animated counters
   * ------------------------------------------------------------------ */
  const counters = $$("[data-count]");

  if (counters.length) {
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const final = target.toFixed(decimals) + suffix;
      const duration = 1600;
      const start = performance.now();

      // The final value is guaranteed by a timer, not by the last frame landing.
      // rAF stops in a backgrounded tab and can drop frames under load — without
      // this, a counter freezes forever on a wrong number like "23/7".
      let done = false;
      const land = () => {
        if (done) return;
        done = true;
        el.textContent = final;
      };
      const safety = setTimeout(land, duration + 400);

      const tick = (now) => {
        if (done) return;
        const t = Math.min((now - start) / duration, 1);
        if (t >= 1) {
          clearTimeout(safety);
          land();
          return;
        }
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach((el) => {
        el.textContent = el.dataset.count + (el.dataset.suffix || "");
      });
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            run(entry.target);
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => io.observe(el));
    }
  }

  /* ------------------------------------------------------------------ *
   * Card spotlight + 3D tilt
   * ------------------------------------------------------------------ */
  if (canHover && !reduceMotion) {
    $$(".card").forEach((card) => {
      const tilt = card.classList.contains("card--tilt");

      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;

        // Feed the CSS spotlight
        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);

        if (!tilt) return;
        const rx = ((y / r.height - 0.5) * -9).toFixed(2);
        const ry = ((x / r.width - 0.5) * 9).toFixed(2);
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
      });

      card.addEventListener("pointerleave", () => {
        if (tilt) card.style.transform = "";
      });
    });

    /* Portrait tilt */
    $$(".portrait-wrap").forEach((wrap) => {
      const frame = $(".portrait", wrap);
      if (!frame) return;

      wrap.addEventListener("pointermove", (e) => {
        const r = wrap.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
        frame.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.015)`;
      });

      wrap.addEventListener("pointerleave", () => {
        frame.style.transform = "";
      });
    });

    /* Magnetic buttons */
    $$("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.22;
        const y = (e.clientY - r.top - r.height / 2) * 0.32;
        btn.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.translate = "";
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Cursor glow
   * ------------------------------------------------------------------ */
  if (canHover && !reduceMotion) {
    const glow = $(".cursor-glow");
    if (glow) {
      let tx = 0,
        ty = 0,
        cx = 0,
        cy = 0,
        raf = null;

      const loop = () => {
        // Lerp toward the pointer so the glow trails slightly
        cx += (tx - cx) * 0.12;
        cy += (ty - cy) * 0.12;
        glow.style.transform = `translate3d(${cx - 210}px, ${cy - 210}px, 0)`;
        raf = Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4 ? requestAnimationFrame(loop) : null;
      };

      window.addEventListener(
        "pointermove",
        (e) => {
          tx = e.clientX;
          ty = e.clientY;
          glow.classList.add("is-on");
          if (!raf) raf = requestAnimationFrame(loop);
        },
        { passive: true }
      );

      document.addEventListener("pointerleave", () => glow.classList.remove("is-on"));
    }
  }

  /* ------------------------------------------------------------------ *
   * Starfield
   * ------------------------------------------------------------------ */
  const canvas = $("#stars");

  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0,
      h = 0,
      dpr = 1,
      stars = [],
      comets = [],
      raf = null,
      px = 0,
      py = 0; // pointer parallax

    const rand = (min, max) => Math.random() * (max - min) + min;

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales with viewport, but stays capped for perf
      const count = Math.min(150, Math.floor((w * h) / 11000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: rand(0.25, 1), // depth: drives size, speed and parallax
        r: rand(0.4, 1.5),
        drift: rand(0.02, 0.14),
        phase: Math.random() * Math.PI * 2,
        tw: rand(0.6, 2.2), // twinkle rate
        hue: Math.random() > 0.75 ? 190 : 265, // mostly violet, some cyan
      }));
    };

    const spawnComet = () => {
      comets.push({
        x: rand(w * 0.1, w),
        y: rand(-40, h * 0.45),
        len: rand(70, 190),
        speed: rand(5, 10),
        life: 1,
      });
    };

    let last = performance.now();

    const frame = (now) => {
      const dt = Math.min((now - last) / 16.67, 3); // normalised to ~60fps
      last = now;

      ctx.clearRect(0, 0, w, h);

      // Stars
      for (const s of stars) {
        s.y -= s.drift * s.z * dt;
        if (s.y < -2) {
          s.y = h + 2;
          s.x = Math.random() * w;
        }

        s.phase += 0.02 * s.tw * dt;
        const twinkle = 0.45 + Math.sin(s.phase) * 0.35;

        // Deeper stars move less with the pointer
        const ox = px * s.z * 14;
        const oy = py * s.z * 14;

        ctx.beginPath();
        ctx.arc(s.x + ox, s.y + oy, s.r * s.z, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 90%, 78%, ${twinkle * s.z})`;
        ctx.fill();
      }

      // Comets
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x -= c.speed * dt;
        c.y += c.speed * 0.42 * dt;
        c.life -= 0.006 * dt;

        if (c.life <= 0 || c.x < -c.len || c.y > h + c.len) {
          comets.splice(i, 1);
          continue;
        }

        const grad = ctx.createLinearGradient(c.x, c.y, c.x + c.len, c.y - c.len * 0.42);
        grad.addColorStop(0, `rgba(255,255,255,${0.85 * c.life})`);
        grad.addColorStop(1, "rgba(139,92,246,0)");

        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x + c.len, c.y - c.len * 0.42);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      if (Math.random() < 0.0022 * dt && comets.length < 2) spawnComet();

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        px = (e.clientX / window.innerWidth - 0.5) * 2;
        py = (e.clientY / window.innerHeight - 0.5) * 2;
      },
      { passive: true }
    );

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 180);
    });

    // Don't burn CPU on a hidden tab
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

    build();
    start();
  }

  /* ------------------------------------------------------------------ *
   * Contact form
   * ------------------------------------------------------------------ */
  const form = $("#contact-form");

  if (form) {
    const status = $("#form-status");
    const submit = $("#form-submit", form);

    const setError = (field, msg) => {
      const box = field.closest(".field");
      const slot = box ? $(".field__error", box) : null;
      if (slot) slot.textContent = msg;
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    };

    const validate = () => {
      let ok = true;

      const name = $("#name", form);
      ok = setError(name, name.value.trim().length < 2 ? "Please enter your name." : "") && ok;

      const email = $("#email", form);
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
      ok = setError(email, emailOk ? "" : "Please enter a valid email address.") && ok;

      const service = $("#service", form);
      ok = setError(service, service.value ? "" : "Please choose a service.") && ok;

      const message = $("#message", form);
      ok =
        setError(message, message.value.trim().length < 10 ? "Tell me a little more (10+ characters)." : "") &&
        ok;

      return ok;
    };

    // Clear a field's error as soon as the user fixes it
    $$("input, textarea, select", form).forEach((el) => {
      el.addEventListener("input", () => {
        if (el.getAttribute("aria-invalid") === "true") setError(el, "");
      });
    });

    const show = (type, msg) => {
      if (!status) return;
      status.className = `form-status is-shown form-status--${type}`;
      status.textContent = msg;
    };

    /* Compose the WhatsApp message from the form fields */
    const buildMessage = () => {
      const v = (id) => ($(`#${id}`, form)?.value || "").trim();
      const sel = $("#service", form);
      const serviceLabel = sel.selectedOptions[0]?.text || sel.value;

      const lines = ["New enquiry from your website", "", `Name: ${v("name")}`, `Email: ${v("email")}`];
      if (v("brand")) lines.push(`Brand: ${v("brand")}`);
      if (v("country")) lines.push(`Country: ${v("country")}`);
      lines.push(`Service: ${serviceLabel}`, "", "What they're trying to achieve:", v("message"));
      return lines.join("\n");
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Honeypot: only bots fill this
      if ($("#company", form) && $("#company", form).value) return;

      if (!validate()) {
        show("err", "Please fix the highlighted fields and try again.");
        const bad = $("[aria-invalid='true']", form);
        if (bad) bad.focus();
        return;
      }

      // Open WhatsApp synchronously, still inside the click gesture — any `await`
      // before this point would let the popup blocker swallow it.
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
      const win = window.open(waUrl, "_blank", "noopener");
      if (!win) location.href = waUrl; // popup blocked — go there directly instead

      show(
        "ok",
        "WhatsApp is opening with your message ready — press Send there and it reaches me straight away. I reply to every enquiry personally."
      );

      // Optional email backup. WhatsApp only delivers if the customer presses
      // Send; this makes sure the lead still reaches you if they don't.
      if (FORMSPREE_ID !== "YOUR_FORMSPREE_ID") {
        fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        }).catch(() => {
          /* WhatsApp is already open — never block the lead on this */
        });
      }
    });

    // Deep-link a service: contact.html?service=ai-calling-agent
    const preset = new URLSearchParams(location.search).get("service");
    if (preset) {
      const select = $("#service", form);
      const match = $$("option", select).find((o) => o.value === preset);
      if (match) select.value = preset;
    }
  }
})();
