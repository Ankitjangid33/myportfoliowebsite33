import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web Developer Portfolio | Your Name",
  description:
    "Full Stack Web Developer specializing in React, Next.js, and modern web technologies. View my projects and get in touch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
