"use client";

import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const SpaceLoader = dynamic(() => import("../common/SpaceLoader"), {
  ssr: false,
});

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideFooter = pathname?.startsWith("/dashboard");

  return (
    <>
      <SpaceLoader />
      <Navbar />
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}
