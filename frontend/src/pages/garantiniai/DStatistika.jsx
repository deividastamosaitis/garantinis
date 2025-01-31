import React, { useState } from "react";
import DStatistikaTable from "../../components/DStatistikaTable";

const DStatistika = () => {
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState([
    {
      id: 1,
      klientas: "Deiviux",
      atsiskaitymas: "grynais",
      kKaina: 119,
      krepselis: [
        { barkodas: "123456", preke: "S7XP-10MP", pKaina: 90 },
        { barkodas: "987654321", preke: "atminties kortele", pKaina: 29 },
      ],
    },
    {
      id: 2,
      klientas: "Laimiux",
      atsiskaitymas: "kortele",
      kKaina: 219,
      krepselis: [
        { barkodas: "111111", preke: "IP kamera", pKaina: 190 },
        {
          barkodas: "987654321",
          preke: "atminties kortele",
          pKaina: 29,
          saskaita: "MAR00000",
        },
      ],
    },
    {
      id: 3,
      klientas: "Vidas",
      atsiskaitymas: "kortele",
      kKaina: 493,
      krepselis: [
        { barkodas: "111111", preke: "IP kamera", pKaina: 350 },
        { barkodas: "987654321", preke: "atminties kortele", pKaina: 40 },
        { barkodas: "987654321", preke: "atminties kortele", pKaina: 90 },
        { barkodas: "987654321", preke: "atminties kortele", pKaina: 13 },
      ],
    },
    {
      id: 4,
      klientas: "Ramute",
      atsiskaitymas: "pavedimas",
      kKaina: 493,
      krepselis: [
        { barkodas: "111111", preke: "IP kamera", pKaina: 350 },
        { barkodas: "987654321", preke: "atminties kortele", pKaina: 40 },
        { barkodas: "987654321", preke: "atminties kortele", pKaina: 90 },
        { barkodas: "987654321", preke: "atminties kortele", pKaina: 13 },
      ],
    },
    {
      id: 5,
      klientas: "Saugirdas",
      atsiskaitymas: "pavedimas",
      kKaina: 493,
      krepselis: [
        { barkodas: "111111", preke: "IP kamera", pKaina: 350 },
        { barkodas: "987654321", preke: "atminties kortele", pKaina: 40 },
        { barkodas: "987654321", preke: "atminties kortele", pKaina: 90 },
        { barkodas: "987654321", preke: "atminties kortele", pKaina: 13 },
      ],
    },
  ]);

  const filteredData =
    filter === "all"
      ? data
      : data.filter((item) => item.atsiskaitymas === filter);

  const totalByPayment = (type) => {
    return data
      .filter((item) => item.atsiskaitymas === type)
      .reduce((sum, item) => sum + item.kKaina, 0);
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
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Data
              </th>
              <th scope="col" class="px-6 py-3">
                Klientas
              </th>
              <th scope="col" class="px-6 py-3">
                Atsiskaitymas
              </th>
              <th scope="col" class="px-6 py-3">
                Kaina
              </th>
              <th scope="col" class="px-6 py-3">
                Prekės
              </th>
              <th scope="col" class="px-6 py-3">
                Sąskaita
              </th>
              <th scope="col" class="px-6 py-3">
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
                kKaina={pirkejas.kKaina}
                krepselis={pirkejas.krepselis}
                saskaita={pirkejas.saskaita}
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
