import Providers from "@/app/providers"
import "../../globals.css"
import Navbar from "@/app/components/Navbar"

export default function PublicLayout({ children }) {
  return (
    <html lang="en">
      <body className="pt-10">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}