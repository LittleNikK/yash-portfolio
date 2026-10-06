import "./globals.css";

export const metadata = {
  title: "Portfolio | Yash",
  description: "Modern developer portfolio built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#0a0c10] text-[#f3f4f6] antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
