import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import Note from "@/lib/models/notes";
import { Types } from "mongoose";

export const GET = async (req: Request) => {
    try {
        await connect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({message: "Invalid userId"}), 
                {
                    status: 400
                }
            );
        }

        const user = await User.findById(userId);
        if(!user) {
            return new NextResponse(
                JSON.stringify({message: "User not found"}), 
                {
                    status: 404
                }
            );
        }

        const notes = await Note.find({user: new Types.ObjectId(userId)});
        return new NextResponse(JSON.stringify(notes), {status: 200});
    }
    catch(error) {
        return new NextResponse("Error in fetching notes" + error, {status: 500});
    }
}

export const POST = async (req: Request) => {
    try {
        await connect();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        const body = await req.json();
        const { title, description } = body;

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing userId"}), 
                {
                    status: 400
                }
            );
        }
       
        // check if user not exists
        const user = await User.findById(userId);
        if(!user) {
            return new NextResponse(
                JSON.stringify({message: "User not found"}), 
                {
                    status: 404
                }
            );
        }

        const newNote = new Note({
            title,
            description,
            user: new Types.ObjectId(userId)
        });

        await newNote.save();

        return new NextResponse(
            JSON.stringify(
                {
                    message: "Note is created", 
                    note: newNote
                }
            ), 
            {
                status: 200
            }
        );

    }
    catch(err) {

    }
}