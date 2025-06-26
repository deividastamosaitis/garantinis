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
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Remontų sąrašas</h1>

      <form onSubmit={handleFilter} className="flex flex-wrap gap-4">
        <input
          name="rma"
          placeholder="RMA"
          className="input"
          defaultValue={searchParams.get("rma") || ""}
        />
        <input
          name="phone"
          placeholder="Tel. nr."
          className="input"
          defaultValue={searchParams.get("phone") || ""}
        />
        <input
          name="sn"
          placeholder="Serijinis nr."
          className="input"
          defaultValue={searchParams.get("sn") || ""}
        />
        <button className="btn">Filtruoti</button>
      </form>

      <table className="w-full table-fixed border-collapse text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">Vardas</th>
            <th className="px-4 py-2">Tel.</th>
            <th className="px-4 py-2">Modelis</th>
            <th className="px-4 py-2">SN</th>
            <th className="px-4 py-2">RMA</th>
            <th className="px-4 py-2">Statusas</th>
            <th className="px-4 py-2">Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {remontai.map((r) => (
            <tr key={r._id} className="border-t">
              <td className="px-4 py-2">{r.client?.name || "—"}</td>
              <td className="px-4 py-2">{r.client?.phone || "—"}</td>
              <td className="px-4 py-2">{r.product?.model || "—"}</td>
              <td className="px-4 py-2">{r.product?.serialNumber || "—"}</td>
              <td className="px-4 py-2">
                {r.product?.externalService?.rmaCode || "—"}
              </td>
              <td className="px-4 py-2">{r.status || "—"}</td>
              <td className="px-4 py-2">
                <Link to={`${r._id}`} className="text-gray-700 hover:underline">
                  Atidaryti
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="pildyti" className="btn">
        + Naujas įrašas
      </Link>
    </div>
  );
}
