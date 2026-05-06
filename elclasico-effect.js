(function () {
  function start() {
    // ================= CONFIG =================
    const BASE_URL = "https://bebekemas66.github.io/elclasico";

    const BARCA_LOGO = BASE_URL + "/munchen.png?v=8";
    const MADRID_LOGO = BASE_URL + "/psg.png?v=8";
    const BALL_ICON = BASE_URL + "/ball.png?v=8";
    const MUSIC_URL = BASE_URL + "/music.mp3?v=8";

    const MATCH_TITLE = "UCL SEMIFINAL";
    const MATCH_INFO = "Kamis, 7 Mei 2026 • 02.00 WIB";

    const SHOW_BANNER_MS = 11000;
    const RAIN_DURATION_MS = 40000;
    const SPAWN_MS = 360;

    const AUDIO_VOLUME = 0.12;

    // ================= PREVENT DOUBLE RUN =================
    if (window.__GM_ELCLASICO_EFFECT_V8__) return;
    window.__GM_ELCLASICO_EFFECT_V8__ = true;

    if (window.__GM_ELCLASICO_AUDIO__) {
      try {
        window.__GM_ELCLASICO_AUDIO__.pause();
        window.__GM_ELCLASICO_AUDIO__.src = "";
        window.__GM_ELCLASICO_AUDIO__ = null;
      } catch (e) {}
    }

    [
      "gm-elclasico-style",
      "gm-elclasico-overlay",
      "gm-elclasico-banner",
      "gm-elclasico-rain",
      "gm-elclasico-audio-btn"
    ].forEach((id) => {
      const old = document.getElementById(id);
      if (old) old.remove();
    });

    // ================= STYLE =================
    const style = document.createElement("style");
    style.id = "gm-elclasico-style";
    style.textContent = `
      #gm-elclasico-overlay,
      #gm-elclasico-rain,
      #gm-elclasico-banner,
      #gm-elclasico-audio-btn {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
        box-sizing: border-box;
      }

      #gm-elclasico-overlay *,
      #gm-elclasico-rain *,
      #gm-elclasico-banner * {
        box-sizing: border-box;
      }

      #gm-elclasico-overlay {
        position: fixed;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
        z-index: 2147483640;
      }

      #gm-elclasico-overlay::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 50% 8%, rgba(255,255,255,0.05), transparent 26%),
          radial-gradient(circle at 50% 100%, rgba(0,0,0,0.13), transparent 48%);
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
        from { top: -60px; opacity: .95; }
        to   { top: 110vh; opacity: .88; }
      }

      @keyframes gmSway {
        0%   { transform: translateX(0) rotate(0deg); }
        50%  { transform: translateX(var(--dx)) rotate(var(--rot)); }
        100% { transform: translateX(0) rotate(calc(var(--rot) * -1)); }
      }

      #gm-elclasico-rain .fx {
        position: absolute;
        left: var(--x);
        top: -60px;
        width: var(--size);
        height: auto;
        pointer-events: none;
        will-change: transform, top;
        animation:
          gmFallTop var(--dur) linear forwards,
          gmSway var(--sway) ease-in-out infinite;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.25));
        user-select: none;
      }

      #gm-elclasico-rain .fx-fallback {
        position: absolute;
        left: var(--x);
        top: -60px;
        font-size: var(--size);
        line-height: 1;
        pointer-events: none;
        will-change: transform, top;
        animation:
          gmFallTop var(--dur) linear forwards,
          gmSway var(--sway) ease-in-out infinite;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.25));
      }

      /* ================= COMPACT BANNER ================= */
      #gm-elclasico-banner {
        position: fixed;
        left: 50%;
        bottom: 18px;
        transform: translateX(-50%);
        z-index: 2147483647;
        width: min(92vw, 680px);
        pointer-events: none;
        opacity: 1;
        transition: opacity .45s ease, transform .45s ease;
      }

      #gm-elclasico-banner.hide {
        opacity: 0;
        transform: translateX(-50%) translateY(18px);
      }

      #gm-elclasico-banner .box {
        position: relative;
        padding: 10px 14px;
        border-radius: 16px;
        overflow: hidden;
        background:
          linear-gradient(
            90deg,
            rgba(0,77,152,.78) 0%,
            rgba(165,0,68,.66) 28%,
            rgba(16,16,16,.90) 58%,
            rgba(212,175,55,.30) 100%
          );
        border: 1px solid rgba(255,255,255,0.14);
        box-shadow:
          0 12px 28px rgba(0,0,0,.30),
          0 0 0 1px rgba(255,255,255,.05) inset;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
      }

      #gm-elclasico-banner .box::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 18% 50%, rgba(255,255,255,.07), transparent 26%),
          radial-gradient(circle at 85% 50%, rgba(255,216,107,.07), transparent 26%);
        pointer-events: none;
      }

      #gm-elclasico-banner .content {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 10px;
      }

      #gm-elclasico-banner .team {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }

      #gm-elclasico-banner .team.right {
        justify-content: flex-end;
        text-align: right;
      }

      #gm-elclasico-banner .logo {
        width: 34px;
        height: 34px;
        border-radius: 999px;
        background: rgba(255,255,255,.96);
        padding: 4px;
        object-fit: contain;
        flex: 0 0 auto;
        box-shadow: 0 4px 10px rgba(0,0,0,.20);
      }

      #gm-elclasico-banner .fallback-logo {
        width: 34px;
        height: 34px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 950;
        flex: 0 0 auto;
        box-shadow: 0 4px 10px rgba(0,0,0,.20);
      }

      #gm-elclasico-banner .fallback-logo.barca {
        background: linear-gradient(135deg, #004D98, #A50044);
        color: #fff;
      }

      #gm-elclasico-banner .fallback-logo.madrid {
        background: linear-gradient(135deg, #ffffff, #e6cf76);
        color: #1a1a1a;
      }

      #gm-elclasico-banner .name {
        font-size: 12px;
        font-weight: 900;
        color: #fff;
        line-height: 1.1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      #gm-elclasico-banner .center {
        text-align: center;
        min-width: 150px;
      }

      #gm-elclasico-banner .title {
        font-size: 14px;
        font-weight: 950;
        letter-spacing: .8px;
        color: #ffd86b;
        line-height: 1.05;
        text-shadow: 0 2px 10px rgba(0,0,0,.35);
      }

      #gm-elclasico-banner .info {
        margin-top: 3px;
        font-size: 10px;
        font-weight: 800;
        color: rgba(255,255,255,.95);
        line-height: 1.1;
        white-space: nowrap;
      }

      /* ================= AUDIO BUTTON ================= */
      #gm-elclasico-audio-btn {
        position: fixed;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2147483647;
        padding: 8px 10px;
        min-width: 42px;
        min-height: 42px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(55, 58, 64, .88);
        color: #ffffff;
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
          0 10px 24px rgba(0,0,0,.32),
          0 0 0 1px rgba(255,255,255,.05) inset;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        transition: transform .18s ease, background .18s ease, opacity .18s ease;
      }

      #gm-elclasico-audio-btn:hover {
        transform: translateY(-50%) scale(1.04);
        background: rgba(75, 78, 86, .92);
      }

      #gm-elclasico-audio-btn.is-muted {
        background: rgba(70, 70, 74, .82);
        color: rgba(255,255,255,.72);
      }

      /* ================= MOBILE HORIZONTAL COMPACT ================= */
      @media (max-width: 640px) {
        #gm-elclasico-banner {
          width: 88vw;
          bottom: 86px;
        }

        #gm-elclasico-banner .box {
          padding: 8px 9px;
          border-radius: 15px;
        }

        #gm-elclasico-banner .content {
          grid-template-columns: 1fr auto 1fr;
          gap: 6px;
        }

        #gm-elclasico-banner .team {
          gap: 5px;
        }

        #gm-elclasico-banner .team.right {
          justify-content: flex-end;
        }

        #gm-elclasico-banner .logo,
        #gm-elclasico-banner .fallback-logo {
          width: 28px;
          height: 28px;
          padding: 3px;
          font-size: 13px;
        }

        #gm-elclasico-banner .name {
          font-size: 10px;
          max-width: 54px;
        }

        #gm-elclasico-banner .name-full {
          display: none;
        }

        #gm-elclasico-banner .name-short {
          display: inline;
        }

        #gm-elclasico-banner .center {
          min-width: 112px;
        }

        #gm-elclasico-banner .title {
          font-size: 12px;
          letter-spacing: .55px;
        }

        #gm-elclasico-banner .info {
          margin-top: 3px;
          font-size: 8.8px;
        }

        #gm-elclasico-audio-btn {
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          min-width: 40px;
          min-height: 40px;
          padding: 8px 9px;
          font-size: 17px;
        }

        #gm-elclasico-audio-btn:hover {
          transform: translateY(-50%) scale(1.04);
        }
      }

      @media (min-width: 641px) {
        #gm-elclasico-banner .name-short {
          display: none;
        }

        #gm-elclasico-banner .name-full {
          display: inline;
        }
      }
    `;
    document.head.appendChild(style);

    // ================= MUSIC =================
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = AUDIO_VOLUME;

    window.__GM_ELCLASICO_AUDIO__ = audio;

    let userPaused = false;

    function updateAudioButton(btn) {
      if (!btn) return;

      if (audio.paused) {
        btn.textContent = "🔇";
        btn.classList.add("is-muted");
        btn.setAttribute("aria-label", "Nyalakan musik");
      } else {
        btn.textContent = "🔊";
        btn.classList.remove("is-muted");
        btn.setAttribute("aria-label", "Matikan musik");
      }
    }

    document.addEventListener(
      "touchstart",
      () => {
        if (audio.paused && !userPaused) {
          audio.play().catch(() => {});
        }
      },
      { once: true, passive: true }
    );

    audio.play().catch(() => {
      const resume = () => {
        if (!userPaused) {
          audio.play().catch(() => {});
        }

        const btn = document.getElementById("gm-elclasico-audio-btn");
        updateAudioButton(btn);

        window.removeEventListener("click", resume, true);
        window.removeEventListener("touchstart", resume, true);
        window.removeEventListener("keydown", resume, true);
      };

      window.addEventListener("click", resume, true);
      window.addEventListener("touchstart", resume, true);
      window.addEventListener("keydown", resume, true);
    });

    document.addEventListener("visibilitychange", () => {
      const btn = document.getElementById("gm-elclasico-audio-btn");

      if (document.hidden) {
        if (!audio.paused) audio.pause();
      } else {
        if (!userPaused) {
          audio.play().catch(() => {});
        }
      }

      updateAudioButton(btn);
    });

    if (!document.getElementById("gm-elclasico-audio-btn")) {
      const audioBtn = document.createElement("button");
      audioBtn.id = "gm-elclasico-audio-btn";
      audioBtn.type = "button";
      audioBtn.textContent = "🔊";
      audioBtn.setAttribute("aria-label", "Toggle music");
      document.body.appendChild(audioBtn);

      audioBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (audio.paused) {
          audio.play().catch(() => {});
          userPaused = false;
        } else {
          audio.pause();
          userPaused = true;
        }

        updateAudioButton(audioBtn);
      });

      updateAudioButton(audioBtn);
    }

    // ================= OVERLAY =================
    const overlay = document.createElement("div");
    overlay.id = "gm-elclasico-overlay";
    document.body.appendChild(overlay);

    // ================= BANNER =================
    const banner = document.createElement("div");
    banner.id = "gm-elclasico-banner";

    function teamLogoHtml(type, src, alt, letter) {
      const cls = type === "barca" ? "barca" : "madrid";
      return `
        <img class="logo" src="${src}" alt="${alt}" onerror="this.outerHTML='<div class=&quot;fallback-logo ${cls}&quot;>${letter}</div>'">
      `;
    }

    banner.innerHTML = `
      <div class="box">
        <div class="content">
          <div class="team left">
            ${teamLogoHtml("barca", BARCA_LOGO, "Barcelona", "B")}
            <div class="name">
              <span class="name-full">Bayern Munich</span>
              <span class="name-short">Munchen</span>
            </div>
          </div>

          <div class="center">
            <div class="title">${MATCH_TITLE}</div>
            <div class="info">${MATCH_INFO}</div>
          </div>

          <div class="team right">
            <div class="name">
              <span class="name-full">PSG</span>
              <span class="name-short">PSG</span>
            </div>
            ${teamLogoHtml("madrid", MADRID_LOGO, "Real Madrid", "R")}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    setTimeout(() => {
      banner.classList.add("hide");
      setTimeout(() => {
        if (banner && banner.parentNode) {
          banner.parentNode.removeChild(banner);
        }
      }, 600);
    }, SHOW_BANNER_MS);

    // ================= BALL RAIN =================
    const rainLayer = document.createElement("div");
    rainLayer.id = "gm-elclasico-rain";
    document.body.appendChild(rainLayer);

    function spawnBall() {
      const size = (Math.random() * 12 + 16).toFixed(0) + "px";
      const x = (Math.random() * 100).toFixed(2) + "vw";
      const dur = (Math.random() * 2 + 4.2).toFixed(2) + "s";
      const sway = (Math.random() * 1.2 + 1.8).toFixed(2) + "s";
      const dx = (Math.random() < 0.5 ? "-" : "") + (Math.random() * 28 + 10).toFixed(0) + "px";
      const rot = (Math.random() < 0.5 ? "-" : "") + (Math.random() * 24 + 8).toFixed(0) + "deg";

      const img = document.createElement("img");
      img.className = "fx";
      img.src = BALL_ICON;
      img.alt = "";
      img.draggable = false;

      img.style.setProperty("--size", size);
      img.style.setProperty("--x", x);
      img.style.setProperty("--dur", dur);
      img.style.setProperty("--sway", sway);
      img.style.setProperty("--dx", dx);
      img.style.setProperty("--rot", rot);

      img.onerror = function () {
        const fallback = document.createElement("span");
        fallback.className = "fx-fallback";
        fallback.textContent = "⚽";
        fallback.style.setProperty("--size", size);
        fallback.style.setProperty("--x", x);
        fallback.style.setProperty("--dur", dur);
        fallback.style.setProperty("--sway", sway);
        fallback.style.setProperty("--dx", dx);
        fallback.style.setProperty("--rot", rot);
        rainLayer.appendChild(fallback);
        setTimeout(() => fallback.remove(), 8000);
        img.remove();
      };

      rainLayer.appendChild(img);
      setTimeout(() => img.remove(), 8000);
    }

    const rainTimer = setInterval(spawnBall, SPAWN_MS);

    setTimeout(() => {
      clearInterval(rainTimer);
    }, RAIN_DURATION_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
