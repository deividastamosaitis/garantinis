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
          {searchResults.searchType === "serial" &&
          searchResults.specificProduct ? (
            <div className="bg-base-200 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold mb-2">
                Prekės pagal serijos numerį
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Prekė:</p>
                  <p>{searchResults.specificProduct.pavadinimas}</p>
                </div>
                <div>
                  <p className="font-medium">Serijos numeris:</p>
                  <p>{searchResults.specificProduct.serial}</p>
                </div>
                <div>
                  <p className="font-medium">Barkodas:</p>
                  <p>{searchResults.specificProduct.barkodas}</p>
                </div>
                <div>
                  <p className="font-medium">Kaina:</p>
                  <p>{searchResults.specificProduct.kaina?.toFixed(2)} €</p>
                </div>
                <div>
                  <p className="font-medium">Pirkimo data:</p>
                  <p>
                    {new Date(
                      searchResults.specificProduct.purchaseDate
                    ).toLocaleDateString("lt-LT")}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Klientas:</p>
                  <p>
                    {searchResults.specificProduct.clientInfo?.vardas ||
                      "Nežinomas"}
                    {searchResults.specificProduct.clientInfo?.telefonas &&
                      ` (${searchResults.specificProduct.clientInfo.telefonas})`}
                  </p>
                </div>
              </div>
            </div>
          ) : searchResults.clientInfo ? (
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
            <div className="alert alert-warning mb-4">Nieko nerasta</div>
          )}

          {searchResults.products.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                {searchResults.searchType === "serial"
                  ? "Rasta prekė"
                  : `${searchResults.products.length} prekės`}
              </h2>

              <div className="overflow-x-auto">
                <table className="table table-zebra w-full text-start">
                  <thead>
                    <tr className="text-center border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th>Prekė</th>
                      <th>Barkodas</th>
                      <th>Serijos nr.</th>
                      <th>Kaina</th>
                      <th>Pirkimo data</th>
                      {searchResults.searchType === "serial" && (
                        <th>Klientas</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.products.map((product, index) => (
                      <tr
                        className="text-center border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                        key={index}
                      >
                        <td>{product.pavadinimas}</td>
                        <td>{product.barkodas}</td>
                        <td>{product.serial}</td>
                        <td>{product.kaina?.toFixed(2)} €</td>
                        <td>
                          {new Date(product.purchaseDate).toLocaleDateString(
                            "lt-LT"
                          )}
                        </td>
                        {searchResults.searchType === "serial" && (
                          <td>
                            {product.clientInfo?.vardas || "Nežinomas"}
                            {product.clientInfo?.telefonas &&
                              ` (${product.clientInfo.telefonas})`}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  {searchResults.searchType === "client" && (
                    <tfoot>
                      <tr className=" text-center border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th>Viso:</th>
                        <th>{searchResults.totalValue.toFixed(2)} €</th>
                        <th></th>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Šiandienos garantiniai</h2>
          {/* Display today's garantinis here */}
        </div>
      )}
    </div>
  );
};

export default Klientai;
