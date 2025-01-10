import React, { useState } from "react";

const Pildyti = () => {
  const [forma, setForma] = useState([
    { barkodas: "", preke: "", serial: "", kaina: 0 },
  ]);

  const handlePrideti = () => {
    setForma([...forma, { barkodas: "", preke: "", serial: "", kaina: 0 }]);
  };

  const handleAtimti = (index) => {
    const naujaForma = forma.filter((_, i) => i !== index);
    setForma(naujaForma);
  };

  const handleInputChange = (index, field, event) => {
    const naujaForma = [...forma];
    const value =
      field === "kaina"
        ? parseFloat(event.target.value || 0)
        : event.target.value;
    naujaForma[index][field] = value;
    setForma(naujaForma);
  };

  const totalKaina = forma.reduce(
    (total, forma) => total + (forma.kaina || 0),
    0
  );

  return (
    <section>
      <form className="p-6">
        <div class="grid gap-6 mb-6 md:grid-cols-6">
          {forma.map((row, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
                position: "relative",
              }}
            >
              <div>
                <label
                  htmlFor={`barkodas-${index}`}
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Barkodas
                </label>
                <input
                  type="text"
                  id={`barkodas-${index}`}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={row.barkodas}
                  onChange={(e) => handleInputChange(index, "barkodas", e)}
                />
              </div>
              <div>
                <label
                  htmlFor={`preke-${index}`}
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Prekė
                </label>
                <input
                  type="text"
                  id={`preke-${index}`}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={row.preke}
                  onChange={(e) => handleInputChange(index, "preke", e)}
                />
              </div>
              <div>
                <label
                  htmlFor={`serial-${index}`}
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  SN
                </label>
                <input
                  type="text"
                  id={`serial-${index}`}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={row.serial}
                  onChange={(e) => handleInputChange(index, "serial", e)}
                />
              </div>
              <div>
                <label
                  htmlFor={`kaina-${index}`}
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Kaina €
                </label>
                <input
                  type="number"
                  id={`kaina-${index}`}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={row.kaina}
                  onChange={(e) => handleInputChange(index, "kaina", e)}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Atimti prekę:
                </label>
                <button
                  onClick={() => handleAtimti(index)}
                  type="button"
                  className="w-full focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                  <i class="fa-solid fa-minus"></i>
                </button>
              </div>
            </div>
          ))}

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Pridėti prekę:
            </label>
            <button
              onClick={handlePrideti}
              type="button"
              className=" w-full focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 fa-solid fa-plus"
            ></button>
          </div>
        </div>
        <div class="mb-6 ">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Kliento informacija:
          </label>
        </div>
        <div class="grid gap-6 mb-6 md:grid-cols-6">
          <div>
            <label
              for="vardas"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Vardas Pavardė
            </label>
            <input
              type="text"
              id="kaina"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="90"
              required
            />
          </div>
          <div>
            <label
              for="tel"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Telefono nr.:
            </label>
            <input
              type="text"
              id="tel"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="90"
              required
            />
          </div>
          <div>
            <label
              for="miestas"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Miestas
            </label>
            <input
              type="text"
              id="miestas"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Kaunas"
            />
          </div>
          <div></div>
          <div>
            <label
              for="miestas"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Krepšelio kaina:
            </label>
            <p>{totalKaina.toFixed(2)}</p>
          </div>
        </div>

        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Pateikti
        </button>
      </form>
    </section>
  );
};

export default Pildyti;
