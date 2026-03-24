import type { Metadata } from "next";
import "./globals.css";
import { RootClientLayout } from "@/components/layout/RootClientLayout";

export const metadata: Metadata = {
  title: "EduFlow — Editorial LMS",
  description:
    "EduFlow is a cinematic, editorial-grade learning platform for ambitious teams and creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <RootClientLayout>{children}</RootClientLayout>
      </body>
    </html>
  );
}