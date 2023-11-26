import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { initialTitle, randomTitle } from "./Titles"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: initialTitle,
    description: "Design a quilt!",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
