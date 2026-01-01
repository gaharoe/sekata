"use client"

import { useSelector } from "react-redux"

export default function Navbar(){
    const user = useSelector(state => state.user)

    return (
        <nav className={`fixed top-0 left-0 right-0 h-10 bg-white/20 backdrop-blur-sm flex items-center px-3 border-b border-b-gray-200`}>{user.nama}</nav>
    )
}