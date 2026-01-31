"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Works", path: "/works" },
        { name: "About Me", path: "/about" },
        { name: "Publishing", path: "/publishing" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <aside
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                width: "250px",
                padding: "var(--spacing-md)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-lg)",
                zIndex: 50, // Below frame (9999)
            }}
        >
            {/* Logo */}
            <Link
                href="/"
                style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
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
                {/* Admin Link at the bottom/separate for potential chaos */}
                <Link
                    href="/admin"
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
    );
}
