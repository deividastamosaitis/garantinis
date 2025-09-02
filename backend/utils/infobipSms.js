import axios from "axios";

const BASE_URL = process.env.INFOBIP_BASE_URL;
const AUTH = process.env.INFOBIP_API_KEY; // turi būti "App <raktas>"
const FROM = process.env.INFOBIP_FROM || undefined;

if (!BASE_URL || !AUTH) {
  console.warn("[Infobip] Trūksta INFOBIP_BASE_URL arba INFOBIP_API_KEY ENV.");
}

export async function sendSms({ to, text }) {
  if (!BASE_URL || !AUTH) {
    const err = new Error("SMS siuntimas nesukonfigūruotas (Infobip ENV).");
    err.status = 500;
    throw err;
  }

  const url = `${BASE_URL}/sms/2/text/advanced`;

  // ✅ TEISINGAS "advanced" body: destinations masyvas
  const body = {
    messages: [
      {
        ...(FROM ? { from: FROM } : {}), // jei turi užregistruotą siuntėją
        destinations: [{ to }], // <-- svarbu
        text,
      },
    ],
  };

  try {
    const { data } = await axios.post(url, body, {
      headers: {
        Authorization: AUTH, // pvz. "App 123..."
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 10000,
    });
    return data;
  } catch (e) {
    // padedam sau su pilnu klaidos log’u:
    console.error(
      "[Infobip SMS]",
      e?.response?.data || e?.message || e?.toString()
    );
    throw e;
  }
}
