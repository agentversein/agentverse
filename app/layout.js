import "./globals.css";
import Providers from "./providers";
import Script from "next/script";
export const metadata = {
  title: "AgentVerse AI",
  description: "AI Agent Marketplace",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    
  },
};

export const viewport = {
  themeColor: "#2563eb",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">
        <Providers>{children}</Providers>
        <Script id="register-sw" strategy="afterInteractive">
  {`
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
      });
    }
  `}
</Script>
        <Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="beforeInteractive"
/>
      </body>
    </html>
  );
}