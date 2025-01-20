import React from "react";
import { useLoaderData, redirect } from "react-router-dom";
import customFetch from "../utils/customFetch.js";
import { toast } from "react-toastify";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/prekes");
    return { data };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Prekes = () => {
  const { data } = useLoaderData();
  const { prekes } = data;
  return prekes.map((preke) => (
    <li>
      {preke.barkodas}, {preke.pavadinimas}, {preke.kategorija}
    </li>
  ));
};

export default Prekes;
