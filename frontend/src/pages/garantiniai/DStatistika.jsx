import React, { useState, useEffect } from "react";
import DStatistikaTable from "../../components/DStatistikaTable";

const DStatistika = () => {
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState([]); // Čia saugosime duomenis iš serverio

  // Gauti duomenis iš serverio
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/garantinis"); // Jūsų API maršrutas
        const result = await response.json();
        setData(result.garantinis); // Nustatome gautus duomenis į state
      } catch (error) {
        console.error("Klaida gaunant duomenis:", error);
      }
    };

    fetchData();
  }, []);

  // Filtruoti duomenis pagal atsiskaitymo būdą
  const filteredData =
    filter === "all"
      ? data
      : data.filter((item) => item.atsiskaitymas === filter);

  // Suskaičiuoti bendrą sumą pagal atsiskaitymo būdą
  const totalByPayment = (type) => {
    return data
      .filter((item) => item.atsiskaitymas === type)
      .reduce((sum, item) => sum + item.totalKaina, 0);
  };

  return (
    <>
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 border rounded ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("all")}
        >
          Visi
        </button>
        <button
          className={`px-4 py-2 border rounded ${
            filter === "pavedimas" ? "bg-yellow-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("pavedimas")}
        >
          Pavedimas
        </button>
        <button
          className={`px-4 py-2 border rounded ${
            filter === "grynais" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("grynais")}
        >
          Grynais
        </button>
        <button
          className={`px-4 py-2 border rounded ${
            filter === "kortele" ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("kortele")}
        >
          Kortele
        </button>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Data
              </th>
              <th scope="col" className="px-6 py-3">
                Klientas
              </th>
              <th scope="col" className="px-6 py-3">
                Atsiskaitymas
              </th>
              <th scope="col" className="px-6 py-3">
                Kaina
              </th>
              <th scope="col" className="px-6 py-3">
                Prekės
              </th>
              <th scope="col" className="px-6 py-3">
                Sąskaita
              </th>
              <th scope="col" className="px-6 py-3">
                Sukūrė
              </th>
              <th scope="col" className="px-6 py-3">
                Veiksmas
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((pirkejas, index) => (
              <DStatistikaTable
                key={index}
                klientas={pirkejas.klientas}
                atsiskaitymas={pirkejas.atsiskaitymas}
                kKaina={pirkejas.totalKaina}
                krepselis={pirkejas.prekes}
                saskaita={pirkejas.saskaita}
                createdBy={pirkejas.createdBy} // Vartotojas, kuris sukūrė įrašą
                createdAt={pirkejas.createdAt} // Sukūrimo data
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-3">
        <div className="flex text-center h-20 bg-yellow-500 text-white font-bold items-center justify-center ">
          <span>Pavedimu: </span>
          <span className="ml-1">{totalByPayment("pavedimas")}€</span>
        </div>
        <div className="flex text-center h-20 bg-red-500 text-white font-bold items-center justify-center ">
          <span>Kortele: </span>
          <span className="ml-1">{totalByPayment("kortele")}€</span>
        </div>
        <div className="flex text-center h-20 bg-green-500 text-white font-bold items-center justify-center ">
          <span>Grynais: </span>
          <span className="ml-1">{totalByPayment("grynais")}€</span>
        </div>
      </div>
    </>
  );
};

export default DStatistika;
