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
  const statusColor = statusColors[ticket.status] || "bg-gray-300";

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

        {/* Video ar FOTO */}
        {ticket.attachments?.length > 0 && (
          <div className="bg-white shadow rounded p-4 border col-span-full">
            <h2 className="font-semibold text-lg mb-2">📎 Prisegti failai</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ticket.attachments.map((name) => {
                const url = `http://localhost:5001/uploads/${name}`;
                const isImage = name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                const isVideo = name.match(/\.(mp4|webm|mov|avi)$/i);

                return (
                  <div key={name} className="border p-2 rounded bg-gray-50">
                    {isImage && (
                      <img
                        src={url}
                        alt={name}
                        className="max-w-full h-auto rounded"
                      />
                    )}
                    {isVideo && (
                      <video src={url} controls className="w-full rounded" />
                    )}
                    {!isImage && !isVideo && (
                      <a
                        href={url}
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
            </div>
          </div>
        )}

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
                  <strong>{h.date?.slice(0, 10)}</strong> – {h.note || h.status}
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
