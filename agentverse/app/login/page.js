"use client";
import { auth } from "@/lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
const [otp, setOtp] = useState("");
const [confirmation, setConfirmation] = useState(null);
const sendOTP = async () => {
  try {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
        }
      );
    }

    const confirmationResult =
      await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        window.recaptchaVerifier
      );

    setConfirmation(confirmationResult);

    alert("OTP Sent Successfully");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          width: 420,
          background: "#fff",
          padding: 35,
          borderRadius: 20,
          boxShadow: "0 15px 40px rgba(0,0,0,.08)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          🚀 AgentVerse
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: 30,
          }}
        >
          Sign in to continue
        </p>

        <button
          onClick={() => signIn("google")}
          style={{
            width: "100%",
            padding: 14,
            border: "none",
            borderRadius: 10,
            background: "#2563eb",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Continue with Google
        </button>

        <div
          style={{
            textAlign: "center",
            margin: "25px 0",
            color: "#888",
          }}
        >
          OR
        </div>

        <input
          placeholder="Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 10,
            border: "1px solid #ddd",
            marginBottom: 15,
          }}
        />

       <button
  onClick={sendOTP}
  style={{
    width: "100%",
    padding: 14,
    border: "none",
    borderRadius: 10,
    background: "#16a34a",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
  }}
>
  Send OTP
</button>
<div
  id="recaptcha-container"
  style={{ marginTop: 20 }}
></div>
      </div>
    </div>
  );
}