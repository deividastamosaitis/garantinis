import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white place-items-center h-screen">
        <div className="text-center ">
          <Link to="/login">
            <button
              type="button"
              class="inline-block rounded-full bg-cyan-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-cyan-3 transition duration-150 ease-in-out hover:bg-cyan-300 hover:shadow-cyan-600 focus:bg-cyan-300 focus:shadow-cyan-50 focus:outline-none focus:ring-0 active:bg-cyan-600 active:shadow-cyan-50 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
            >
              Prisijungimas
            </button>
          </Link>
        </div>
        <div className="text-center">
          <img src="logo.png" class="h-24 lg:h-48" alt="GPSLogo" />
        </div>
        <div className="text-center">
          <Link to="/register">
            <button
              type="button"
              class="inline-block rounded-full bg-cyan-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-cyan-3 transition duration-150 ease-in-out hover:bg-cyan-300 hover:shadow-cyan-600 focus:bg-cyan-300 focus:shadow-cyan-50 focus:outline-none focus:ring-0 active:bg-cyan-600 active:shadow-cyan-50 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
            >
              Registracija
            </button>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Landing;
