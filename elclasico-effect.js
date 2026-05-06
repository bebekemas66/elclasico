(function () {
  function start() {
    // ================= CONFIG =================
    const MATCH_TITLE = "EL CLASICO";
    const TEAM_LEFT = "Barcelona";
    const TEAM_RIGHT = "Real Madrid";
    const MATCH_INFO = "Senin, 11 Mei 2026 • 02.00 WIB";

    // Assets dari repo GitHub
    const BARCA_LOGO = "assets/barcelona.png";
    const MADRID_LOGO = "assets/real-madrid.png";
    const BALL_ICON = "assets/ball.png";

    // Effect intensity
    const RAMP_DURATION_MS = 30000;
    const SPAWN_FAST_MS = 320;
    const SPAWN_SLOW_MS = 950;

    // ================= PREVENT DOUBLE RUN =================
    if (window.__GM_ELCLASICO_EFFECT_ACTIVE__) return;
    window.__GM_ELCLASICO_EFFECT_ACTIVE__ = true;

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
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          box-sizing: border-box;
        }

        #gm-elclasico-overlay *,
        #gm-elclasico-rain *,
        #gm-elclasico-sweep *,
        #gm-elclasico-toast *,
        #gm-elclasico-banner * {
          box-sizing: border-box;
        }

        /* ================= STADIUM OVERLAY ================= */
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
            radial-gradient(circle at 50% 5%, rgba(255,255,255,0.12), transparent 26%),
            radial-gradient(circle at 50% 100%, rgba(0,0,0,0.34), transparent 48%),
            linear-gradient(to bottom, rgba(6,10,22,0.08), rgba(0,0,0,0.22));
        }

        #gm-elclasico-overlay::after {
          content: "";
          position: absolute;
          left: 50%;
          top: -18%;
          transform: translateX(-50%);
          width: 1200px;
          height: 460px;
          background:
            radial-gradient(circle at 15% 50%, rgba(255,255,255,0.14), transparent 18%),
            radial-gradient(circle at 35% 50%, rgba(255,255,255,0.11), transparent 18%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18), transparent 18%),
            radial-gradient(circle at 65% 50%, rgba(255,255,255,0.11), transparent 18%),
            radial-gradient(circle at 85% 50%, rgba(255,255,255,0.14), transparent 18%);
          filter: blur(12px);
          opacity: .72;
        }

        /* ================= SHINE SWEEP ================= */
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
            rgba(255,255,255,0) 36%,
            rgba(255,255,255,0.11) 50%,
            rgba(255,255,255,0) 64%,
            transparent 100%
          );
          transform: skewX(-12deg);
          animation: gmElClasicoSweep 15s ease-in-out infinite;
        }

        @keyframes gmElClasicoSweep {
          0%   { left: -120%; opacity: 0; }
          8%   { opacity: 1; }
          30%  { left: 140%; opacity: 1; }
          31%  { opacity: 0; }
          100% { left: 140%; opacity: 0; }
        }

        /* ================= BOTTOM BANNER ================= */
        #gm-elclasico-banner {
          position: fixed;
          left: 50%;
          bottom: 20px;
          transform: translateX(-50%);
          z-index: 2147483647;
          width: min(92vw, 780px);
          pointer-events: none;
          animation: gmBannerUp 1s cubic-bezier(.2,.8,.2,1);
        }

        #gm-elclasico-banner .box {
          position: relative;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          border-radius: 24px;
          background:
            linear-gradient(90deg,
              rgba(0, 77, 152, 0.76) 0%,
              rgba(165, 0, 68, 0.64) 23%,
              rgba(14, 14, 18, 0.92) 50%,
              rgba(236, 236, 236, 0.22) 77%,
              rgba(212, 175, 55, 0.26) 100%);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.20);
          box-shadow:
            0 18px 42px rgba(0,0,0,0.40),
            0 0 0 1px rgba(255,255,255,0.06) inset;
          overflow: hidden;
        }

        #gm-elclasico-banner .box::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 50%, rgba(255,255,255,0.14), transparent 26%),
            radial-gradient(circle at 82% 50%, rgba(255,216,107,0.12), transparent 26%),
            linear-gradient(90deg, rgba(255,255,255,0.08), transparent 35%, transparent 65%, rgba(255,255,255,0.06));
          pointer-events: none;
        }

        #gm-elclasico-banner .team {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        #gm-elclasico-banner .team.right {
          justify-content: flex-end;
          text-align: right;
        }

        #gm-elclasico-banner .logo {
          width: 46px;
          height: 46px;
          border-radius: 999px;
          object-fit: contain;
          background: rgba(255,255,255,0.96);
          padding: 5px;
          box-shadow:
            0 8px 18px rgba(0,0,0,0.22),
            0 0 0 2px rgba(255,255,255,0.12);
          flex: 0 0 auto;
        }

        #gm-elclasico-banner .fallback-logo {
          width: 46px;
          height: 46px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 950;
          color: #fff;
          box-shadow:
            0 8px 18px rgba(0,0,0,0.22),
            0 0 0 2px rgba(255,255,255,0.12);
          flex: 0 0 auto;
        }

        #gm-elclasico-banner .fallback-logo.barca {
          background: linear-gradient(135deg, #004D98, #A50044);
        }

        #gm-elclasico-banner .fallback-logo.madrid {
          background: linear-gradient(135deg, #ffffff, #d4af37);
          color: #1a1a1a;
        }

        #gm-elclasico-banner .name {
          font-weight: 900;
          font-size: 18px;
          line-height: 1.1;
          color: #ffffff;
          text-shadow: 0 2px 10px rgba(0,0,0,0.38);
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
          min-width: 185px;
          text-align: center;
          padding: 0 4px;
        }

        #gm-elclasico-banner .title {
          font-size: 22px;
          font-weight: 950;
          letter-spacing: 1.2px;
          color: #ffd86b;
          line-height: 1.05;
          text-shadow: 0 2px 14px rgba(0,0,0,0.48);
        }

        #gm-elclasico-banner .vs {
          margin-top: 4px;
          font-size: 12px;
          font-weight: 950;
          color: rgba(255,255,255,0.88);
          letter-spacing: 1.6px;
        }

        #gm-elclasico-banner .info {
          margin-top: 4px;
          font-size: 12px;
          font-weight: 850;
          color: #f4f4f4;
          opacity: .98;
          white-space: nowrap;
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

        /* ================= TOP TOAST ================= */
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
          background: rgba(10,10,10,.64);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,.18);
          box-shadow:
            0 18px 48px rgba(0,0,0,.45),
            0 0 0 1px rgba(255,255,255,.06) inset;
          overflow: hidden;
        }

        #gm-elclasico-toast .box::before {
          content: "";
          position: absolute;
          inset: -40%;
          background:
            radial-gradient(circle at 20% 50%, rgba(0,77,152,.22), transparent 52%),
            radial-gradient(circle at 72% 45%, rgba(255,216,107,.18), transparent 55%);
          filter: blur(10px);
          opacity: .8;
        }

        #gm-elclasico-toast .dot {
          position: relative;
          z-index: 1;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: #ffd86b;
          box-shadow: 0 0 18px rgba(255,216,107,.7);
          flex: 0 0 auto;
        }

        #gm-elclasico-toast .txt {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        #gm-elclasico-toast .t1 {
          font: 850 13px/1.1 system-ui, "Segoe UI", Arial;
          letter-spacing: .4px;
          color: #f7f1dc;
          margin: 0;
        }

        #gm-elclasico-toast .t2 {
          font: 950 16px/1.1 system-ui, "Segoe UI", Arial;
          color: #ffd86b;
          margin: 0;
        }

        @keyframes gmToastCine {
          0%   { opacity: 0; transform: translateX(-50%) translateY(-22px) scale(.92); filter: blur(2px); }
          14%  { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); filter: blur(0); }
          72%  { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(.98); filter: blur(.6px); }
        }

        /* ================= BALL RAIN ================= */
        #gm-elclasico-rain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 2147483646;
        }

        @keyframes gmFallTop {
          from {
            top: -80px;
            opacity: .95;
          }
          to {
            top: 110vh;
            opacity: .88;
          }
        }

        @keyframes gmSway {
          0% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(var(--dx)) rotate(var(--rot));
          }
          100% {
            transform: translateX(0) rotate(calc(var(--rot) * -1));
          }
        }

        #gm-elclasico-rain .fx {
          position: absolute;
          left: var(--x);
          top: -80px;
          width: var(--size);
          height: auto;
          animation:
            gmFallTop var(--dur) linear forwards,
            gmSway var(--sway) ease-in-out infinite;
          will-change: top, transform;
          pointer-events: none;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.22));
          user-select: none;
        }

        /* ================= MOBILE ================= */
        @media (max-width: 640px) {
          #gm-elclasico-banner {
            width: 94vw;
            bottom: 14px;
          }

          #gm-elclasico-banner .box {
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 14px 14px;
            border-radius: 20px;
            text-align: center;
          }

          #gm-elclasico-banner .team {
            justify-content: center;
          }

          #gm-elclasico-banner .team.right {
            justify-content: center;
            text-align: center;
          }

          #gm-elclasico-banner .team.right .name {
            order: 2;
          }

          #gm-elclasico-banner .team.right .logo,
          #gm-elclasico-banner .team.right .fallback-logo {
            order: 1;
          }

          #gm-elclasico-banner .logo,
          #gm-elclasico-banner .fallback-logo {
            width: 40px;
            height: 40px;
          }

          #gm-elclasico-banner .name {
            font-size: 15px;
          }

          #gm-elclasico-banner .center {
            min-width: 0;
            order: -1;
          }

          #gm-elclasico-banner .title {
            font-size: 18px;
          }

          #gm-elclasico-banner .info,
          #gm-elclasico-banner .vs {
            font-size: 11px;
          }

          #gm-elclasico-toast {
            top: 12px;
            width: max-content;
            max-width: 92vw;
          }

          #gm-elclasico-toast .box {
            padding: 12px 14px;
            border-radius: 16px;
          }

          #gm-elclasico-toast .t2 {
            font-size: 15px;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // ================= CREATE OVERLAY =================
    if (!document.getElementById("gm-elclasico-overlay")) {
      const overlay = document.createElement("div");
      overlay.id = "gm-elclasico-overlay";
      document.body.appendChild(overlay);
    }

    // ================= CREATE SWEEP =================
    if (!document.getElementById("gm-elclasico-sweep")) {
      const sweep = document.createElement("div");
      sweep.id = "gm-elclasico-sweep";
      document.body.appendChild(sweep);
    }

    // ================= CREATE BANNER =================
    if (!document.getElementById("gm-elclasico-banner")) {
      const banner = document.createElement("div");
      banner.id = "gm-elclasico-banner";

      const leftLogoHtml = BARCA_LOGO
        ? `<img class="logo" src="${BARCA_LOGO}" alt="${TEAM_LEFT}" onerror="this.outerHTML='<div class=&quot;fallback-logo barca&quot;>B</div>'">`
        : `<div class="fallback-logo barca">B</div>`;

      const rightLogoHtml = MADRID_LOGO
        ? `<img class="logo" src="${MADRID_LOGO}" alt="${TEAM_RIGHT}" onerror="this.outerHTML='<div class=&quot;fallback-logo madrid&quot;>R</div>'">`
        : `<div class="fallback-logo madrid">R</div>`;

      banner.innerHTML = `
        <div class="box">
          <div class="team left">
            ${leftLogoHtml}
            <div class="name">${TEAM_LEFT}</div>
          </div>

          <div class="center">
            <div class="title">${MATCH_TITLE}</div>
            <div class="vs">BARCELONA VS REAL MADRID</div>
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

    // ================= CREATE TOAST =================
    (function showToastOnce() {
      if (sessionStorage.getItem("gm_elclasico_toast_v2") === "1") return;
      sessionStorage.setItem("gm_elclasico_toast_v2", "1");

      const messages = [
        "Big Match Siap Dimulai",
        "Saatnya Menyambut El Clasico",
        "Duel Panas Barcelona vs Real Madrid",
        "Hype Pertandingan Sudah Aktif",
        "Match Day Vibes Sudah Aktif"
      ];

      const subtitle = messages[Math.floor(Math.random() * messages.length)];

      const toast = document.createElement("div");
      toast.id = "gm-elclasico-toast";
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
      }, 1500);
    })();

    // ================= BALL RAIN EFFECT =================
    let rainLayer = document.getElementById("gm-elclasico-rain");

    if (!rainLayer) {
      rainLayer = document.createElement("div");
      rainLayer.id = "gm-elclasico-rain";
      document.body.appendChild(rainLayer);
    }

    function spawnBall() {
      if (!BALL_ICON) return;

      const img = document.createElement("img");
      img.className = "fx";
      img.src = BALL_ICON;
      img.alt = "";
      img.draggable = false;
      img.onerror = () => img.remove();

      img.style.setProperty("--size", (Math.random() * 16 + 18).toFixed(0) + "px");
      img.style.setProperty("--x", (Math.random() * 100).toFixed(2) + "vw");
      img.style.setProperty("--dur", (Math.random() * 2.6 + 4.6).toFixed(2) + "s");
      img.style.setProperty("--sway", (Math.random() * 1.4 + 2.2).toFixed(2) + "s");
      img.style.setProperty(
        "--dx",
        (Math.random() < 0.5 ? "-" : "") + (Math.random() * 34 + 14).toFixed(0) + "px"
      );
      img.style.setProperty(
        "--rot",
        (Math.random() < 0.5 ? "-" : "") + (Math.random() * 24 + 10).toFixed(0) + "deg"
      );

      rainLayer.appendChild(img);

      setTimeout(() => img.remove(), 8500);
    }

    let rainTimer = setInterval(spawnBall, SPAWN_FAST_MS);

    setTimeout(() => {
      clearInterval(rainTimer);
      rainTimer = setInterval(spawnBall, SPAWN_SLOW_MS);
    }, RAMP_DURATION_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
