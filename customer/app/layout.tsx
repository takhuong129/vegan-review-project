'use client'
import React, { useEffect, useState } from "react";
import "./globals.css";
import { Navbar, Footer } from "@/components";
import Loading from "./loading";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Include metadata and other head elements here if necessary */}
        <title>Vegan Review</title>
      </head>

      <body>
        <Navbar />
        <main className="mt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
