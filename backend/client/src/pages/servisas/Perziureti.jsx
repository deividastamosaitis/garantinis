import { useLoaderData, Link } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

// Loader duomenims gauti
export async function loader({ params }) {
  try {
    const { data } = await customFetch.get(`/tickets/${params.id}`);
    return data;
  } catch (err) {
    toast.error("Nepavyko gauti serviso įrašo");
    throw err;
  }
}

export default function Perziureti() {
  const ticket = useLoaderData();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Serviso įrašo peržiūra</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white shadow p-4 rounded border">
        <div>
          <h2 className="text-lg font-semibold mb-1">Klientas</h2>
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

        <div>
          <h2 className="text-lg font-semibold mb-1">Prekė</h2>
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
            <strong>SN:</strong> {ticket.product?.serialNumber}
          </p>
        </div>

        <div className="sm:col-span-2">
          <h2 className="text-lg font-semibold mb-1">Gedimo aprašymas</h2>
          <p className="whitespace-pre-wrap">
            {ticket.problemDescription || "—"}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-1">Statusas</h2>
          <p>{ticket.status}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-1">Priskirtas darbuotojas</h2>
          <p>{ticket.assignedTo || "—"}</p>
        </div>

        <div className="sm:col-span-2">
          <h2 className="text-lg font-semibold mb-1">Pastabos</h2>
          <p className="whitespace-pre-wrap">{ticket.notes || "—"}</p>
        </div>

        {ticket.product?.externalService?.rmaCode && (
          <div className="sm:col-span-2">
            <h2 className="text-lg font-semibold mb-1">Išorinis servisas</h2>
            <p>
              <strong>RMA kodas:</strong>{" "}
              {ticket.product.externalService.rmaCode}
            </p>
            <p>
              <strong>Siųsta į:</strong> {ticket.product.externalService.sentTo}
            </p>
            <p>
              <strong>Siuntimo data:</strong>{" "}
              {ticket.product.externalService.sentDate?.slice(0, 10)}
            </p>
            <p>
              <strong>Statusas:</strong> {ticket.product.externalService.status}
            </p>
            {ticket.product.externalService.returnDate && (
              <p>
                <strong>Grąžinimo data:</strong>{" "}
                {ticket.product.externalService.returnDate?.slice(0, 10)}
              </p>
            )}
          </div>
        )}
      </div>

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
