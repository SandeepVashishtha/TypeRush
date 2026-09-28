import "./globals.css";

export const metadata = {
  title: "TYPE RACER — Arcade Typing Speed Battle",
  description: "High-speed arcade typing racing game. Type faster, drive faster, defeat AI opponents!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-arcade-bg text-slate-100 antialiased selection:bg-arcade-neonPink selection:text-white">
        <div className="relative min-h-screen flex flex-col bg-arcade-grid">
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
          <div className="relative z-10 flex flex-col flex-grow">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
