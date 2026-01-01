import "../../globals.css"
import Providers from "@/app/providers"

export default function LoginLayout({children}){
    return (
        <html>
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}