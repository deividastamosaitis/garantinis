const fullyBaseURL = "http://192.168.1.45:2323";
const kioskPassword = "1533";
const frontendIP = "192.168.1.35:4000";

const LAUKIMAS_URL = `http://${frontendIP}/laukimas`;

export const atidarytiGarantiniPasirasymui = async (garantinisId) => {
  const pasirasymasUrl = `http://${frontendIP}/garantinis/pasirasymas/${garantinisId}`;

  try {
    // 1. Įjungti ekraną
    await fetch(`${fullyBaseURL}/?cmd=screenOn&password=${kioskPassword}`);

    // 2. Atrakinti ekraną
    await fetch(`${fullyBaseURL}/?cmd=unlock&password=${kioskPassword}`);

    // 3. Parodyti laukimo ekraną
    await fetch(
      `${fullyBaseURL}/?cmd=loadUrl&url=${encodeURIComponent(
        LAUKIMAS_URL
      )}&password=${kioskPassword}`
    );

    console.log("📺 Laukimo puslapis atidarytas");

    // 4. Po 2 sek. perkelti į pasirašymo puslapį
    setTimeout(async () => {
      const fullUrl = `${fullyBaseURL}/?cmd=loadUrl&url=${encodeURIComponent(
        pasirasymasUrl
      )}&password=${kioskPassword}`;

      console.log("➡️ Bandome atidaryti planšetėje URL:", pasirasymasUrl);
      console.log("➡️ Pilnas loadUrl request:", fullUrl);

      const res = await fetch(fullUrl);

      if (!res.ok) {
        throw new Error(`LoadUrl klaida: ${res.status}`);
      }

      console.log("✅ Puslapis sėkmingai atidarytas planšetėje");
    }, 2000);
  } catch (err) {
    console.error("❌ Nepavyko atidaryti puslapio planšetėje:", err.message);
  }
};
