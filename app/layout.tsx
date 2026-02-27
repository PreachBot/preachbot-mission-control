import type { Metadata } from "next";
import { Inter, Bodoni_Moda, Raleway } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const bodoniModa = Bodoni_Moda({ 
  subsets: ["latin"],
  variable: '--font-bodoni',
  display: 'swap',
});
const raleway = Raleway({ 
  subsets: ["latin"],
  variable: '--font-raleway',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Mission Control | George & PreachBot",
  description: "Command center for tracking goals, tasks, and building together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${bodoniModa.variable} ${raleway.variable}`}>{children}</body>
    </html>
  );
}
