import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NextTopLoader from 'nextjs-toploader';
import { Analytics } from '@vercel/analytics/next';
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CareXchange - Medicine Donation Platform",
  description: "A revolutionary platform for medicine donation and resale, bridging healthcare gaps by facilitating the redistribution of surplus medications.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50 flex flex-col min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="flex-grow pt-16">
            <NextTopLoader
              color="#40cab7"
              initialPosition={0.08}
              crawlSpeed={100}
              speed={50}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              shadow="0 0 10px #40cab7,0 0 5px #40cab7"
            />
            {children}
            <Analytics />
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
} 