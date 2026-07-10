"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaEnvelope, FaLock, FaEye } from "react-icons/fa";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@tutorium.com" && password === "admin@tutorium.com") {
      router.push("/admin/dashboard");
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex justify-center">
          <div className="relative h-14 w-14 overflow-hidden rounded-xl ring-1 ring-black/10">
            <Image
              src="/logo-image.png"
              alt="Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-900">
              Email Address
            </label>

            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4">
              <FaEnvelope className="text-gray-400 text-sm" />

              <input
                type="email"
                placeholder="admin@tutorium.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent px-3 py-3 text-sm text-gray-700 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-900">
                Password
              </label>

              <a href="#" className="text-xs font-semibold text-[#0b2d8a]">
                Forgot password?
              </a>
            </div>

            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4">
              <FaLock className="text-gray-400 text-sm" />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent px-3 py-3 text-sm text-gray-700 outline-none"
              />

              <button
                type="button"
                className="text-gray-400 hover:text-[#0b2d8a]"
              >
                <FaEye className="text-sm" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#fdbd01] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#e9ae00]"
          >
            Sign In →
          </button>
        </form>
      </div>
    </main>
  );
}
