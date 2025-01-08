import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Pildyti from "./pages/garantiniai/Pildyti";
import DStatistika from "./pages/garantiniai/DStatistika";
import BStatistika from "./pages/garantiniai/BStatistika";
import KStatistika from "./pages/garantiniai/KStatistika";
import PStatistika from "./pages/garantiniai/PStatistika";
import Klientai from "./pages/Klientai";
import Prekes from "./pages/Prekes";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Pildyti />} />
          <Route path="/d_statistika" element={<DStatistika />} />
          <Route path="/k_statistika" element={<KStatistika />} />
          <Route path="/p_statistika" element={<PStatistika />} />
          <Route path="/b_statistika" element={<BStatistika />} />
          <Route path="/klientai" element={<Klientai />} />
          <Route path="/prekes" element={<Prekes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
