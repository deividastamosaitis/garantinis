import React, { useState, useEffect } from "react";

const Pildyti = () => {
  const [pranesimas, setPranesimas] = useState(null);
  const [atsiskaitymas, setAtsiskaitymas] = useState("");
  const [saskaita, setSaskaita] = useState("");
  const [kvitas, setKvitas] = useState("");
  const [forma, setForma] = useState([
    { barkodas: "", pavadinimas: "", serial: "", kaina: 0 },
  ]);
  const [klientas, setKlientas] = useState({
    vardas: "",
    telefonas: "",
    miestas: "Kaunas",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Check barcode and auto-fill product name
  const checkBarcode = async (barcode, index) => {
    if (!barcode || barcode.length < 3) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/prekes/barcode/${barcode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        const naujaForma = [...forma];
        naujaForma[index].pavadinimas = data.data.pavadinimas;
        setForma(naujaForma);
      }
    } catch (error) {
      console.error("Klaida tikrinant barkodą:", error);
    }
  };

  const debouncedCheckBarcode = debounce(checkBarcode, 500);

  const handlePrideti = () => {
    setForma([
      ...forma,
      { barkodas: "", pavadinimas: "", serial: "", kaina: 0 },
    ]);
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

    // Special handling for barcode field
    if (field === "barkodas") {
      debouncedCheckBarcode(value, index);
    }
  };

  const totalKaina = forma.reduce(
    (total, forma) => total + (forma.kaina || 0),
    0
  );

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const createdAt = new Date();

    setIsLoading(true);

    try {
      // First save/update all products
      await Promise.all(
        forma.map(async (item) => {
          if (item.barkodas && item.pavadinimas) {
            try {
              await fetch("/api/prekes/upsert", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  barkodas: item.barkodas,
                  pavadinimas: item.pavadinimas,
                }),
              });
            } catch (error) {
              console.error(`Klaida išsaugant prekę ${item.barkodas}:`, error);
            }
          }
        })
      );

      // Then submit the garantinis form
      const garantinis = {
        klientas,
        prekes: forma,
        atsiskaitymas,
        saskaita,
        kvitas,
        totalKaina,
        createdBy: userId,
        createdAt,
      };

      const response = await fetch("/api/garantinis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(garantinis),
      });

      if (response.ok) {
        setPranesimas("Įrašas sėkmingai sukurtas!");
        setTimeout(() => setPranesimas(null), 3000);

        // Reset form
        setForma([{ barkodas: "", pavadinimas: "", serial: "", kaina: 0 }]);
        setKlientas({ vardas: "", telefonas: "", miestas: "Kaunas" });
        setAtsiskaitymas("");
        setSaskaita("");
        setKvitas("");
      } else {
        const errorData = await response.json();
        setPranesimas(errorData.message || "Klaida kuriant įrašą");
      }
    } catch (error) {
      setPranesimas("Klaida siunčiant duomenis");
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      {/* Pranešimas */}
      {pranesimas && (
        <div
          className={`mb-4 p-4 border rounded ${
            pranesimas.includes("sėkmingai")
              ? "bg-green-100 border-green-400 text-green-700"
              : "bg-red-100 border-red-400 text-red-700"
          }`}
        >
          {pranesimas}
        </div>
      )}
      <form className="p-6">
        <div className="grid gap-6 mb-6 md:grid-cols-6">
          {forma.map((row, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border border-gray-300 p-3 rounded-lg relative"
            >
              <div>
                <label
                  htmlFor={`barkodas-${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Barkodas
                </label>
                <input
                  type="text"
                  id={`barkodas-${index}`}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={row.barkodas}
                  onChange={(e) => handleInputChange(index, "barkodas", e)}
                  onBlur={(e) => checkBarcode(e.target.value, index)}
                />
              </div>
              <div>
                <label
                  htmlFor={`pavadinimas-${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Prekė
                </label>
                <input
                  type="text"
                  id={`pavadinimas-${index}`}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={row.pavadinimas}
                  onChange={(e) => handleInputChange(index, "pavadinimas", e)}
                />
              </div>
              <div>
                <label
                  htmlFor={`serial-${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  SN
                </label>
                <input
                  type="text"
                  id={`serial-${index}`}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={row.serial}
                  onChange={(e) => handleInputChange(index, "serial", e)}
                />
              </div>
              <div>
                <label
                  htmlFor={`kaina-${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Kaina €
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id={`kaina-${index}`}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                  disabled={forma.length <= 1}
                >
                  <i className="fa-solid fa-minus"></i>
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
              className="w-full focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>

        {/* Rest of your form remains the same */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Kliento informacija:
          </label>
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-6">
          <div>
            <label
              htmlFor="vardas"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Vardas Pavardė
            </label>
            <input
              type="text"
              id="vardas"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={klientas.vardas}
              onChange={(e) =>
                setKlientas({ ...klientas, vardas: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label
              htmlFor="tel"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Telefono nr.:
            </label>
            <input
              type="text"
              id="tel"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={klientas.telefonas}
              onChange={(e) =>
                setKlientas({ ...klientas, telefonas: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label
              htmlFor="miestas"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Miestas
            </label>
            <input
              type="text"
              id="miestas"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={klientas.miestas}
              onChange={(e) =>
                setKlientas({ ...klientas, miestas: e.target.value })
              }
            />
          </div>

          <div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Atsiskaitymo būdas
              </label>
              <div className="flex">
                <select
                  value={atsiskaitymas}
                  onChange={(e) => setAtsiskaitymas(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                >
                  <option value="" disabled>
                    Pasirinkite atsiskaitymo būdą
                  </option>
                  <option value="grynais">Grynais</option>
                  <option value="kortele">Kortele</option>
                  <option value="pavedimas">Pavedimas</option>
                  <option value="COD">COD</option>
                  <option value="lizingas">Lizingas</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Sąskaita (neprivaloma)
              </label>
              <input
                type="text"
                value={saskaita}
                onChange={(e) => setSaskaita(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div className="">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Kvito nr.: (atsiskaičius kortele/grynais)
            </label>
            <input
              type="text"
              value={kvitas}
              onChange={(e) => setKvitas(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Krepšelio kaina:
            </label>
            <p className="text-lg font-semibold">{totalKaina.toFixed(2)} €</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          type="button"
          disabled={isLoading}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Vykdoma...
            </span>
          ) : (
            "Pateikti"
          )}
        </button>
      </form>
    </section>
  );
};

export default Pildyti;
