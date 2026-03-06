import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: [],
  weight: ["400", "500", "700"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "SEOKart",
  description: "SEOKart",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html>
      <body className={inter.className}>
          {children}
      </body>
    </html>
  );
}
