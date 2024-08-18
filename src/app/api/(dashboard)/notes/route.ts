import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import Note from "@/lib/models/notes";
import { Types } from "mongoose";

/**
 * Example URL: http://localhost:3000/api/notes?userId=66bf9b8f9351e7ffd6180987
 */
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

        // Get all note of this user
        const notes = await Note.find({user: new Types.ObjectId(userId)});
        return new NextResponse(JSON.stringify(notes), {status: 200});
    }
    catch(error) {
        return new NextResponse("Error in fetching notes" + error, {status: 500});
    }
}

/**
 * Example URL: http://localhost:3000/api/notes?userId=66bf9b8f9351e7ffd6180987
 */
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
    catch(error) {
        return new NextResponse(
            JSON.stringify(
                {
                    message: "Error in creating note",
                    error
                }
            ) ,
            {
                status: 500
            }
        );
    }
}

/**
 * Example URL: http://localhost:3000/api/notes?userId=66bf9b8f9351e7ffd6180987
 */
export const PATCH = async (req: Request) => {
    try{
        await connect();

        const body = await req.json();
        const { noteId, title, description } = body;

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if(!noteId || !Types.ObjectId.isValid(noteId)) {
            return new NextResponse(
                JSON.stringify({
                    message: "Invalid or missing noteId"
                }),
                { status: 400 }
            )
        }

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({
                    message: "Invalid or missing userId"
                }),
                { status: 400 }
            )
        }

        // chech if the user not exists
        const user = await User.findById(userId);
        if(!user) {
            return new NextResponse(
                JSON.stringify({
                    message: "User not found"
                }),
                { status: 404 }
            )
        }

        // Find the note and ensure it belong to the user
        const note = await Note.findOne({_id: noteId, user: userId})
        if(!note) {
            return new NextResponse(
                JSON.stringify({
                    message: "Note not found or does not belong to the user"
                }),
                { status: 404 }
            )
        }

        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { title, description},
            { new: true }
        )

        return new NextResponse(
            JSON.stringify({message: "Note is updated", note: updatedNote}), 
            { status: 200 }
        )
    }
    catch (error) {
        return new NextResponse(
            JSON.stringify({message: "Error in updating note", error}), 
            { status: 500 }
        )
    }
}

/**
 * 
 * http://localhost:3000/api/notes?userId=66bf9b8f9351e7ffd6180987&noteId=66bfa0f69351e7ffd6180996
 */
export const DELETE = async (req: Request) => {
    try {

        await connect();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const noteId = searchParams.get("noteId");

        if(!noteId || !Types.ObjectId.isValid(noteId)) {
            return new NextResponse(
                JSON.stringify({
                    message: "Invalid or missing noteId"
                }),
                { status: 400 }
            )
        }

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({
                    message: "Invalid or missing userId"
                }),
                { status: 400 }
            )
        }

        // chech if the user not exists
        const user = await User.findById(userId);
        if(!user) {
            return new NextResponse(
                JSON.stringify({
                    message: "User not found"
                }),
                { status: 404 }
            )
        }

        // Find the note and ensure it belong to the user
        const note = await Note.findOne({_id: noteId, user: userId})
        if(!note) {
            return new NextResponse(
                JSON.stringify({
                    message: "Note not found or does not belong to the user"
                }),
                { status: 404 }
            )
        }

        await Note.findByIdAndDelete(noteId);

        return new NextResponse(
            JSON.stringify({message: "Note is deleted"}), 
            { status: 200 }
        );
    }
    catch (error) {
        return new NextResponse(
            JSON.stringify({
                message: "Error in deleting note", 
                error
            }), 
            { status: 200 }
        );
    }
}