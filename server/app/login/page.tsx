"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useState } from "react";
import login, { LOGIN_MUTATION_KEY } from "~/services/user/mutation/Login";

function Login() {
  const [email, setEmail] = useState<string>("");

  const [password, setPassword] = useState<string>("");

  return (
    <div
      style={{ width:"100vw", height:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}
    >
      <div
        style={{
          width: 400,
          height: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
        }}
      >
        <h6>
          Sign in to your account
        </h6>
        <div
          style={{
            marginTop: 4,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <input
            placeholder="small"
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            style={{ marginTop: 2 }}
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button
          onClick={async (event) => {
            event.preventDefault();
            try {
              await signIn("credentials", {
                email,
                password,
                redirect: true,
                callbackUrl: "/",
              });
            } catch (error) {
              console.error("AUTH FAILED: ", error);
            }
          }}
        >
          Sign in
        </button>

        <div style={{ display: "flex", flexDirection: "row", marginTop: 10 }}>
          <p style={{ marginTop: 4 }}>Not a member?</p>
          {/* <link href="/register">
            Register
          </link> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
