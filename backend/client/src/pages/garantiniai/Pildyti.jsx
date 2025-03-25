import React, { useState } from "react";

const Pildyti = () => {
  const [pranesimas, setPranesimas] = useState(null);
  const [atsiskaitymas, setAtsiskaitymas] = useState(""); // Atsiskaitymo būdas
  const [saskaita, setSaskaita] = useState(""); // Sąskaitos numeris
  const [forma, setForma] = useState([
    { barkodas: "", pavadinimas: "", serial: "", kaina: 0 },
  ]);
  const [klientas, setKlientas] = useState({
    vardas: "",
    telefonas: "",
    miestas: "Kaunas",
  });

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
  };

  const totalKaina = forma.reduce(
    (total, forma) => total + (forma.kaina || 0),
    0
  );

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");
    const createdAt = new Date();

    const garantinis = {
      klientas,
      prekes: forma,
      atsiskaitymas, // Pridėkite atsiskaitymo būdą
      saskaita, // Pridėkite sąskaitą
      totalKaina,
      createdBy: userId,
      createdAt,
    };

    try {
      const response = await fetch("/api/garantinis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(garantinis),
      });

      if (response.ok) {
        setPranesimas("Įrašas sėkmingai sukurtas!");
        setTimeout(() => setPranesimas(null), 3000);

        // Išvalyti formą
        setForma([{ barkodas: "", pavadinimas: "", serial: "", kaina: 0 }]);
        setKlientas({ vardas: "", telefonas: "", miestas: "Kaunas" });
        setAtsiskaitymas(""); // Išvalyti atsiskaitymo būdą
        setSaskaita(""); // Išvalyti sąskaitą
      } else {
        setPranesimas("Klaida kuriant įrašą");
      }
    } catch (error) {
      setPranesimas("Klaida siunčiant duomenis");
    }
  };

  return (
    <section>
      {/* Pranešimas */}
      {pranesimas && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {pranesimas}
        </div>
      )}
      <form className="p-6">
        <div className="grid gap-6 mb-6 md:grid-cols-6">
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
            {/* Atsiskaitymo būdas */}
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
                  <option value="pavedimas">COD</option>
                  <option value="pavedimas">Lizingas</option>
                </select>
              </div>
            </div>

            {/* Sąskaita */}
            <div>
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
          <div></div>
          <div>
            <label
              htmlFor="miestas"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Krepšelio kaina:
            </label>
            <p>{totalKaina.toFixed(2)}</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Pateikti
        </button>
      </form>
    </section>
  );
};

export default Pildyti;
