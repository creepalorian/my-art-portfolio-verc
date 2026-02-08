"use client";

import Link from "next/link";
import Image from "next/image";

export default function TopHeader() {
    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: "60px",
                background: "white",
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                paddingLeft: "var(--spacing-md)",
                paddingRight: "var(--spacing-md)",
                zIndex: 200,
            }}
        >
            <Link
                href="/"
                style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "black",
                }}
            >
                <Image
                    src="/header-full-logo.png"
                    alt="AD Logo"
                    width={669}
                    height={319}
                    priority
                    style={{ height: "40px", width: "auto" }}
                />
            </Link>
        </header>
    );
}
