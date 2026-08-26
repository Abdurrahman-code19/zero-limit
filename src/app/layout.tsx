import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Zero Limit | Premium Fashion E-commerce",
  description: "Premium fashion for the bold and confident. No limits, just style.",
  keywords: ["fashion", "streetwear", "luxury", "premium", "clothing"],
  icons: {
    icon: "/favicon.png",
  },
  verification: {
    google: "i-PWsrp8tuxwd6Egx9qcpAVy_q7kaY_DNeZNFazER0U",
  },
  openGraph: {
    title: "Zero Limit | Premium Fashion E-commerce",
    description: "Premium fashion for the bold and confident. No limits, just style.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
