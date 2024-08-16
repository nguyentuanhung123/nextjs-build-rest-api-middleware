import { NextResponse } from "next/server"
import connect from "@/lib/db"
import User from "@/lib/models/user";
import { Types } from "mongoose";

const ObjectId = require('mongoose').Types.ObjectId;

export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), {status: 200});
    } catch(error) {
        return new NextResponse("Error in fetching users" + error, {status: 500});
    }
}

export const POST = async (req: Request) => {
    try {
        await connect();

        const body = await req.json();
        const newUser = new User(body)
        await newUser.save();

        return new NextResponse(
            JSON.stringify({
                message: "User is created", 
                user: newUser
            }), 
            {
                status: 200
            }
        );
    } catch(error) {
        return new NextResponse(
            JSON.stringify({
                message: "Error in creating user",
                error
            }), 
            {
                status: 500
            }
        );
    }
}

export const PATCH = async (req: Request) => {
    try {
        await connect();

        const body = await req.json();
        const { userId, newUsername} = body

        if(!userId || !newUsername) {
            return new NextResponse(
                JSON.stringify({
                    message: "ID or new username are required"
                }), 
                {
                    status: 400
                }
            );
        }

        if(!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({
                    message: "Invalid userId"
                }), 
                {
                    status: 400
                }
            );
        }

        /**
         * Không thay đổi email chỉ thay đổi username
         */
        const updatedUser = await User.findByIdAndUpdate(
            // { _id: new Types.ObjectId(userId) },
            { _id: new ObjectId(userId) },
            { username: newUsername },
            { new: true }
        );

        if(!updatedUser) {
            return new NextResponse(
                JSON.stringify({
                    message: "User not found or didn't update user successfully"
                }), 
                {
                    status: 400
                }
            );
        }

        // return a success response
        return new NextResponse(
            JSON.stringify({
                message: "Username updated successfully", 
                user: updatedUser
            }), 
            {
                status: 200
            }
        );
    }
    catch(error) {
        return new NextResponse(
            JSON.stringify({
                message: "Error updating username",
                error
            }), 
            {
                status: 500
            }
        );
    }
}

/**
 * req.url ta gửi : http://localhost:3000/api/users?userId=92357912385
 * req.url = '/api/users?userId=123' (Nếu không có đường dẫn cơ sở)
 * Nên thêm tham số thứ 2 là 1 đường dẫn cơ sở req.url chỉ có như trên, nếu có rồi thì thôi
 */
export const DELETE = async (req: Request) => {
    try {
        await connect();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        // validate the userId
        if(!userId) {
            return new NextResponse(
                JSON.stringify({ message: "UserId is required" }),
                { 
                    status: 400 
                }
            )
        }

        // Validate if userId is valid ObjectId
        if(!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid userId" }),
                { 
                    status: 400 
                }
            )
        }

        // TODO
        const deleteUser = await User.findByIdAndDelete({ _id: new Types.ObjectId(userId) });

        // check if user can't found 
        if(!deleteUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }),
                { 
                    status: 400 
                }
            )
        }

        // return a success response
        return new NextResponse(
            JSON.stringify({ message: "User deleted successfully" }),
            { 
                status: 200 
            }
        );

    }
    catch(error) {
        return new NextResponse(
            JSON.stringify({
                message: "Error deleting user",
                error, // Send a user-friendly error message
            }), 
            {
                status: 500
            }
        );
    }
}