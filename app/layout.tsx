import "./globals.css"
import Providers from "./providers"

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

        </Providers>

      </body>

    </html>

  )
}