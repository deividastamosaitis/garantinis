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
import Home from "./pages/Home";
import Pildyti from "./pages/garantiniai/Pildyti";
import PStatistika from "./pages/garantiniai/PStatistika";
import DStatistika from "./pages/garantiniai/DStatistika";
import BStatistika from "./pages/garantiniai/BStatistika";
import KStatistika from "./pages/garantiniai/KStatistika";
import { action as registerAction } from "./pages/users/Register";
import { action as loginAction } from "./pages/users/Login";
import { action as prekeAction } from "./pages/Prekes";
import { loader as allPrekesLoader } from "./pages/Prekes";
import { loader as DStatistikaLoader } from "./pages/garantiniai/DStatistika";
import { loader as BStatistikaLoader } from "./pages/garantiniai/BStatistika";
import { loader as userLoader } from "./pages/Layout";
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
          { path: "pildyti", element: <Pildyti /> },
          {
            path: "d_statistika",
            element: <DStatistika />,
            loader: DStatistikaLoader,
          },
          {
            path: "klientai",
            element: <Klientai />,
          },
          {
            path: "k_statistika",
            element: <KStatistika />,
          },
          {
            path: "p_statistika",
            element: <PStatistika />,
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
