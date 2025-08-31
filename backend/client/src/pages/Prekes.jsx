// src/pages/prekes.jsx
import React, { useMemo, useState } from "react";
import { useLoaderData, Form, redirect } from "react-router-dom";
import customFetch from "../utils/customFetch.js";
import { toast } from "react-toastify";

export const loader = async () => {
  try {
    const [{ data }, metaResp] = await Promise.all([
      customFetch.get("/prekes"),
      customFetch.get("/prekes/meta"),
    ]);
    return { data, meta: metaResp.data };
  } catch (error) {
    toast.error(error?.response?.data?.msg || "Nepavyko gauti duomenų");
    return {
      data: { prekes: [] },
      meta: { manufacturers: [], groupsByManufacturer: {} },
    };
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const userId = localStorage.getItem("userId");
  const newPreke = Object.fromEntries(formData);
  try {
    await customFetch.post("/prekes", { ...newPreke, createdBy: userId });
    toast.success("Prekė sėkmingai pridėta");
    return redirect("/garantinis/prekes");
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.msg ||
        "Klaida kuriant prekę"
    );
    return null;
  }
};

const Prekes = () => {
  const { data, meta } = useLoaderData();
  const { prekes } = data;
  const { manufacturers = [], groupsByManufacturer = {} } = meta || {};

  // --- Naujos prekės formos valstybei (kaip buvo) ---
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const availableGroups = useMemo(
    () =>
      selectedManufacturer
        ? groupsByManufacturer[selectedManufacturer] || []
        : [],
    [selectedManufacturer, groupsByManufacturer]
  );

  // --- Filtrų būsenos (nauja) ---
  const [filterManufacturer, setFilterManufacturer] = useState("");
  const [filterGroup, setFilterGroup] = useState("");

  const filterGroups = useMemo(
    () =>
      filterManufacturer ? groupsByManufacturer[filterManufacturer] || [] : [],
    [filterManufacturer, groupsByManufacturer]
  );

  // --- Priklausomas filtravimas sąraše (nauja) ---
  const filteredPrekes = useMemo(() => {
    return prekes.filter((p) => {
      if (filterManufacturer && p.gamintojas !== filterManufacturer)
        return false;
      if (filterGroup && p.grupe !== filterGroup) return false;
      return true;
    });
  }, [prekes, filterManufacturer, filterGroup]);

  // Redagavimo modalas – kaip buvo
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    pavadinimas: "",
    gamintojas: "",
    grupe: "",
  });

  const openEdit = (preke) => {
    setEditing(preke._id);
    setEditForm({
      pavadinimas: preke.pavadinimas || "",
      gamintojas: preke.gamintojas || "",
      grupe: preke.grupe || "",
    });
  };
  const closeEdit = () => setEditing(null);
  const onEditManufacturer = (val) =>
    setEditForm((f) => ({ ...f, gamintojas: val, grupe: "" }));

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await customFetch.patch(`/prekes/${editing}`, {
        pavadinimas: editForm.pavadinimas,
        gamintojas: editForm.gamintojas,
        grupe: editForm.grupe,
      });
      toast.success("Prekė atnaujinta");
      const idx = prekes.findIndex((p) => p._id === editing);
      if (idx > -1) {
        prekes[idx].pavadinimas = editForm.pavadinimas;
        prekes[idx].gamintojas = editForm.gamintojas;
        prekes[idx].grupe = editForm.grupe;
      }
      closeEdit();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Klaida atnaujinant prekę");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Prekių valdymas</h1>

      {/* --- Filtrų juosta sąrašui (nauja) --- */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gamintojas
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={filterManufacturer}
            onChange={(e) => {
              setFilterManufacturer(e.target.value);
              setFilterGroup(""); // resetinam grupę
            }}
          >
            <option value="">Visi gamintojai</option>
            {manufacturers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grupė
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            disabled={!filterManufacturer}
          >
            <option value="">
              {filterManufacturer
                ? "Visos grupės"
                : "Pirma pasirinkite gamintoją"}
            </option>
            {filterGroups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setFilterManufacturer("");
              setFilterGroup("");
            }}
            className="px-4 py-2 rounded-md border"
          >
            Išvalyti filtrus
          </button>
        </div>
      </div>

      {/* --- Nauja prekė (kaip buvo, bet be `selected` ant <option>) --- */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Pridėti naują prekę</h2>
        <Form method="post" className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label
              htmlFor="barkodas"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Barkodas
            </label>
            <input
              type="text"
              id="barkodas"
              name="barkodas"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="pavadinimas"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pavadinimas
            </label>
            <input
              type="text"
              id="pavadinimas"
              name="pavadinimas"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="gamintojas"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gamintojas
            </label>
            <select
              id="gamintojas"
              name="gamintojas"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
            >
              <option value="" disabled>
                Pasirinkite gamintoją
              </option>
              {manufacturers.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="grupe"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Prekių grupė
            </label>
            <select
              id="grupe"
              name="grupe"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={!selectedManufacturer}
              // value nevaldom – nes tai forma; jei nori, gali pridėti local state ir value
            >
              <option value="" disabled>
                {selectedManufacturer
                  ? "Pasirinkite grupę"
                  : "Pirma pasirinkite gamintoją"}
              </option>
              {availableGroups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Pridėti prekę
            </button>
          </div>
        </Form>
      </div>

      {/* --- Sąrašas --- */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Prekių sąrašas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barkodas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pavadinimas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gamintojas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grupė
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Redaguoti
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrekes.map((preke) => (
                <tr key={preke._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {preke.barkodas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {preke.pavadinimas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {preke.gamintojas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {preke.grupe}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => openEdit(preke)}
                      className="text-blue-600 hover:text-blue-800 underline"
                      title="Redaguoti"
                    >
                      Redaguoti
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPrekes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-sm text-gray-500">
                    Įrašų nėra
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modalas redagavimui – kaip buvo */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Redaguoti prekę</h3>
            <form
              onSubmit={submitEdit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pavadinimas
                </label>
                <input
                  type="text"
                  value={editForm.pavadinimas}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, pavadinimas: e.target.value }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gamintojas
                </label>
                <select
                  value={editForm.gamintojas}
                  onChange={(e) => onEditManufacturer(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="" disabled>
                    Pasirinkite gamintoją
                  </option>
                  {manufacturers.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grupė
                </label>
                <select
                  value={editForm.grupe}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, grupe: e.target.value }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="" disabled>
                    Pasirinkite grupę
                  </option>
                  {(groupsByManufacturer[editForm.gamintojas] || []).map(
                    (g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 rounded-md border"
                >
                  Atšaukti
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white"
                >
                  Išsaugoti
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prekes;
