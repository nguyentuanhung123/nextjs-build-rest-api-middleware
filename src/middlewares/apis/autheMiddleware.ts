const validateToken = (token: string | null | undefined): boolean => {
    // Kiểm tra xem token có tồn tại và không phải là chuỗi rỗng
    return !!token && token.trim() !== "";
}

export function authMiddleware(request: Request): any {
    const token = request.headers.get("authorization")?.split(" ")[1];

    return { isValid: validateToken(token) };
}