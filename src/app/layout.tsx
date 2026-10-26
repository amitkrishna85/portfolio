import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { prisma } from "@/lib/prisma";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Amit Krishna | Director of Engineering - Industrial Digital Twin Platforms",
    template: "%s | Amit Krishna",
  },
  description:
    "Executive portfolio of Amit Krishna, Director of Engineering leading Industrial Digital Twin Platforms, OT/IT convergence, simulation, and enterprise APM systems.",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let accentColor = "cyan";
  let defaultTheme = "dark";

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    });
    if (settings) {
      if (settings.accentColor) accentColor = settings.accentColor;
      if (settings.defaultTheme) defaultTheme = settings.defaultTheme;
    }
  } catch (err) {
    // Fallback if db isn't reachable during early build
  }

  return (
    <html lang="en" suppressHydrationWarning data-accent={accentColor}>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme={defaultTheme}
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
