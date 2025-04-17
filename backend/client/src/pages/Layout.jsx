import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useLoaderData, redirect } from "react-router-dom";
import { useState } from "react";
import customFetch from "../utils/customFetch.js";

export const loader = async () => {
  try {
    const [userResponse, garantinisResponse, todayResponse] = await Promise.all(
      [
        customFetch.get("/users/current-user"),
        customFetch.get("/garantinis"),
        customFetch.get("/garantinis/today"),
      ]
    );

    const garantinisArray = garantinisResponse.data.garantinis || [];
    const todayGarantinisArray = todayResponse.data.garantinis || [];

    return {
      user: userResponse.data,
      garantinis: garantinisArray,
      todaygarantinis: todayGarantinisArray,
    };
  } catch (error) {
    return redirect("/");
  }
};

const Layout = () => {
  const navigate = useNavigate();
  const { user, garantinis, todaygarantinis } = useLoaderData();

  const totalPayment = todaygarantinis
    .filter((item) => item.totalKaina)
    .reduce((sum, item) => sum + item.totalKaina, 0);

  //skaičiuojam mėnesio suma
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const totalMonthPayment = garantinis
    .filter((item) => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate.getMonth() === currentMonth &&
        itemDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, item) => sum + item.totalKaina, 0);

  //skaiciuojam kiek siandien krepseliu
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

  const todayGarantinis = garantinis.filter((item) =>
    item.createdAt.startsWith(todayDate)
  );

  return (
    <>
      <header></header>

      <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span class="sr-only">Atidaryti meniu</span>
        <svg
          class="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="logo-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <Link to="/garantinis/" className="flex items-center ps-2.5 mb-5">
            <img src="logo.png" class="h-6 me-3 sm:h-7" alt="GPSLogo" />
            <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Garantinis
            </span>
          </Link>
          <ul class="space-y-2 font-medium">
            <li>
              <Link
                to="/garantinis/pildyti"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <i class="fa-solid fa-pen-to-square w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>
                <span class="ms-3">Pildyti</span>
              </Link>
            </li>
            <li>
              <Link
                to="/garantinis/d_statistika"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <i class="fa-solid fa-chart-simple flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></i>
                <span class="flex-1 ms-3 whitespace-nowrap">
                  Dienos statistika
                </span>
              </Link>
            </li>
            {user.user.role === "admin" && (
              <>
                <ul class="space-y-2 font-medium">
                  <li className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                    <i className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white fa-solid fa-chart-pie"></i>
                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                      Statistika
                    </span>
                    <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                      Admin
                    </span>
                  </li>
                  {/* This id matches data-collapse-toggle */}
                  <li>
                    <Link
                      to="/garantinis/k_statistika"
                      className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      Klientų
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/garantinis/p_statistika"
                      className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      Prekių
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/garantinis/b_statistika"
                      className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      Bendra
                    </Link>
                  </li>
                </ul>
              </>
            )}

            <li>
              <Link
                to="/garantinis/klientai"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <i class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-user"></i>
                <span class="flex-1 ms-3 whitespace-nowrap">Klientai</span>
              </Link>
            </li>
            <li>
              <Link
                to="/garantinis/prekes"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <i class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-tag"></i>

                <span class="flex-1 ms-3 whitespace-nowrap">Prekės</span>
              </Link>
            </li>
            <li>
              <Link
                to="/garantinis/rma"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <i class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-screwdriver-wrench"></i>

                <span class="flex-1 ms-3 whitespace-nowrap">Servisas</span>
              </Link>
            </li>
            <li>
              <Link
                to="/garantinis/alkotesteriai"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <i class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-wine-bottle"></i>

                <span class="flex-1 ms-3 whitespace-nowrap">Alkotesteriai</span>
              </Link>
            </li>
            <li>
              <Link
                to="/garantinis/konkursas"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <i class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white fa-solid fa-gift"></i>

                <span class="flex-1 ms-3 whitespace-nowrap">Konkursas</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
      <div class="p-4 sm:ml-64">
        <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div class="grid grid-cols-3 gap-4 mb-4">
            <div class="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
              <p class="text-2xl text-gray-400 dark:text-gray-500">
                Šiandienos užpildyti krepšeliai: {todayGarantinis.length} vnt
              </p>
            </div>
            <div class="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
              <p class="text-2xl text-gray-400 dark:text-gray-500">
                Šiandienos suma: {totalPayment}€
              </p>
            </div>
            <div class="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
              <p class="text-2xl text-gray-400 dark:text-gray-500">
                Mėnesio užpildyti krepšeliai: {totalMonthPayment}€
              </p>
            </div>
          </div>
          <div class="grid grid-cols-1 items-center justify-center h-100 mb-4 rounded bg-gray-50 dark:bg-gray-800">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
