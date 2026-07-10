"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaThLarge,
  FaUsers,
  FaGraduationCap,
  FaBookOpen,
  FaCalendarAlt,
  FaCog,
  FaBars,
  FaTimes,
  FaBook,
} from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: FaThLarge },
  { name: "Students", href: "/admin/students", icon: FaUsers },
  { name: "Subjects", href: "/admin/subjects", icon: FaBook },
  { name: "Tutors", href: "/admin/tutors", icon: FaGraduationCap },
  { name: "Assignments", href: "/admin/assignments", icon: FaBookOpen },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-[280px] bg-[#0b2d8a] text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-4  px-6 py-7">
            <div className="relative h-25 w-25 overflow-hidden rounded-xl">
              <Image
                src="/logo--white.png"
                alt="Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto lg:hidden"
            >
              <FaTimes />
            </button>
          </div>

          <nav className="flex-1 px-5 py-6">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-4 rounded-xl px-4 py-3 text-[15px] font-semibold transition ${
                      active
                        ? "bg-white text-[#0b2d8a]"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="text-lg" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-white/10 px-5 py-6">
            <Link
              href="#"
              onClick={() => setOpen(false)}
              className={`mb-6 flex items-center gap-4 rounded-xl px-4 py-3 text-[15px] font-semibold transition ${
                pathname === "/admin/settings"
                  ? "bg-white text-[#0b2d8a]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <FaCog />
              Settings
            </Link>

            <div className="flex items-center gap-3 px-4">
              <div className="h-10 w-10 rounded-full bg-[#fdbd01]" />
              <div>
                <p className="font-bold">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-[280px]">
        <div className="sticky top-0 z-20 flex items-center bg-gray-50 px-5 py-4 lg:hidden">
          <button
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0b2d8a] text-white shadow-lg"
          >
            <FaBars />
          </button>
        </div>

        <div className="px-5 py-8 md:px-8 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
