import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import ThemeRegistry from "@/components/ThemeRegistry";

export const metadata: Metadata = {
  title: {
    default: "MyMCIT",
    template: "%s | MyMCIT",
  },
  description: "Course reviews for the University of Pennsylvania MCIT program",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
        <Analytics />
      </body>
    </html>
  );
}
