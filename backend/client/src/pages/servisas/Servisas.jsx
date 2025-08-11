import { useLoaderData, Link, useSearchParams } from "react-router-dom";
import customFetch from "../../utils/customFetch";

export async function loader({ request }) {
  const url = new URL(request.url);
  const rma = url.searchParams.get("rma") || "";
  const phone = url.searchParams.get("phone") || "";
  const sn = url.searchParams.get("sn") || "";
  const status = url.searchParams.get("status") || "";
  const category = url.searchParams.get("category") || "";

  const { data } = await customFetch.get("/tickets");

  let filtered = data.filter((item) => {
    const rmaMatch = rma
      ? item.product.externalService?.rmaCode?.includes(rma)
      : true;
    const phoneMatch = phone ? item.client.phone?.includes(phone) : true;
    const snMatch = sn ? item.product.serialNumber?.includes(sn) : true;
    const statusMatch = status ? item.status === status : true;
    const categoryMatch = category ? item.product?.category === category : true;
    return rmaMatch && phoneMatch && snMatch && statusMatch && categoryMatch;
  });

  filtered.sort((a, b) => {
    if (a.status === "Uždaryta" && b.status !== "Uždaryta") return 1;
    if (a.status !== "Uždaryta" && b.status === "Uždaryta") return -1;
    return new Date(b.receivedDate) - new Date(a.receivedDate);
  });

  return { all: data, filtered };
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
  const { all, filtered } = useLoaderData();
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

  const quickFilter = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value) {
      params[key] = value;
    } else {
      delete params[key];
    }
    setSearchParams(params);
  };

  let uniqueStatuses = Array.from(
    new Set(all.map((r) => r.status).filter(Boolean))
  );
  uniqueStatuses = uniqueStatuses.sort((a, b) => {
    if (a === "Uždaryta") return 1;
    if (b === "Uždaryta") return -1;
    return a.localeCompare(b, "lt");
  });

  const statusCounts = uniqueStatuses.reduce((acc, s) => {
    acc[s] = all.filter((r) => r.status === s).length;
    return acc;
  }, {});

  const categories = Array.from(
    new Set(all.map((r) => r.product?.category).filter(Boolean))
  );
  const categoryCounts = categories.reduce((acc, c) => {
    acc[c] = all.filter((r) => r.product?.category === c).length;
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-8xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🛠️ Serviso įrašai</h1>

      {/* Greitas filtravimas pagal statusą */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => quickFilter("status", "")}
          className={`px-3 py-1 rounded border ${
            !searchParams.get("status")
              ? "bg-blue-600 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Visi ({all.length})
        </button>
        {uniqueStatuses.map((status) => (
          <button
            key={status}
            onClick={() => quickFilter("status", status)}
            className={`px-3 py-1 rounded border ${
              searchParams.get("status") === status
                ? `${statusColors[status] || "bg-gray-300 text-gray-800"}`
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {status} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Greitas filtravimas pagal kategoriją */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => quickFilter("category", "")}
          className={`px-3 py-1 rounded border ${
            !searchParams.get("category")
              ? "bg-blue-600 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Visos kategorijos ({all.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => quickFilter("category", cat)}
            className={`px-3 py-1 rounded border ${
              searchParams.get("category") === cat
                ? "bg-green-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {cat} ({categoryCounts[cat]})
          </button>
        ))}
      </div>

      {/* Filtravimo forma */}
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
              <th className="px-4 py-2 border-b text-left">Raktažodis</th>
              <th className="px-4 py-2 border-b text-left">Statusas</th>
              <th className="px-4 py-2 border-b text-left">Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
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
                <td className="px-4 py-2">{r.keyword || "—"}</td>
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
