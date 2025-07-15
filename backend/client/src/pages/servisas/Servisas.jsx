import { useLoaderData, Link, useSearchParams } from "react-router-dom";
import customFetch from "../../utils/customFetch";

export async function loader({ request }) {
  const url = new URL(request.url);
  const rma = url.searchParams.get("rma") || "";
  const phone = url.searchParams.get("phone") || "";
  const sn = url.searchParams.get("sn") || "";

  const { data } = await customFetch.get("/tickets");

  return data.filter((item) => {
    const rmaMatch = rma
      ? item.product.externalService?.rmaCode?.includes(rma)
      : true;
    const phoneMatch = phone ? item.client.phone?.includes(phone) : true;
    const snMatch = sn ? item.product.serialNumber?.includes(sn) : true;
    return rmaMatch && phoneMatch && snMatch;
  });
}

const statusColors = {
  Naujas: "bg-gray-400 text-white",
  Diagnostika: "bg-yellow-500 text-white",
  "Dalių užsakymas": "bg-orange-500 text-white",
  Remontuojama: "bg-blue-500 text-white",
  "Paruošta atsiėmimui": "bg-green-500 text-white",
  Uždaryta: "bg-gray-600 text-white",
};

export default function Servisas() {
  const remontai = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilter = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const params = {};
    for (let [key, value] of formData.entries()) {
      if (value) params[key] = value;
    }
    setSearchParams(params);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🛠️ Serviso įrašai</h1>

      {/* Filtravimas */}
      <form
        onSubmit={handleFilter}
        className="bg-white shadow-sm border p-4 rounded flex flex-wrap items-end gap-4"
      >
        <div>
          <label className="block text-sm font-medium">RMA kodas</label>
          <input
            name="rma"
            placeholder="Pvz. GPS_RMA20250629..."
            className="input w-48"
            defaultValue={searchParams.get("rma") || ""}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Telefono nr.</label>
          <input
            name="phone"
            placeholder="+370..."
            className="input w-40"
            defaultValue={searchParams.get("phone") || ""}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Serijinis numeris</label>
          <input
            name="sn"
            placeholder="SN..."
            className="input w-40"
            defaultValue={searchParams.get("sn") || ""}
          />
        </div>

        <button className="btn px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded">
          🔍 Filtruoti
        </button>
      </form>

      {/* <Link
        to="pildyti"
        className="btn bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded"
      >
        + Naujas įrašas
      </Link> */}

      {/* Lentelė */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left">Data</th>
              <th className="px-4 py-2 border-b text-left">Vardas</th>
              <th className="px-4 py-2 border-b text-left">Telefonas</th>
              <th className="px-4 py-2 border-b text-left">Modelis</th>
              <th className="px-4 py-2 border-b text-left">SN</th>
              <th className="px-4 py-2 border-b text-left">RMA</th>
              <th className="px-4 py-2 border-b text-left">Statusas</th>
              <th className="px-4 py-2 border-b text-left">Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {remontai.map((r, i) => (
              <tr
                key={r._id}
                className={`border-b ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50`}
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  {r.receivedDate
                    ? new Date(r.receivedDate).toLocaleString("lt-LT", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </td>
                <td className="px-4 py-2">{r.client?.name || "—"}</td>
                <td className="px-4 py-2">{r.client?.phone || "—"}</td>
                <td className="px-4 py-2">{r.product?.model || "—"}</td>
                <td className="px-4 py-2">{r.product?.serialNumber || "—"}</td>
                <td className="px-4 py-2 font-mono text-sm">
                  {r.product?.externalService?.rmaCode || "—"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      statusColors[r.status] || "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <Link
                    to={`${r._id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Peržiūrėti
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
