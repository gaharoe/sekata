import "../../globals.css"

export default function PublicLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        {children}
      </body>
    </html>
  )
}