import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/garantinis");
    return { data };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Klientai = () => {
  const { data } = useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const { data } = await customFetch.get(
        `/garantinis/search?searchTerm=${searchTerm}`
      );
      setSearchResults(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Search failed");
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Klientų paieška</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Vedam kliento info: vardas arba numeris"
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
          {searchResults.clientInfo ? (
            <div className="bg-base-200 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold mb-2">
                Kliento informacija
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Vardas:</p>
                  <p>{searchResults.clientInfo.vardas}</p>
                </div>
                <div>
                  <p className="font-medium">Telefonas:</p>
                  <p>{searchResults.clientInfo.telefonas}</p>
                </div>
                <div>
                  <p className="font-medium">Miestas:</p>
                  <p>{searchResults.clientInfo.miestas || "-"}</p>
                </div>
                <div>
                  <p className="font-medium">Pirkimų skaičius:</p>
                  <p>{searchResults.purchaseCount}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-medium">Bendra suma:</p>
                <p className="text-lg font-bold">
                  {searchResults.totalValue.toFixed(2)} €
                </p>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning mb-4">Klientas nerastas</div>
          )}

          <h2 className="text-xl font-semibold mb-4">
            {searchResults.products.length} prekės
          </h2>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                  <th>Prekė</th>
                  <th>Barkodas</th>
                  <th>Serijos nr.</th>
                  <th>Kaina</th>
                  <th>Pirkimo data</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.products.map((product, index) => (
                  <tr
                    className="border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                    key={index}
                  >
                    <td>{product.pavadinimas}</td>
                    <td>{product.barkodas}</td>
                    <td>{product.serial}</td>
                    <td>{product.kaina.toFixed(2)} €</td>
                    <td>
                      {new Date(product.purchaseDate).toLocaleDateString(
                        "lt-LT"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                  <th colSpan="3">Viso:</th>
                  <th>{searchResults.totalValue.toFixed(2)} €</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Rezultatai:</h2>
          {/* Display today's garantinis here */}
        </div>
      )}
    </div>
  );
};

export default Klientai;
