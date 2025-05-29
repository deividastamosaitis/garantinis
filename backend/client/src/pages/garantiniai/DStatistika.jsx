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
      : garantinis.filter((item) =>
          Array.isArray(item.atsiskaitymas)
            ? item.atsiskaitymas.some((ats) => ats.tipas === filter)
            : item.atsiskaitymas === filter
        );

  if (!Array.isArray(filteredData)) {
    console.error("filteredData nėra masyvas:", filteredData);
    return null; // Arba grąžinkite klaidos pranešimą
  }

  // Suskaičiuoti bendrą sumą pagal atsiskaitymo būdą
  const totalByPayment = (type) => {
    return garantinis.reduce((sum, item) => {
      if (Array.isArray(item.atsiskaitymas)) {
        const suma = item.atsiskaitymas
          .filter((ats) => ats.tipas === type)
          .reduce((s, ats) => s + (ats.suma || 0), 0);
        return sum + suma;
      } else if (item.atsiskaitymas === type) {
        return sum + (item.totalKaina || 0);
      }
      return sum;
    }, 0);
  };
  const totalPayment = garantinis
    .filter((item) => item.totalKaina)
    .reduce((sum, item) => sum + item.totalKaina, 0);
  return (
    <>
      <div className="flex gap-4 mb-4">
        {["all", "pavedimas", "grynais", "kortele", "lizingas", "COD"].map(
          (type) => (
            <button
              key={type}
              className={`px-4 py-2 border rounded ${
                filter === type ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setFilter(type)}
            >
              {type === "all"
                ? "Visi"
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          )
        )}
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Klientas</th>
              <th className="px-6 py-3">Telefonas</th>
              <th className="px-6 py-3">Atsiskaitymas</th>
              <th className="px-6 py-3">Kaina</th>
              <th className="px-6 py-3">Prekės</th>
              <th className="px-6 py-3">Sąskaita</th>
              <th className="px-6 py-3">Kvitas</th>
              <th className="px-6 py-3">Sukūrė</th>
              <th className="px-6 py-3">Veiksmas</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((pirkejas) => (
              <DStatistikaTable
                key={pirkejas._id}
                _id={pirkejas._id}
                klientas={pirkejas.klientas}
                atsiskaitymas={
                  Array.isArray(pirkejas.atsiskaitymas)
                    ? pirkejas.atsiskaitymas
                    : typeof pirkejas.atsiskaitymas === "string"
                    ? [
                        {
                          tipas: pirkejas.atsiskaitymas,
                          suma: pirkejas.totalKaina,
                        },
                      ]
                    : []
                }
                kKaina={pirkejas.totalKaina}
                krepselis={pirkejas.prekes}
                saskaita={pirkejas.saskaita}
                kvitas={pirkejas.kvitas}
                createdBy={pirkejas.createdBy}
                createdAt={pirkejas.createdAt}
                originalDate={pirkejas.originalDate}
              />
            ))}
          </tbody>
        </table>
      </div>

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
