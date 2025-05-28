import { NextResponse } from "next/server";



export async function GET(request: Request) {
    const io = global.io;
    console.log("GLOBAL IO: ", io);

    io.to('123').emit('tool-call','collect_processes')
    return NextResponse.json({ message:"hello" })
}