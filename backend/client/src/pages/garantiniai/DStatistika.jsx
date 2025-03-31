import React, { useState, useEffect } from "react";
import { useLoaderData, redirect } from "react-router-dom";
import customFetch from "../../utils/customFetch.js";
import DStatistikaTable from "../../components/DStatistikaTable";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/garantinis/today");
    return { data };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const DStatistika = () => {
  const [filter, setFilter] = useState("all");
  const data = useLoaderData(); // Gauti duomenis iš loader funkcijos
  const garantinis = data.data.garantinis;

  // Filtruoti duomenis pagal atsiskaitymo būdą
  const filteredData =
    filter === "all"
      ? garantinis
      : garantinis.filter((item) => item.atsiskaitymas === filter);

  if (!Array.isArray(filteredData)) {
    console.error("filteredData nėra masyvas:", filteredData);
    return null; // Arba grąžinkite klaidos pranešimą
  }

  // Suskaičiuoti bendrą sumą pagal atsiskaitymo būdą
  const totalByPayment = (type) => {
    return garantinis
      .filter((item) => item.atsiskaitymas === type)
      .reduce((sum, item) => sum + item.totalKaina, 0);
  };

  const totalPayment = garantinis
    .filter((item) => item.totalKaina)
    .reduce((sum, item) => sum + item.totalKaina, 0);

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
        <button
          className={`px-4 py-2 border rounded ${
            filter === "kortele" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("lizingas")}
        >
          Lizingas
        </button>
        <button
          className={`px-4 py-2 border rounded ${
            filter === "kortele" ? "bg-gray-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("COD")}
        >
          C.O.D
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
                Telefonas
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
                Kvitas
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
                key={pirkejas._id}
                _id={pirkejas._id}
                klientas={pirkejas.klientas}
                atsiskaitymas={pirkejas.atsiskaitymas}
                kKaina={pirkejas.totalKaina}
                krepselis={pirkejas.prekes}
                saskaita={pirkejas.saskaita}
                kvitas={pirkejas.kvitas}
                createdBy={pirkejas.createdBy}
                createdAt={pirkejas.createdAt}
              />
            ))}
          </tbody>
        </table>
      </div>
      {/* Bendras atsiskaitymų skaičius pagal būdą */}
      <div className="grid grid-cols-3 mt-4">
        <div className="flex text-center h-20 bg-yellow-500 text-white font-bold items-center justify-center">
          <span>Pavedimu: </span>
          <span className="ml-1">
            {totalByPayment("pavedimas").toFixed(2)}€
          </span>
        </div>
        <div className="flex text-center h-20 bg-red-500 text-white font-bold items-center justify-center">
          <span>Kortele: </span>
          <span className="ml-1">{totalByPayment("kortele").toFixed(2)}€</span>
        </div>
        <div className="flex text-center h-20 bg-green-500 text-white font-bold items-center justify-center">
          <span>Grynais: </span>
          <span className="ml-1">{totalByPayment("grynais").toFixed(2)}€</span>
        </div>
      </div>
    </>
  );
};

export default DStatistika;
