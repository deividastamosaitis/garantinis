// src/pages/Kalakutas.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const range = url.searchParams.get("range") || "month";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const withManufacturer = url.searchParams.get("withManufacturer") || "0";
  const manufacturer = url.searchParams.get("manufacturer") || "";

  try {
    const [reportRes, metaRes] = await Promise.all([
      customFetch.get("/analytics/kalakutas", {
        params: { range, from, to, withManufacturer, manufacturer },
      }),
      customFetch.get("/prekes/meta"),
    ]);
    return { report: reportRes.data, meta: metaRes.data };
  } catch (err) {
    toast.error(err?.response?.data?.message || "Nepavyko gauti duomenų");
    return {
      report: {
        rows: [],
        totals: { vienetai: 0, bendraSuma: 0 },
        from: null,
        to: null,
      },
      meta: { manufacturers: [], groupsByManufacturer: {} },
    };
  }
};

export default function Kalakutas() {
  const ld = useLoaderData() || {};
  const report = ld.report || {
    rows: [],
    totals: { vienetai: 0, bendraSuma: 0 },
    from: null,
    to: null,
  };
  const meta = ld.meta || { manufacturers: [] };

  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const [range, setRange] = useState(sp.get("range") || "month");
  const [from, setFrom] = useState(sp.get("from") || "");
  const [to, setTo] = useState(sp.get("to") || "");
  const [withManufacturer, setWithManufacturer] = useState(
    sp.get("withManufacturer") === "1"
  );
  const [manufacturer, setManufacturer] = useState(
    sp.get("manufacturer") || ""
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (from && to) {
      params.set("from", from);
      params.set("to", to);
    } else {
      params.set("range", range);
    }
    if (withManufacturer) params.set("withManufacturer", "1");
    if (manufacturer) params.set("manufacturer", manufacturer);
    navigate({ search: params.toString() }, { replace: true });
  }, [range, from, to, withManufacturer, manufacturer, navigate]);

  const rows = useMemo(() => report.rows || [], [report]);
  const totals = report.totals || { vienetai: 0, bendraSuma: 0 };

  const submitFilters = (e) => e.preventDefault();
  const resetCustom = () => {
    setFrom("");
    setTo("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Slaptasis šuldubuldu</h1>

      {/* Filtrai */}
      <form
        onSubmit={submitFilters}
        className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-6 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Intervalas
          </label>
          <select
            value={range}
            onChange={(e) => {
              setRange(e.target.value);
              resetCustom();
            }}
            className="w-full p-2 border rounded-md"
            disabled={!!(from && to)}
          >
            <option value="week">Savaitė</option>
            <option value="month">Mėnuo</option>
            <option value="quarter">Ketvirtis</option>
            <option value="halfyear">Pusmetis</option>
            <option value="year">Metai</option>
          </select>
          {from && to && (
            <p className="text-xs text-gray-500 mt-1">
              Naudojamas individualus laikotarpis
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nuo
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Iki
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gamintojas
          </label>
          <select
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Visi gamintojai</option>
            {(meta.manufacturers || []).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={withManufacturer}
              onChange={(e) => setWithManufacturer(e.target.checked)}
            />
            <span>Rodyti gamintoją stulpelyje</span>
          </label>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={resetCustom}
            className="px-3 py-2 border rounded-md"
          >
            Išvalyti datą
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Taikyti
          </button>
        </div>
      </form>

      {/* Lentelė */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Prekių grupė
                </th>
                {withManufacturer && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Gamintojas
                  </th>
                )}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Kiekis (vnt.)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Bendra kaina (€)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="px-6 py-3 text-sm text-gray-900">{r.grupe}</td>
                  {withManufacturer && (
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {r.gamintojas || "—"}
                    </td>
                  )}
                  <td className="px-6 py-3 text-sm text-right">{r.vienetai}</td>
                  <td className="px-6 py-3 text-sm text-right">
                    {r.bendraSuma.toFixed(2)}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={withManufacturer ? 4 : 3}
                    className="px-6 py-4 text-sm text-gray-500"
                  >
                    Įrašų nėra pagal pasirinktus filtrus
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Iš viso
                </th>
                {withManufacturer && <th></th>}
                <th className="px-6 py-3 text-right text-sm font-semibold">
                  {totals.vienetai}
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold">
                  {totals.bendraSuma.toFixed(2)}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Laikotarpis:{" "}
          {report.from ? new Date(report.from).toLocaleDateString() : "—"} –{" "}
          {report.to ? new Date(report.to).toLocaleDateString() : "—"}
        </p>
      </div>
    </div>
  );
}
