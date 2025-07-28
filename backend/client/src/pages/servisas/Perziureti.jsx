import { useState } from "react";
import { useParams } from "react-router-dom";
import { useLoaderData, Link } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

export async function loader({ params }) {
  try {
    const { data } = await customFetch.get(`/tickets/${params.id}`);
    return data;
  } catch (err) {
    toast.error("Nepavyko gauti serviso įrašo");
    throw err;
  }
}

// 💡 Statuso spalva
const statusColors = {
  Naujas: "bg-gray-400",
  Diagnostika: "bg-yellow-500",
  "Dalių užsakymas": "bg-orange-500",
  Remontuojama: "bg-blue-500",
  "Paruošta atsiėmimui": "bg-green-500",
  Uždaryta: "bg-gray-600",
};

export default function Perziureti() {
  const ticket = useLoaderData();
  const [urlError, setUrlError] = useState({});

  function getMediaUrl(name) {
    const clientServer = import.meta.env.VITE_FILE_SERVER_URL;
    const internalServer = import.meta.env.VITE_INTERNAL_FILE_SERVER_URL;

    return urlError[name]
      ? `${clientServer}/uploads/${name}`
      : `${internalServer}/uploads/${name}`;
  }

  const [clientReply, setClientReply] = useState("");
  const lastInquiryIndex = [...(ticket.history || [])]
    .reverse()
    .findIndex((h) => h.note?.startsWith("Išsiųsta užklausa klientui"));

  const reversedHistory = [...(ticket.history || [])].reverse();
  const lastInquiry =
    lastInquiryIndex !== -1 ? reversedHistory[lastInquiryIndex] : null;
  const lastReply =
    lastInquiryIndex !== -1 ? reversedHistory[lastInquiryIndex - 1] : null;
  const statusColor = statusColors[ticket.status] || "bg-gray-300";
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryText, setInquiryText] = useState("");
  const [sending, setSending] = useState(false);
  const { id } = useParams();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">🔍 Serviso įrašo peržiūra</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Klientas */}
        <div className="bg-white shadow rounded p-4 border">
          <h2 className="font-semibold text-lg mb-2">👤 Klientas</h2>
          <p>
            <strong>Vardas:</strong> {ticket.client?.name}
          </p>
          <p>
            <strong>Telefonas:</strong> {ticket.client?.phone}
          </p>
          <p>
            <strong>El. paštas:</strong> {ticket.client?.email}
          </p>
        </div>

        {/* Prekė */}
        <div className="bg-white shadow rounded p-4 border">
          <h2 className="font-semibold text-lg mb-2">📦 Prekė</h2>
          <p>
            <strong>Kategorija:</strong> {ticket.product?.category}
          </p>
          <p>
            <strong>Gamintojas:</strong> {ticket.product?.brand}
          </p>
          <p>
            <strong>Modelis:</strong> {ticket.product?.model}
          </p>
          <p>
            <strong>Serijos nr.:</strong> {ticket.product?.serialNumber}
          </p>
        </div>

        {/* Gedimas */}
        <div className="bg-white shadow rounded p-4 border col-span-full">
          <h2 className="font-semibold text-lg mb-2">⚠️ Gedimo aprašymas</h2>
          <p className="whitespace-pre-wrap">
            {ticket.problemDescription || "—"}
          </p>
        </div>

        {/* Statusas */}
        <div className="bg-white shadow rounded p-4 border">
          <h2 className="font-semibold text-lg mb-2">📌 Statusas</h2>
          <span
            className={`inline-block px-3 py-1 text-sm text-white rounded ${statusColor}`}
          >
            {ticket.status}
          </span>
        </div>

        {/* Darbuotojas */}
        <div className="bg-white shadow rounded p-4 border">
          <h2 className="font-semibold text-lg mb-2">👨‍🔧 Darbuotojas</h2>
          <p>{ticket.assignedTo || "—"}</p>
        </div>

        {/* Video ar FOTO */}
        {ticket.attachments.map((name) => {
          const isImage = name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
          const isVideo = name.match(/\.(mp4|webm|mov|avi)$/i);
          const mediaUrl = getMediaUrl(name);

          return (
            <div key={name} className="border p-2 rounded bg-gray-50">
              {isImage && (
                <img
                  src={mediaUrl}
                  onError={() =>
                    setUrlError((prev) => ({ ...prev, [name]: true }))
                  }
                  alt={name}
                  className="max-w-full h-auto rounded"
                />
              )}
              {isVideo && (
                <video
                  src={mediaUrl}
                  onError={() =>
                    setUrlError((prev) => ({ ...prev, [name]: true }))
                  }
                  controls
                  className="w-full rounded"
                />
              )}
              {!isImage && !isVideo && (
                <a
                  href={mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Atsisiųsti: {name}
                </a>
              )}
            </div>
          );
        })}

        {/* Užklausa */}
        <div className="space-y-2 mt-4">
          <button
            onClick={() => setShowInquiry((prev) => !prev)}
            className="btn bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            ✉️ Užklausa klientui
          </button>
          {showInquiry && (
            <div className="space-y-2">
              <textarea
                className="input w-full"
                rows={4}
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                placeholder="Įveskite klausimą ar pastabą klientui"
              />
              <button
                type="button"
                className="btn bg-green-600 hover:bg-green-700 text-white"
                disabled={sending || !inquiryText.trim()}
                onClick={async () => {
                  try {
                    setSending(true);
                    await customFetch.post(`/tickets/${id}/inquiry`, {
                      message: inquiryText,
                    });
                    toast.success("Užklausa išsiųsta klientui");
                    setInquiryText("");
                    setShowInquiry(false);
                  } catch (err) {
                    toast.error(
                      err.response?.data?.error || "Nepavyko išsiųsti užklausos"
                    );
                  } finally {
                    setSending(false);
                  }
                }}
              >
                📤 Siųsti užklausą
              </button>
            </div>
          )}

          {lastInquiry && (
            <div className="text-sm text-gray-700 border-l-4 border-yellow-300 pl-3 py-2 mt-1 bg-yellow-50 rounded">
              <strong>Paskutinė užklausa:</strong>
              <br />
              <span className="whitespace-pre-wrap">{lastInquiry.note}</span>
              <br />
              <small className="text-xs text-gray-500">
                {new Date(lastInquiry.date).toLocaleString("lt-LT")} (
                {lastInquiry.from || "—"})
              </small>

              {lastReply && (
                <div className="mt-3 border-t pt-2">
                  <strong>Kliento atsakymas:</strong>
                  <br />
                  <span className="whitespace-pre-wrap">{lastReply.note}</span>
                  <br />
                  <small className="text-xs text-gray-500">
                    {new Date(lastReply.date).toLocaleString("lt-LT")} (
                    {lastReply.from || "—"})
                  </small>
                </div>
              )}
            </div>
          )}

          {lastInquiry && (
            <div className="mt-2 space-y-2">
              <textarea
                rows={3}
                className="input w-full"
                value={clientReply}
                placeholder="Įrašykite kliento atsakymą"
                onChange={(e) => setClientReply(e.target.value)}
              />
              <button
                className="btn bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!clientReply.trim()}
                onClick={async () => {
                  try {
                    await customFetch.post(`/tickets/${id}/inquiry-reply`, {
                      reply: clientReply,
                    });
                    toast.success("Atsakymas įrašytas");
                    setClientReply("");
                    window.location.reload(); // arba refetch loader'į
                  } catch (err) {
                    toast.error("Nepavyko išsaugoti atsakymo");
                  }
                }}
              >
                💬 Įrašyti atsakymą
              </button>
            </div>
          )}
        </div>

        {/* Pastabos */}
        <div className="bg-white shadow rounded p-4 border col-span-full">
          <h2 className="font-semibold text-lg mb-2">📝 Pastabos</h2>
          <p className="whitespace-pre-wrap">{ticket.notes || "—"}</p>
        </div>

        {/* Išorinis servisas */}
        {ticket.product?.externalService?.rmaCode && (
          <div className="bg-white shadow rounded p-4 border col-span-full">
            <h2 className="font-semibold text-lg mb-2">🚚 Išorinis servisas</h2>
            <p>
              <strong>RMA (klientui):</strong>{" "}
              {ticket.product.externalService.rmaCode}
            </p>
            <p>
              <strong>Tiekėjo RMA:</strong>{" "}
              {ticket.product.externalService.supplierRmaCode || "—"}
            </p>
            <p>
              <strong>Siųsta į:</strong>{" "}
              {ticket.product.externalService.sentTo || "—"}
            </p>
            <p>
              <strong>Siuntimo data:</strong>{" "}
              {ticket.product.externalService.sentDate?.slice(0, 10) || "—"}
            </p>
            <p>
              <strong>Statusas:</strong>{" "}
              {ticket.product.externalService.status || "—"}
            </p>
            <p>
              <strong>Grąžinimo data:</strong>{" "}
              {ticket.product.externalService.returnDate?.slice(0, 10) || "—"}
            </p>
          </div>
        )}
      </div>

      {/* Istorija */}
      {ticket.history?.length > 0 && (
        <div className="bg-white shadow rounded p-4 border">
          <h2 className="font-semibold text-lg mb-4">🕒 Veiksmų istorija</h2>
          <div className="space-y-2 text-sm">
            {ticket.history.map((h, i) => (
              <div key={i} className="border-l-4 border-gray-300 pl-4">
                <p>
                  <strong>
                    {new Date(h.date).toLocaleString("lt-LT", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </strong>{" "}
                  ({h.from || "—"}) – {h.note || h.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Veiksmai */}
      <div className="flex gap-4">
        <Link
          to="/garantinis/servisas"
          className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          ⬅️ Atgal
        </Link>
        <Link
          to={`/garantinis/servisas/redaguoti/${ticket._id}`}
          className="btn bg-blue-600 text-white hover:bg-blue-700"
        >
          ✏️ Redaguoti
        </Link>
      </div>
    </div>
  );
}
