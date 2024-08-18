import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import Note from "@/lib/models/notes";
import { Types } from "mongoose";

/**
 * 
 * @param req http://localhost:3000/api/notes/66bfa0c79351e7ffd6180990?userId=66bf9b8f9351e7ffd6180987
 * @param context { params: { note: "66bfa0c79351e7ffd6180990" } }
 * @returns { "_id": "66bfa0c79351e7ffd6180990", "title": "Title 1", "description": "Description 1", "user": "66bf9b8f9351e7ffd6180987", "__v": 0 }
 */
export const GET = async (req: Request, context: {params: any}) => {
    // Lấy noteId từ context (tham số động từ URL)
    const noteId = context.params.note;
    try {
        await connect();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing userId"}), 
                {
                    status: 400
                }
            );
        }

        if(!noteId || !Types.ObjectId.isValid(noteId)) {
            return new NextResponse(
                JSON.stringify({message: "Invalid or missing noteId"}), 
                {
                    status: 400
                }
            );
        }

        // check if the user not exists
        const user = await User.findById(userId);
        if(!user) {
            return new NextResponse(
                JSON.stringify({message: "User not found"}), 
                {
                    status: 404
                }
            );
        }

        // Fetch the note and enusre it belongs to the user
        const note = await Note.findOne({ _id: noteId, user: userId });
        if(!note) {
            return new NextResponse(
                JSON.stringify({message: "Note not found or does not belong to user"}), 
                {
                    status: 404
                }
            );
        }

        return new NextResponse(JSON.stringify(note), {status: 200});
    }
    catch (error) {
        return new NextResponse("Error in fetching notes" + error, {status: 500});
    }
}