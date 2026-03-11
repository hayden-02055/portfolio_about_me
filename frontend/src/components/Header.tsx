"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#competencies", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#approach", label: "Approach" },
  { href: "#tech", label: "Tech" },
  { href: "#future", label: "Direction" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a
            href="#"
            className="text-lg font-bold text-gray-900 hover:text-gray-600 transition-colors"
          >
            HW.
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/chat"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Chat
              </Link>
            </li>
          </ul>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <ul className="md:hidden mt-4 pb-4 space-y-3 border-t border-gray-100 pt-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/chat"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Chat
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
