import "./globals.css"
import Providers from "./providers"
import { Toaster } from "sonner"

export const metadata = {
  title: "Koniqtech CRM",
  description: "Field Service CRM Platform"
}

export default function RootLayout({
  children
}:{
  children: React.ReactNode
}) {

  return (

    <html lang="en">

      <body>

        <Providers>

          {children}
           <Toaster
          position="top-right"
          richColors
          closeButton
        />

        </Providers>

      </body>

    </html>

  )
}