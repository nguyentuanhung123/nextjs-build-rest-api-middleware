import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/apis/autheMiddleware";
import { loggingMiddleware } from "./middlewares/apis/loggingMiddleware";

export const config = { 
    // Trong trường hợp này, middleware sẽ được áp dụng cho tất cả các đường dẫn bắt đầu bằng /api/ và bao gồm bất kỳ đường dẫn con nào (:path*).
    matcher: "/api/:path*",
}

export default function middleware(request: Request) {
    // console.log("Method:", request.method); // GET
    // console.log("URL:", request.url); // http://localhost:3000/api/users
    // console.log("Headers:", [...request.headers.entries()]); // Chuyển đổi Headers thành mảng các cặp key-value

    if(request.url.includes("/api/notes")) {
        const logResult = loggingMiddleware(request);
        console.log("Requset: ", logResult.response);
    }

    const authResult = authMiddleware(request);
    
    if(!authResult.isValid) {
        return new NextResponse(
            JSON.stringify({ message: "Unauthorized" }),
            { status: 401 }
        )
    }

    return NextResponse.next();
}