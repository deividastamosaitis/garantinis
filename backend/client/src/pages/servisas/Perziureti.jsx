import { useState, useEffect } from "react";
import { useParams, useLocation, Link, useLoaderData } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";

export async function loader({ params }) {
  try {
    const { data } = await customFetch.get(`/tickets/${params.id}`);
    return data;
  } catch (err) {
    toast.error("Nepavyko gauti serviso įrašo");
    throw err;
  }
}

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
  const [clientReply, setClientReply] = useState("");
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryText, setInquiryText] = useState("");
  const [sending, setSending] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const fullUrl = `${window.location.origin}${location.pathname}`;
  const [showRMTools, setShowRMTools] = useState(false);
  const [rmtoolsSubject, setRmtoolsSubject] = useState(
    `DCK – : ${ticket.product?.serialNumber || ""}`
  );
  const [rmtoolsMessage, setRmtoolsMessage] = useState("");
  const [previewIndex, setPreviewIndex] = useState(null);

  const attachments = ticket.attachments || [];

  const communicationHistory = [...(ticket.history || [])]
    .filter(
      (entry) =>
        entry.note?.toLowerCase().includes("užklausa klientui") ||
        entry.note?.toLowerCase().includes("kliento atsakymas")
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  function getMediaUrl(name) {
    const clientServer = import.meta.env.VITE_FILE_SERVER_URL;
    const internalServer = import.meta.env.VITE_INTERNAL_FILE_SERVER_URL;
    return urlError[name]
      ? `${clientServer}/uploads/${name}`
      : `${internalServer}/uploads/${name}`;
  }

  const statusColor = statusColors[ticket.status] || "bg-gray-300";

  // Auto užpildymas RMTools popupo
  useEffect(() => {
    if (ticket) {
      setRmtoolsSubject(
        `${ticket.product?.category || ""} – naujas bilietas: ${
          ticket.product?.serialNumber || ""
        }`
      );
      setRmtoolsMessage(
        `📦 Prekė:
- Kategorija: ${ticket.product?.category || "—"}
- Gamintojas: ${ticket.product?.brand || "—"}
- Modelis: ${ticket.product?.model || "—"}
- Serijos nr.: ${ticket.product?.serialNumber || "—"}

⚠️ Gedimas:
${ticket.problemDescription || "—"}

`
      );
    }
  }, [ticket, fullUrl]);

  // ESC uždarymui
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setPreviewIndex(null);
      }
      if (e.key === "ArrowRight") {
        setPreviewIndex((prev) =>
          prev !== null && prev < attachments.length - 1 ? prev + 1 : prev
        );
      }
      if (e.key === "ArrowLeft") {
        setPreviewIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : prev
        );
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [attachments.length]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">🔍 Serviso įrašo peržiūra</h1>

      {/* Pagrindinė info */}
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

        {/* Išorinis servisas */}
        <div className="bg-white shadow rounded p-4 border">
          <h2 className="font-semibold text-lg mb-2">📤 Išorinis servisas</h2>
          <p>
            <strong>Tiekėjas:</strong>{" "}
            {ticket.product?.externalService?.supplier || "—"}
          </p>
          <p>
            <strong>Išsiuntimo data:</strong>{" "}
            {ticket.product?.externalService?.sentDate
              ? new Date(
                  ticket.product.externalService.sentDate
                ).toLocaleDateString("lt-LT")
              : "—"}
          </p>
          <p>
            <strong>RMA kodas:</strong>{" "}
            {ticket.product?.externalService?.rmaCode || "—"}
          </p>
          <p>
            <strong>Tiekėjo RMA kodas:</strong>{" "}
            {ticket.product?.externalService?.supplierRmaCode || "—"}
          </p>
          <p>
            <strong>Statusas:</strong>{" "}
            {ticket.product?.externalService?.status || "—"}
          </p>
          <p>
            <strong>Grąžinimo data:</strong>{" "}
            {ticket.product?.externalService?.returnDate
              ? new Date(
                  ticket.product.externalService.returnDate
                ).toLocaleDateString("lt-LT")
              : "—"}
          </p>
          {ticket.keyword && (
            <p className="mt-2">
              <strong>🔑 Raktažodis:</strong> {ticket.keyword}
            </p>
          )}
        </div>

        {/* Statusas + QR */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white shadow rounded p-4 border">
            <h2 className="font-semibold text-lg mb-2">📌 Statusas</h2>
            <span
              className={`inline-block px-3 py-1 text-sm text-white rounded ${statusColor}`}
            >
              {ticket.status}
            </span>
          </div>
          <div className="bg-white shadow rounded p-4 border">
            <h2 className="font-semibold text-lg mb-2">📱 QR kodas</h2>
            <QRCodeCanvas value={fullUrl} size={96} />
          </div>
        </div>

        {/* Gedimas */}
        <div className="bg-white shadow rounded p-4 border col-span-full">
          <h2 className="font-semibold text-lg mb-2">⚠️ Gedimo aprašymas</h2>
          <p className="whitespace-pre-wrap">
            {ticket.problemDescription || "—"}
          </p>
        </div>

        {/* Priedai thumbnails */}
        {attachments.map((name, index) => {
          const isImage = name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
          const isVideo = name.match(/\.(mp4|webm|mov|avi)$/i);
          const mediaUrl = getMediaUrl(name);
          return (
            <div
              key={name}
              className="border p-2 rounded bg-gray-50 cursor-pointer"
              onClick={() => setPreviewIndex(index)}
            >
              {isImage && (
                <img
                  src={mediaUrl}
                  onError={() =>
                    setUrlError((prev) => ({ ...prev, [name]: true }))
                  }
                  alt={name}
                  className="w-32 h-32 object-cover rounded"
                />
              )}
              {isVideo && (
                <video
                  src={mediaUrl}
                  onError={() =>
                    setUrlError((prev) => ({ ...prev, [name]: true }))
                  }
                  className="w-32 h-32 object-cover rounded"
                  muted
                />
              )}
              {!isImage && !isVideo && (
                <span className="text-blue-600 underline">
                  Atsisiųsti: {name}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Užklausos + Mygtukai */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Užklausos */}
        <div className="space-y-2">
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
          {communicationHistory.map((entry, index) => {
            const isInquiry = entry.note
              ?.toLowerCase()
              .includes("užklausa klientui");
            const isReply = entry.note
              ?.toLowerCase()
              .includes("kliento atsakymas");
            return (
              <div
                key={index}
                className={`border-l-4 pl-3 py-2 rounded ${
                  isInquiry
                    ? "bg-yellow-50 border-yellow-400"
                    : isReply
                    ? "bg-purple-50 border-purple-500"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <strong>
                  {isInquiry
                    ? "Užklausa klientui"
                    : isReply
                    ? "Kliento atsakymas"
                    : "Kita žinutė"}
                </strong>
                <p className="whitespace-pre-wrap mt-1">{entry.note}</p>
                <small className="text-xs text-gray-500 block mt-1">
                  {new Date(entry.date).toLocaleString("lt-LT")} (
                  {entry.from || "—"})
                </small>
              </div>
            );
          })}
          {communicationHistory.length > 0 && (
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
                    window.location.reload();
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

        {/* Mygtukai */}
        <div className="flex flex-col gap-3">
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
          {ticket.product?.category === "Robotas" && (
            <button
              onClick={() => setShowRMTools(true)}
              className="btn bg-red-600 hover:bg-red-700 text-white"
            >
              🚀 Siųsti į RMTools
            </button>
          )}
        </div>
      </div>

      {/* Veiksmų istorija */}
      {ticket.history?.length > 0 && (
        <div className="bg-white shadow rounded p-4 border">
          <h2 className="font-semibold text-lg mb-4">📜 Veiksmų istorija</h2>
          <div className="space-y-3">
            {ticket.history
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((entry, index) => {
                const isRMTools = entry.note
                  ?.toLowerCase()
                  .includes("siųsta į rmtools");
                return (
                  <div
                    key={index}
                    className={`border-b pb-2 ${
                      isRMTools ? "bg-red-100 border-l-4 border-red-500" : ""
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{entry.note}</p>
                    <small className="text-gray-500">
                      {new Date(entry.date).toLocaleString("lt-LT")} –{" "}
                      {entry.from || "—"}
                    </small>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Modal su rodyklėmis */}
      {previewIndex !== null && attachments[previewIndex] && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewIndex(null)}
        >
          <div
            className="relative bg-white p-4 rounded shadow-lg max-w-5xl max-h-[90%] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Rodyklės */}
            {previewIndex > 0 && (
              <button
                className="absolute left-2 top-1/2 text-white text-3xl"
                onClick={() => setPreviewIndex((prev) => prev - 1)}
              >
                ◀
              </button>
            )}
            {previewIndex < attachments.length - 1 && (
              <button
                className="absolute right-2 top-1/2 text-white text-3xl"
                onClick={() => setPreviewIndex((prev) => prev + 1)}
              >
                ▶
              </button>
            )}

            {/* Turinys */}
            {attachments[previewIndex].match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
              <img
                src={getMediaUrl(attachments[previewIndex])}
                alt="Peržiūra"
                className="max-w-full max-h-[80vh] mx-auto"
              />
            )}
            {attachments[previewIndex].match(/\.(mp4|webm|mov|avi)$/i) && (
              <video
                src={getMediaUrl(attachments[previewIndex])}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] mx-auto"
              />
            )}
            {!attachments[previewIndex].match(
              /\.(jpg|jpeg|png|gif|webp|mp4|webm|mov|avi)$/i
            ) && (
              <a
                href={getMediaUrl(attachments[previewIndex])}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Atsisiųsti failą
              </a>
            )}
          </div>
        </div>
      )}

      {/* RMTools Popup */}
      {showRMTools && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full space-y-4">
            <h2 className="text-xl font-bold">🚀 Siųsti į RMTools</h2>
            <input
              className="input w-full"
              value={rmtoolsSubject}
              onChange={(e) => setRmtoolsSubject(e.target.value)}
              placeholder="Tema"
            />
            <textarea
              className="input w-full h-40"
              value={rmtoolsMessage}
              onChange={(e) => setRmtoolsMessage(e.target.value)}
              placeholder="Žinutė"
            />
            <div className="flex justify-end gap-3">
              <button
                className="btn bg-gray-300"
                onClick={() => setShowRMTools(false)}
              >
                Atšaukti
              </button>
              <button
                className="btn bg-green-600 text-white"
                onClick={async () => {
                  try {
                    await customFetch.post(`/tickets/${id}/send-to-rmtools`, {
                      subject: rmtoolsSubject,
                      message: rmtoolsMessage,
                    });
                    toast.success("Išsiųsta į RMTools");
                    setShowRMTools(false);
                  } catch (err) {
                    toast.error("Klaida siunčiant į RMTools");
                  }
                }}
              >
                Siųsti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
