import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from "./pages/Layout";
import Klientai from "./pages/Klientai";
import Prekes from "./pages/Prekes";
import Login from "./pages/users/Login";
import Register from "./pages/users/Register";
import Atnaujinimai from "./pages/Atnaujinimai";
import Home from "./pages/Home";
import Pildyti from "./pages/garantiniai/Pildyti";
import PStatistika from "./pages/garantiniai/PStatistika";
import DStatistika from "./pages/garantiniai/DStatistika";
import BStatistika from "./pages/garantiniai/BStatistika";
import KStatistika from "./pages/garantiniai/KStatistika";
import EditGarantinis from "./pages/garantiniai/EditGarantinis";
import Konkursas from "./pages/Konkursas";
import Alkotesteriai from "./pages/Alkotesteriai";
import SiandienosAlkotesteriai from "./pages/SiandienosAlkotesteriai";
import RedaguotiAlkotesteri from "./pages/RedaguotiAlkotesteri";
import { action as registerAction } from "./pages/users/Register";
import { action as loginAction } from "./pages/users/Login";
import { action as prekeAction } from "./pages/Prekes";
import { action as garantinisAction } from "./pages/garantiniai/EditGarantinis";
import { createAlkotesterisAction } from "./pages/Alkotesteriai";
import { updateAlkotesterisAction } from "./pages/RedaguotiAlkotesteri";
import {
  updateStatusAction,
  deleteAlkotesterisAction,
} from "./pages/Alkotesteriai";
import { loader as allPrekesLoader } from "./pages/Prekes";
import { loader as DStatistikaLoader } from "./pages/garantiniai/DStatistika";
import { loader as BStatistikaLoader } from "./pages/garantiniai/BStatistika";
import { loader as userLoader } from "./pages/Layout";
import { loader as garantinisLoader } from "./pages/garantiniai/EditGarantinis";
import { loader as klientaiLoader } from "./pages/Klientai";
import { loader as konkursasLoader } from "./pages/Konkursas";
import { loader as statistikaLoader } from "./pages/garantiniai/PStatistika";
import { loader as alkotesteriaiLoader } from "./pages/Alkotesteriai";
import { loader as todayAlkotesteriaiLoader } from "./pages/SiandienosAlkotesteriai";
import { loader as alkotesterisLoader } from "./pages/RedaguotiAlkotesteri";
import Landing from "./pages/Landing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "register",
        element: <Register />,
        action: registerAction,
      },
      {
        path: "login",
        element: <Login />,
        action: loginAction,
      },
      {
        path: "garantinis",
        element: <Layout />,
        loader: userLoader,
        children: [
          { index: true, element: <Atnaujinimai /> },
          { path: "pildyti", element: <Pildyti /> },
          {
            path: "d_statistika",
            element: <DStatistika />,
            loader: DStatistikaLoader,
          },
          {
            path: "klientai",
            element: <Klientai />,
            loader: klientaiLoader,
          },
          {
            path: "k_statistika",
            element: <KStatistika />,
          },
          {
            path: "p_statistika",
            element: <PStatistika />,
            loader: statistikaLoader,
          },
          {
            path: "b_statistika",
            element: <BStatistika />,
            loader: BStatistikaLoader,
          },
          {
            path: "prekes",
            element: <Prekes />,
            loader: allPrekesLoader,
            action: prekeAction,
          },
          {
            path: "garantinis/:id",
            element: <EditGarantinis />,
            loader: garantinisLoader,
            action: garantinisAction,
          },
          {
            path: "alkotesteriai",
            element: <Alkotesteriai />,
            loader: alkotesteriaiLoader,
            action: createAlkotesterisAction,
            children: [
              {
                path: "siandien",
                element: <SiandienosAlkotesteriai />,
                loader: todayAlkotesteriaiLoader,
              },
              {
                path: ":id/redaguoti",
                element: <RedaguotiAlkotesteri />,
                loader: alkotesterisLoader,
                action: updateAlkotesterisAction,
              },
              {
                path: ":id/status",
                action: updateStatusAction,
              },
              {
                path: ":id/istrinti",
                action: deleteAlkotesterisAction,
              },
            ],
          },
          {
            path: "konkursas",
            element: <Konkursas />,
            loader: konkursasLoader,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Login />}></Route>
    //     <Route path="/register" element={<Register />} />
    //     <Route path="/garantinis" element={<Layout />}>
    //       <Route path="/garantinis/pildyti" element={<Pildyti />} />
    //       <Route path="/garantinis/d_statistika" element={<DStatistika />} />
    //       <Route path="/garantinis/k_statistika" element={<KStatistika />} />
    //       <Route path="/garantinis/p_statistika" element={<PStatistika />} />
    //       <Route path="/garantinis/b_statistika" element={<BStatistika />} />
    //       <Route path="/garantinis/klientai" element={<Klientai />} />
    //       <Route path="/garantinis/prekes" element={<Prekes />} />
    //     </Route>
    //   </Routes>
    // </BrowserRouter>
    <RouterProvider router={router} />
  );
};

export default App;
