import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export const metadata: Metadata = {
  title: {
    default: "Beyond the Sky – Astronomy & Space Research Center",
    template: "%s | Beyond the Sky",
  },
  description:
    "Exploring the universe beyond Earth. A world-class astronomy research center offering space science education, telescope observation nights, astrophotography training, and pioneering research.",
  keywords: [
    "astronomy",
    "space research",
    "observatory",
    "astrophysics",
    "telescope",
    "exoplanets",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
