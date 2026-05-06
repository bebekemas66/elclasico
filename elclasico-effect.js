(function () {
  function start() {
    // ================= CONFIG =================
    const MATCH_TITLE = "EL CLASICO";
    const TEAM_LEFT = "Barcelona";
    const TEAM_RIGHT = "Real Madrid";
    const MATCH_INFO = "Senin, 11 Mei 2026 • 02.00 WIB";

    // Logo / asset URL
    const BARCA_LOGO = "";
    const MADRID_LOGO = "";

    // Icon dekorasi
    const BALL_ICON = "";
    const STAR_ICON = "";

    // Audio opsional. Kosongkan kalau tidak mau musik.
    const AUDIO_URL = "";
    const AUDIO_VOLUME = 0.35;

    // Effect intensity
    const RAMP_DURATION_MS = 30000;
    const SPAWN_FAST_MS = 260;
    const SPAWN_SLOW_MS = 850;

    let userPaused = false;
    let audio = null;

    // ================= STYLE =================
    if (!document.getElementById("gm-elclasico-style")) {
      const style = document.createElement("style");
      style.id = "gm-elclasico-style";
      style.textContent = `
        #gm-elclasico-overlay,
        #gm-elclasico-rain,
        #gm-elclasico-sweep,
        #gm-elclasico-toast,
        #gm-elclasico-banner {
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }

        #gm-elclasico-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 2147483640;
          overflow: hidden;
        }

        #gm-elclasico-overlay::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 50% 8%, rgba(255,255,255,0.12), transparent 28%),
            radial-gradient(circle at 50% 100%, rgba(0,0,0,0.35), transparent 45%),
            linear-gradient(to bottom, rgba(7,12,24,0.08), rgba(0,0,0,0.20));
        }

        #gm-elclasico-overlay::after {
          content: "";
          position: absolute;
          left: 50%;
          top: -18%;
          transform: translateX(-50%);
          width: 1200px;
          height: 450px;
          background:
            radial-gradient(circle at 15% 50%, rgba(255,255,255,0.15), transparent 18%),
            radial-gradient(circle at 35% 50%, rgba(255,255,255,0.12), transparent 18%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18), transparent 18%),
            radial-gradient(circle at 65% 50%, rgba(255,255,255,0.12), transparent 18%),
            radial-gradient(circle at 85% 50%, rgba(255,255,255,0.15), transparent 18%);
          filter: blur(12px);
          opacity: .75;
        }

        #gm-elclasico-sweep {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 2147483642;
          overflow: hidden;
        }

        #gm-elclasico-sweep::before {
          content: "";
          position: absolute;
          top: -20%;
          left: -120%;
          width: 65%;
          height: 140%;
          background: linear-gradient(
            115deg,
            transparent 0%,
            rgba(255,255,255,0) 35%,
            rgba(255,255,255,0.11) 50%,
            rgba(255,255,255,0) 65%,
            transparent 100%
          );
          transform: skewX(-12deg);
          animation: gmElClasicoSweep 14s ease-in-out infinite;
        }

        @keyframes gmElClasicoSweep {
          0% { left: -120%; opacity: 0; }
          8% { opacity: 1; }
          30% { left: 140%; opacity: 1; }
          31% { opacity: 0; }
          100% { left: 140%; opacity: 0; }
        }

        #gm-elclasico-banner {
          position: fixed;
          left: 50%;
          bottom: 20px;
          transform: translateX(-50%);
          z-index: 2147483647;
          width: min(92vw, 760px);
          pointer-events: none;
          animation: gmBannerUp 1s cubic-bezier(.2,.8,.2,1);
        }

        #gm-elclasico-banner .box {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 18px;
          border-radius: 22px;
          background:
            linear-gradient(90deg,
              rgba(0, 77, 152, 0.72) 0%,
              rgba(70, 18, 35, 0.86) 34%,
              rgba(16, 16, 20, 0.90) 52%,
              rgba(220, 220, 220, 0.18) 100%);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow: 0 18px 40px rgba(0,0,0,0.38);
          overflow: hidden;
        }

        #gm-elclasico-banner .box::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg,
              rgba(165, 0, 68, 0.24) 0%,
              transparent 35%,
              transparent 65%,
              rgba(255, 215, 90, 0.12) 100%);
          pointer-events: none;
        }

        #gm-elclasico-banner .team {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          flex: 1;
        }

        #gm-elclasico-banner .team.right {
          justify-content: flex-end;
          text-align: right;
        }

        #gm-elclasico-banner .logo {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          object-fit: contain;
          background: rgba(255,255,255,0.95);
          padding: 4px;
          box-shadow: 0 0 0 2px rgba(255,255,255,0.10);
          flex: 0 0 auto;
        }

        #gm-elclasico-banner .fallback-logo {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 900;
          color: #fff;
          flex: 0 0 auto;
          box-shadow: 0 0 0 2px rgba(255,255,255,0.12);
        }

        #gm-elclasico-banner .fallback-logo.barca {
          background: linear-gradient(135deg, #004D98, #A50044);
        }

        #gm-elclasico-banner .fallback-logo.madrid {
          background: linear-gradient(135deg, #f7f7f7, #d4af37);
          color: #1a1a1a;
        }

        #gm-elclasico-banner .name {
          font-weight: 850;
          font-size: 18px;
          line-height: 1.1;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        #gm-elclasico-banner .center {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 170px;
          text-align: center;
        }

        #gm-elclasico-banner .title {
          font-size: 20px;
          font-weight: 950;
          letter-spacing: 1px;
          color: #ffd86b;
          line-height: 1.1;
          text-shadow: 0 2px 12px rgba(0,0,0,0.45);
        }

        #gm-elclasico-banner .info {
          margin-top: 4px;
          font-size: 12px;
          font-weight: 800;
          color: #f3f3f3;
          opacity: .96;
        }

        #gm-elclasico-banner .vs {
          margin-top: 4px;
          font-size: 12px;
          font-weight: 900;
          color: rgba(255,255,255,0.85);
          letter-spacing: 1px;
        }

        @keyframes gmBannerUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        #gm-elclasico-toast {
          position: fixed;
          left: 50%;
          top: 16px;
          transform: translateX(-50%);
          z-index: 2147483647;
          pointer-events: none;
          opacity: 0;
          animation: gmToastCine 5.8s cubic-bezier(.16,1,.2,1) forwards;
          will-change: transform, opacity, filter;
        }

        #gm-elclasico-toast .box {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(10,10,10,.62);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,.18);
          box-shadow: 0 18px 48px rgba(0,0,0,.45);
          overflow: hidden;
        }

        #gm-elclasico-toast .dot {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: #ffd86b;
          box-shadow: 0 0 18px rgba(255,216,107,.7);
          flex: 0 0 auto;
        }

        #gm-elclasico-toast .txt {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        #gm-elclasico-toast .t1 {
          font: 850 13px/1.1 system-ui, Segoe UI, Arial;
          color: #f7f1dc;
          margin: 0;
        }

        #gm-elclasico-toast .t2 {
          font: 950 16px/1.1 system-ui, Segoe UI, Arial;
          color: #ffd86b;
          margin: 0;
        }

        @keyframes gmToastCine {
          0% { opacity: 0; transform: translateX(-50%) translateY(-22px) scale(.92); filter: blur(2px); }
          14% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); filter: blur(0); }
          72% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(.98); filter: blur(.6px); }
        }

        #gm-elclasico-rain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 2147483646;
        }

        @keyframes gmFallTop {
          from { top: -80px; opacity: .95; }
          to { top: 110vh; opacity: .9; }
        }

        @keyframes gmSway {
          0% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(var(--dx)) rotate(var(--rot)); }
          100% { transform: translateX(0) rotate(calc(var(--rot) * -1)); }
        }

        #gm-elclasico-rain .fx {
          position: absolute;
          left: var(--x);
          top: -80px;
          width: var(--size);
          animation:
            gmFallTop var(--dur) linear forwards,
            gmSway var(--sway) ease-in-out infinite;
          will-change: top, transform;
          pointer-events: none;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.20));
        }

        #gm-audio-btn {
          position: fixed;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2147483647;
          padding: 8px 10px;
          font-size: 14px;
          line-height: 1;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: rgba(255,215,90,0.95);
          color: #1a1a1a;
          outline: 2px solid rgba(255,255,255,0.55);
          box-shadow: 0 6px 14px rgba(0,0,0,.35);
        }

        @media (max-width: 640px) {
          #gm-elclasico-banner {
            width: min(94vw, 94vw);
            bottom: 14px;
          }

          #gm-elclasico-banner .box {
            padding: 14px 12px;
            gap: 8px;
            border-radius: 18px;
          }

          #gm-elclasico-banner .logo,
          #gm-elclasico-banner .fallback-logo {
            width: 38px;
            height: 38px;
          }

          #gm-elclasico-banner .name {
            font-size: 14px;
          }

          #gm-elclasico-banner .title {
            font-size: 16px;
          }

          #gm-elclasico-banner .info,
          #gm-elclasico-banner .vs {
            font-size: 11px;
          }

          #gm-elclasico-banner .center {
            min-width: 120px;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // ================= AUDIO =================
    if (AUDIO_URL) {
      audio = new Audio(AUDIO_URL);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = AUDIO_VOLUME;

      document.addEventListener(
        "touchstart",
        () => {
          if (audio && audio.paused && !userPaused) audio.play().catch(() => {});
        },
        { once: true }
      );

      audio.play().catch(() => {
        const resume = () => {
          if (!userPaused && audio) audio.play().catch(() => {});
          window.removeEventListener("click", resume, true);
          window.removeEventListener("touchstart", resume, true);
          window.removeEventListener("keydown", resume, true);
        };
        window.addEventListener("click", resume, true);
        window.addEventListener("touchstart", resume, true);
        window.addEventListener("keydown", resume, true);
      });

      document.addEventListener("visibilitychange", () => {
        if (!audio) return;

        if (document.hidden) {
          if (!audio.paused) audio.pause();
        } else {
          if (!userPaused) audio.play().catch(() => {});
        }
      });

      if (!document.getElementById("gm-audio-btn")) {
        const btn = document.createElement("button");
        btn.id = "gm-audio-btn";
        btn.textContent = "🔊";
        btn.setAttribute("aria-label", "Toggle music");
        document.body.appendChild(btn);

        btn.addEventListener("click", () => {
          if (!audio) return;

          if (audio.paused) {
            audio.play().catch(() => {});
            btn.textContent = "🔊";
            btn.style.background = "rgba(255,215,90,0.95)";
            userPaused = false;
          } else {
            audio.pause();
            btn.textContent = "🔇";
            btn.style.background = "rgba(120,120,120,0.85)";
            userPaused = true;
          }
        });
      }
    }

    // ================= OVERLAY =================
    if (!document.getElementById("gm-elclasico-overlay")) {
      const overlay = document.createElement("div");
      overlay.id = "gm-elclasico-overlay";
      document.body.appendChild(overlay);
    }

    // ================= SWEEP =================
    if (!document.getElementById("gm-elclasico-sweep")) {
      const sweep = document.createElement("div");
      sweep.id = "gm-elclasico-sweep";
      document.body.appendChild(sweep);
    }

    // ================= BANNER =================
    if (!document.getElementById("gm-elclasico-banner")) {
      const banner = document.createElement("div");
      banner.id = "gm-elclasico-banner";

      const leftLogoHtml = BARCA_LOGO
        ? `<img class="logo" src="${BARCA_LOGO}" alt="${TEAM_LEFT}">`
        : `<div class="fallback-logo barca">B</div>`;

      const rightLogoHtml = MADRID_LOGO
        ? `<img class="logo" src="${MADRID_LOGO}" alt="${TEAM_RIGHT}">`
        : `<div class="fallback-logo madrid">R</div>`;

      banner.innerHTML = `
        <div class="box">
          <div class="team left">
            ${leftLogoHtml}
            <div class="name">${TEAM_LEFT}</div>
          </div>

          <div class="center">
            <div class="title">${MATCH_TITLE}</div>
            <div class="vs">VS</div>
            <div class="info">${MATCH_INFO}</div>
          </div>

          <div class="team right">
            <div class="name">${TEAM_RIGHT}</div>
            ${rightLogoHtml}
          </div>
        </div>
      `;

      document.body.appendChild(banner);
    }

    // ================= TOAST =================
    (function showToastOnce() {
      if (sessionStorage.getItem("gm_elclasico_toast_v1") === "1") return;
      sessionStorage.setItem("gm_elclasico_toast_v1", "1");

      const toast = document.createElement("div");
      toast.id = "gm-elclasico-toast";

      const messages = [
        "Big Match Siap Dimulai",
        "Saatnya Menyambut El Clasico",
        "Duel Panas Barcelona vs Real Madrid",
        "Hype Pertandingan Sudah Aktif"
      ];

      const subtitle = messages[Math.floor(Math.random() * messages.length)];

      toast.innerHTML = `
        <div class="box">
          <div class="dot"></div>
          <div class="txt">
            <p class="t1">${MATCH_TITLE}</p>
            <p class="t2">${subtitle}</p>
          </div>
        </div>
      `;

      setTimeout(() => {
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 6800);
      }, 1800);
    })();

    // ================= RAIN EFFECT =================
    let rainLayer = document.getElementById("gm-elclasico-rain");

    if (!rainLayer) {
      rainLayer = document.createElement("div");
      rainLayer.id = "gm-elclasico-rain";
      document.body.appendChild(rainLayer);
    }

    function createFallbackIcon(type) {
      const span = document.createElement("span");
      span.className = "fx";
      span.textContent = type === "ball" ? "⚽" : "✨";
      span.style.fontSize = "var(--size)";
      span.style.lineHeight = "1";
      return span;
    }

    function spawn() {
      const useBall = Math.random() < 0.65;
      const hasImage = useBall ? BALL_ICON : STAR_ICON;

      const el = hasImage ? document.createElement("img") : createFallbackIcon(useBall ? "ball" : "star");

      el.className = "fx";

      if (hasImage) {
        el.src = useBall ? BALL_ICON : STAR_ICON;
        el.onerror = () => el.remove();
      }

      el.style.setProperty("--size", (Math.random() * 18 + 18).toFixed(0) + "px");
      el.style.setProperty("--x", (Math.random() * 100).toFixed(2) + "vw");
      el.style.setProperty("--dur", (Math.random() * 2.8 + 4.2).toFixed(2) + "s");
      el.style.setProperty("--sway", (Math.random() * 1.4 + 2.0).toFixed(2) + "s");
      el.style.setProperty("--dx", (Math.random() < 0.5 ? "-" : "") + (Math.random() * 40 + 18).toFixed(0) + "px");
      el.style.setProperty("--rot", (Math.random() < 0.5 ? "-" : "") + (Math.random() * 26 + 10).toFixed(0) + "deg");

      rainLayer.appendChild(el);

      setTimeout(() => el.remove(), 8200);
    }

    let rainTimer = setInterval(spawn, SPAWN_FAST_MS);

    setTimeout(() => {
      clearInterval(rainTimer);
      rainTimer = setInterval(spawn, SPAWN_SLOW_MS);
    }, RAMP_DURATION_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
