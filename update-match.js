const fs = require("fs");
const path = require("path");
const readline = require("readline");

const CONFIG_FILE = path.join(__dirname, "match-config.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question, defaultValue = "") {
  return new Promise((resolve) => {
    const label = defaultValue
      ? `${question} (${defaultValue}): `
      : `${question}: `;

    rl.question(label, (answer) => {
      const value = answer.trim();
      resolve(value || defaultValue);
    });
  });
}

function readCurrentConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return {};

    const raw = fs.readFileSync(CONFIG_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.log("Gagal membaca match-config.json. Akan dibuat ulang.");
    return {};
  }
}

async function main() {
  console.log("");
  console.log("====================================");
  console.log(" GM88 Match Config Updater");
  console.log("====================================");
  console.log("");
  console.log("Tekan ENTER untuk memakai data lama/default.");
  console.log("");

  const current = readCurrentConfig();

  const config = {
    matchTitle: await ask("Match title", current.matchTitle || "PREMIER LEAGUE"),
    matchInfo: await ask("Jadwal match", current.matchInfo || "SABTU, 09 Mei 2026 • 18.30 WIB"),

    homeTeam: await ask("Home team", current.homeTeam || "Liverpool"),
    homeTeamShort: await ask("Home team short untuk mobile", current.homeTeamShort || "Liverpool"),

    awayTeam: await ask("Away team", current.awayTeam || "Chelsea"),
    awayTeamShort: await ask("Away team short untuk mobile", current.awayTeamShort || "Chelsea"),

    homeLogo: await ask("Home logo filename", current.homeLogo || "liverpool.png"),
    awayLogo: await ask("Away logo filename", current.awayLogo || "chelsea.png"),

    ballIcon: await ask("Ball icon filename", current.ballIcon || "ball.png"),
    music: await ask("Music filename", current.music || "music.mp3")
  };

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");

  console.log("");
  console.log("✅ match-config.json berhasil diupdate.");
  console.log("");
  console.log("Data terbaru:");
  console.log(JSON.stringify(config, null, 2));
  console.log("");
  console.log("Selanjutnya jalankan:");
  console.log("");
  console.log("git add match-config.json");
  console.log('git commit -m "Update match config"');
  console.log("git push");
  console.log("");

  rl.close();
}

main().catch((err) => {
  console.error("Terjadi error:", err);
  rl.close();
});
