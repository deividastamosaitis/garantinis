import React, { useState } from "react";
import { Form, redirect, useNavigation, Link } from "react-router-dom";
import customFetch from "../../utils/customFetch.js";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post("/auth/register", data);
    toast.success("Vartotojas sukūrtas");
    return redirect("/login");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Register = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state == "submitting";
  return (
    <main className="p-4 card flex h-screen">
      <div className="m-auto">
        <h1 className="title">Registracija</h1>

        <Form method="post">
          <input
            type="email"
            name="email"
            placeholder="email address"
            className="input"
            autoFocus
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
          />

          <input
            type="text"
            name="vardas"
            placeholder="Vardas"
            className="input"
          />
          <input
            type="text"
            name="pavarde"
            placeholder="Pavarde"
            className="input"
          />
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Registruojama..." : "Registruotis"}
          </button>
        </Form>
      </div>
    </main>
  );
};

export default Register;
