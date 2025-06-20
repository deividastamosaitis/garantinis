import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { User, Phone, Calendar, Euro, Pencil } from "lucide-react";
import { toast } from "react-toastify";

export const loader = async () => {
  try {
    const [userResponse, garantinisResponse] = await Promise.all([
      customFetch.get("/users/current-user"),
      customFetch.get("/garantinis"),
    ]);

    return {
      user: userResponse.data,
      data: garantinisResponse.data,
    };
  } catch (error) {
    toast.error(error?.response?.data?.msg || "Klaida kraunant duomenis");
    return error;
  }
};

const Klientai = () => {
  const { user, data } = useLoaderData();
  const garantinis = data.garantinis;
  const isAdmin = user?.user?.role === "admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const { data } = await customFetch.get(
        `/garantinis/search?searchTerm=${encodeURIComponent(searchTerm)}`
      );
      setSearchResults(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Search failed");
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEdit = (garantinisId, productId = null) => {
    navigate(
      `../garantinis/${garantinisId}${productId ? `?product=${productId}` : ""}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Paieška</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Įveskite kliento vardą, tel. numerį arba prekės serijos nr."
            className="input input-bordered flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSearching || !searchTerm.trim()}
          >
            {isSearching ? "Ieškoma..." : "Ieškoti"}
          </button>
        </form>
      </div>

      {searchResults ? (
        <div>
          {searchResults.products?.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Rasta: {searchResults.products.length}
              </h2>

              {/* Grupavimas pagal garantinisId */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(
                  searchResults.products.reduce((groups, product) => {
                    const id = product.garantinisId;
                    if (!groups[id]) groups[id] = [];
                    groups[id].push(product);
                    return groups;
                  }, {})
                ).map(([garantinisId, products], index) => {
                  const firstProduct = products[0];
                  const client = firstProduct.clientInfo || {};
                  const date = new Date(
                    firstProduct.purchaseDate
                  ).toLocaleDateString("lt-LT");
                  const totalSum = products.reduce(
                    (acc, item) => acc + (item.kaina || 0),
                    0
                  );

                  return (
                    <div
                      key={index}
                      className="bg-white shadow-md rounded-xl p-5 space-y-4 border border-gray-200"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start border-b pb-3">
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-gray-800 font-semibold text-base">
                            <User size={16} />
                            {client.vardas || "Nežinomas"}
                          </p>
                          {client.telefonas && (
                            <p className="flex items-center gap-2 text-gray-600 text-sm">
                              <Phone size={14} />
                              {client.telefonas}
                            </p>
                          )}
                          <p className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar size={14} />
                            Pirkimo data: {date}
                          </p>
                        </div>
                        {isAdmin && (
                          <button
                            className="flex items-center gap-1 text-sm text-blue-700 border border-blue-400 px-2 py-1 rounded hover:bg-blue-100 transition"
                            onClick={() => handleEdit(garantinisId)}
                          >
                            <Pencil size={14} />
                            Redaguoti
                          </button>
                        )}
                      </div>

                      {/* Prekių lentelė */}
                      <div className="overflow-x-auto">
                        <table className="table w-full table-sm divide-y divide-gray-200">
                          <thead className="bg-gray-50 text-sm text-gray-600">
                            <tr>
                              <th className="py-2 px-3 text-left">Prekė</th>
                              <th className="py-2 px-3 text-left">Barkodas</th>
                              <th className="py-2 px-3 text-left">
                                Serijos nr.
                              </th>
                              <th className="py-2 px-3 text-right">Kaina</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((p, i) => (
                              <tr key={i} className="hover:bg-gray-50 text-sm">
                                <td className="py-2 px-3">{p.pavadinimas}</td>
                                <td className="py-2 px-3">{p.barkodas}</td>
                                <td className="py-2 px-3">{p.serial}</td>
                                <td className="py-2 px-3 text-right">
                                  {p.kaina?.toFixed(2)} €
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-gray-50 text-sm font-semibold">
                              <td className="py-2 px-3 text-right" colSpan={3}>
                                Bendra suma:
                              </td>
                              <td className="py-2 px-3 text-right flex items-center justify-end gap-1 font-bold">
                                <Euro size={14} />
                                {totalSum.toFixed(2)} €
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="alert alert-warning mb-4">Nieko nerasta</div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Rezultatai</h2>
        </div>
      )}
    </div>
  );
};

export default Klientai;
