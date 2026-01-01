import jwt from "jsonwebtoken"

export function GET(req){
    const token = (req.cookies.get("token"))?.value
    if(!token){
        return Response.redirect(new URL("/login", req.url))
    }
    const userData = jwt.verify(token, process.env.JWT_SECRET)
    return Response.json({data: userData, error: null})
}