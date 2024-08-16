import { NextResponse } from "next/server"

export const GET = async () => {
    return new NextResponse("This is my first API route")
}