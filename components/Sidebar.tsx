"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: "Works", path: "/works" },
        { name: "About Me", path: "/about" },
        { name: "Publishing", path: "/publishing" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "fixed",
                    top: "20px",
                    left: "20px",
                    zIndex: 200,
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "4px",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                }}
                className="mobile-menu-btn"
            >
                <span style={{ width: "20px", height: "2px", background: "white", transition: "all 0.3s" }} />
                <span style={{ width: "20px", height: "2px", background: "white", transition: "all 0.3s" }} />
                <span style={{ width: "20px", height: "2px", background: "white", transition: "all 0.3s" }} />
            </button>

            {/* Sidebar */}
            <aside
                style={{
                    position: "fixed",
                    top: 0,
                    left: isOpen ? 0 : "-250px",
                    bottom: 0,
                    width: "250px",
                    padding: "var(--spacing-md)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-lg)",
                    zIndex: 150,
                    background: "var(--background)",
                    transition: "left 0.3s ease",
                }}
                className="sidebar"
            >
                {/* Logo */}
                <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        marginTop: "60px",
                    }}
                >
                    AD
                </Link>

                {/* Navigation */}
                <nav
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-sm)",
                    }}
                >
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsOpen(false)}
                                style={{
                                    fontSize: "1rem",
                                    fontWeight: isActive ? 600 : 400,
                                    opacity: isActive ? 1 : 0.6,
                                    transition: "opacity 0.2s ease",
                                }}
                                className="nav-link"
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                    <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        style={{
                            marginTop: "var(--spacing-lg)",
                            fontSize: "0.8rem",
                            opacity: 0.3,
                        }}
                    >
                        Admin
                    </Link>
                </nav>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.5)",
                        zIndex: 140,
                    }}
                    className="sidebar-overlay"
                />
            )}

            <style jsx global>{`
        @media (min-width: 768px) {
          .mobile-menu-btn {
            display: none !important;
          }
          .sidebar {
            left: 0 !important;
          }
          .sidebar-overlay {
            display: none !important;
          }
        }
      `}</style>
        </>
    );
}
