import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { PostProvider } from "@/context/post-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Twitter Clone",
  description: "Un clon simple de Twitter",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <PostProvider>{children}</PostProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
