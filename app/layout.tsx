import type { Metadata } from "next";
import { Martian_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display: squared, engineered mono for headings + the shell prompt.
const martian = Martian_Mono({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Body/UI: highly readable mono for descriptions and lists.
const jetbrains = JetBrains_Mono({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "chinavat — ML researcher & game maker",
  description:
    "Portfolio of Chinavat: machine-learning research, projects, and game jams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${martian.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
