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
import Alkotesteriai from "./pages/Alkotesteriai";
import RedaguotiAlkotesteri from "./pages/RedaguotiAlkotesteri";
import Pasirasymas from "./pages/garantiniai/Pasirasymas";
import Laukimas from "./pages/Laukimas";
import AiBOT from "./pages/AiBOT";
import Kalakutas from "./pages/Kalakutas";

//SERVISAS
import Servisas, { loader as servisasLoader } from "./pages/servisas/Servisas";
import ServisasPildyti, {
  action as pildytiAction,
} from "./pages/servisas/Pildyti";
import ServisasRedaguoti, {
  loader as redaguotiLoader,
  action as redaguotiAction,
} from "./pages/servisas/Redaguoti";
import ServisasPerziureti, {
  loader as perziuretiLoader,
} from "./pages/servisas/Perziureti";

//RMA importai
import RMAList from "./pages/rma/RMAList";
import RMADetails from "./pages/rma/RMADetails";
import RMACreate from "./pages/rma/RMACreate";
import RMAEdit from "./pages/rma/RMAEdit";

//RMA actionai
import { action as rmaCreateAction } from "./pages/rma/RMACreate";
import { action as rmaUpdateAction } from "./pages/rma/RMAEdit";
import { action as rmaDeleteAction } from "./pages/rma/RMADelete";

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

//RMA loaderiai
import { loader as rmaListLoader } from "./pages/rma/RMAList";
import { loader as rmaDetailsLoader } from "./pages/rma/RMADetails";
import { loader as rmaEditLoader } from "./pages/rma/RMAEdit";

import { loader as allPrekesLoader } from "./pages/Prekes";
import { loader as DStatistikaLoader } from "./pages/garantiniai/DStatistika";
import { loader as BStatistikaLoader } from "./pages/garantiniai/BStatistika";
import { loader as userLoader } from "./pages/Layout";
import { loader as garantinisLoader } from "./pages/garantiniai/EditGarantinis";
import { loader as pasirasymasLoader } from "./pages/garantiniai/Pasirasymas";
import { loader as klientaiLoader } from "./pages/Klientai";
import { loader as statistikaLoader } from "./pages/garantiniai/PStatistika";
import { loader as alkotesteriaiLoader } from "./pages/Alkotesteriai";
import { loader as alkotesterisLoader } from "./pages/RedaguotiAlkotesteri";
import Landing from "./pages/Landing";
import { loader as kalakutasLoader } from "./pages/Kalakutas";

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
        path: "garantinis/pasirasymas/:id",
        element: <Pasirasymas />,
        loader: pasirasymasLoader,
      },
      {
        path: "laukimas",
        element: <Laukimas />,
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
            path: "aibotas",
            element: <AiBOT />,
          },
          {
            path: "servisas",
            children: [
              {
                index: true,
                element: <Servisas />,
                loader: servisasLoader,
              },
              {
                path: "pildyti",
                element: <ServisasPildyti />,
                action: pildytiAction,
              },
              {
                path: "redaguoti/:id",
                element: <ServisasRedaguoti />,
                loader: redaguotiLoader,
                action: redaguotiAction,
              },
              {
                path: ":id",
                element: <ServisasPerziureti />,
                loader: perziuretiLoader,
              },
            ],
          },
          {
            path: "rma",
            children: [
              {
                index: true,
                element: <RMAList />,
                loader: rmaListLoader,
              },
              {
                path: "create",
                element: <RMACreate />, // Elementas pridedamas
                action: rmaCreateAction,
              },
              {
                path: ":id",
                element: <RMADetails />,
                loader: rmaDetailsLoader,
              },
              {
                path: ":id/edit",
                element: <RMAEdit />, // Elementas pridedamas
                action: rmaUpdateAction,
                loader: rmaEditLoader,
              },
              {
                path: ":id/delete",
                action: rmaDeleteAction, // Tik action - OK, nes tai POST/DELETE
              },
            ],
          },
          {
            path: "kalakutas",
            element: <Kalakutas />,
            loader: kalakutasLoader,
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
