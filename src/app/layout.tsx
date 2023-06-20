import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/Toaster";

export const metadata = {
  title: "Breaditto",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        {/* fix for: Type 'Promise<Element>' is missing the following properties from type 'ReactElement<any, any>': type, props, keyts(2786) */}
        {/* @ts-expect-error Server Component */}
        <Navbar />
        <div className="container max-w-7xl mx-auto h-full pt-12">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
