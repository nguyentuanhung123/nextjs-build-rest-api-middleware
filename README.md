This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Các bước chuẩn bị

- B1: Tạo folder api trong folder app và folder users trong folder api vừa tạo
- B2: Tạo file route.ts trong folder api

## Kết nối mongodb
- B1: Tạo file .env trong src
- B2: Tạo folder lib trong src và file db.ts bên trong
- B3: npm i mongoose
- B4: Viết code kết nối mongodb trong db.ts

```ts
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if(connectionState === 1) {
        console.log("Already connected");
    }

    if(connectionState === 2) {
        console.log("Connecting...");
        return;
    }

    try {
        await mongoose.connect(MONGO_URI, {
            dbName: "restapinext14",
            bufferCommands: false
        })
        console.log("Connected");
    } catch (error) {
        console.log("Error in connecting to database: ", error);
        throw new Error("Error connecting to database");
    }
}

export default connect;
```

- B5: Tạo folder models trong folder lib và file notes.ts, user.ts

- B6: Tạo folder (auth) trong folder api và để nó chứa folder users đã tạo trước đó (dùng để cấu trúc cho đẹp)

- B7: Get API

```ts
import { NextResponse } from "next/server"
import connect from "@/lib/db"
import User from "@/lib/models/user";

export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), {status: 200});
    } catch(error) {
        return new NextResponse("Error in fetching users" + error, {status: 500});
    }
}
```

## PUT và PATCH đều là các phương thức HTTP được sử dụng để cập nhật tài nguyên trên server, nhưng chúng có sự khác biệt quan trọng trong cách thức và mục đích sử dụng.

## Phương Thức PUT

1. Mục Đích:

- PUT được sử dụng để cập nhật toàn bộ tài nguyên. Nó thường thay thế tài nguyên hiện có bằng tài nguyên mới hoàn toàn.

2. Hành Động:

- Khi sử dụng PUT, bạn gửi toàn bộ dữ liệu của tài nguyên mà bạn muốn thay thế. Nếu có các thuộc tính không được gửi, chúng có thể bị mất trong tài nguyên được cập nhật.

3. Idempotency:

- PUT là idempotent, nghĩa là việc thực hiện cùng một yêu cầu nhiều lần sẽ có cùng một kết quả.

4. Ví Dụ:

- Nếu bạn có tài nguyên người dùng với các thuộc tính như tên, email, và địa chỉ, gửi một yêu cầu PUT với thông tin mới về người dùng sẽ thay thế hoàn toàn thông tin cũ.

```tsx
PUT /users/123
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "address": "123 Main St"
}
```

## Phương Thức PATCH

1. Mục Đích:

PATCH được sử dụng để cập nhật một phần của tài nguyên. Bạn gửi chỉ các dữ liệu mà bạn muốn thay đổi, không phải toàn bộ tài nguyên.

2. Hành Động:

- Với PATCH, bạn chỉ gửi các thuộc tính mà bạn muốn thay đổi hoặc thêm mới. Các thuộc tính không được đề cập sẽ không bị thay đổi.

3. Idempotency:

- PATCH không nhất thiết phải là idempotent. Tuy nhiên, việc thực hiện cùng một yêu cầu nhiều lần không nên có ảnh hưởng khác biệt.

4. Ví Dụ:

- Nếu bạn chỉ muốn cập nhật địa chỉ của người dùng mà không thay đổi các thuộc tính khác, bạn có thể sử dụng PATCH.

```tsx
PATCH /users/123
Content-Type: application/json

{
  "address": "456 Elm St"
}
```

## So Sánh
- Toàn Bộ vs. Một Phần:
+ PUT cập nhật toàn bộ tài nguyên, còn PATCH chỉ cập nhật phần được chỉ định của tài nguyên.

- Dữ Liệu Cần Gửi:
+ PUT yêu cầu bạn gửi toàn bộ dữ liệu của tài nguyên. PATCH chỉ yêu cầu bạn gửi các dữ liệu cần thay đổi.

- Cách Thực Hiện:
+ PUT có thể làm mất các thuộc tính không được gửi. PATCH chỉ thay đổi các thuộc tính được gửi.

## Khi Nào Sử Dụng
- Sử Dụng PUT:
+ Khi bạn cần cập nhật hoặc thay thế toàn bộ tài nguyên và có đầy đủ dữ liệu để gửi.

- Sử Dụng PATCH:
+ Khi bạn chỉ cần cập nhật một phần cụ thể của tài nguyên và không muốn ảnh hưởng đến các thuộc tính khác.

## Phân Tích Đoạn Mã

```tsx
const { searchParams } = new URL(req.url);
const userId = searchParams.get("userId");
```

1. new URL(req.url):
- Tạo một đối tượng URL mới từ URL của yêu cầu req.url.
- req.url là thuộc tính của đối tượng yêu cầu (request) chứa URL của yêu cầu hiện tại, bao gồm cả đường dẫn và tham số truy vấn.

2. searchParams:
- searchParams là thuộc tính của đối tượng URL và là một đối tượng URLSearchParams. Nó cung cấp phương thức để truy cập các tham số truy vấn của URL.
- Ví dụ: Nếu URL là https://example.com/page?userId=123&name=John, searchParams sẽ chứa các tham số userId và name.

3. searchParams.get("userId"):
- get("userId") là một phương thức của URLSearchParams được sử dụng để lấy giá trị của tham số truy vấn với tên là "userId".
- Ví dụ: Nếu URL là https://example.com/page?userId=123, searchParams.get("userId") sẽ trả về "123".

## Ví Dụ
- Giả sử bạn đang xử lý một yêu cầu HTTP và muốn lấy giá trị của tham số truy vấn userId từ URL:

```js
// Giả sử req.url là 'https://example.com/profile?userId=12345'
const { searchParams } = new URL(req.url, 'https://example.com');
const userId = searchParams.get("userId");

console.log(userId); // In ra '12345'
```

## Khi Nào Sử Dụng
- Truy Xuất Tham Số URL: Khi bạn cần lấy thông tin từ các tham số truy vấn trong URL, chẳng hạn như ID người dùng, bộ lọc tìm kiếm, hoặc các tham số cấu hình khác.
- Xử Lý Yêu Cầu HTTP: Trong các ứng dụng web hoặc API, việc truy xuất các tham số từ URL là phổ biến để thực hiện các hành động dựa trên các tham số đó.

## Lưu Ý
- Xác Thực URL: Đảm bảo rằng req.url chứa URL hợp lệ. Trong một số môi trường, bạn có thể cần cung cấp cả base URL khi tạo đối tượng URL, như trong ví dụ.
- Kiểm Tra Giá Trị Null: Các tham số truy vấn có thể không tồn tại, vì vậy luôn kiểm tra giá trị null hoặc undefined khi lấy tham số từ searchParams.

## Nếu bị lỗi MONGO_URI phải là string trong khi ta đã set ! thì ta có thể thử chuyển file .env ra thư mục root (Tốt nhất là nên để file .env bên trong thư mục gốc)

## Kiểm tra token khi người dùng get Data (Yêu câu ở Postman ở Authorization thì Auth Type: Bearer Token và Token phải có bắt đầu bằng chữ Bearer với dấu cách và tiếp theo là token)

- B1: Tạo folder middlewares - apis trong folder src với file authMiddleware.ts bên trong
- B2: Tạo file middleware.ts bên trong src

## Giải thích đoạn code trong file autheMiddleware.ts

```ts
const token = request.headers.get("authorization")?.split(" ")[1];
```

- Dòng mã này được sử dụng để lấy token từ tiêu đề Authorization trong yêu cầu HTTP. Hãy cùng phân tích chi tiết:

1. request.headers.get("authorization"):
- request.headers là một đối tượng chứa tất cả các tiêu đề HTTP của yêu cầu.
- get("authorization") sẽ trả về giá trị của tiêu đề Authorization.

- Ví dụ, nếu tiêu đề Authorization trông như sau:

```jsx
Authorization: Bearer abcdef12345
```

- thì request.headers.get("authorization") sẽ trả về chuỗi "Bearer abcdef12345".

2. ?.split(" ")[1]:

- ?. là toán tử tùy chọn (optional chaining). Nếu tiêu đề Authorization không tồn tại hoặc là null, mã sẽ không bị lỗi mà chỉ trả về undefined.
- .split(" ") tách chuỗi thành một mảng các phần tử bằng cách sử dụng dấu cách (" ") làm điểm phân cách. Trong trường hợp này:

- "Bearer abcdef12345".split(" ") sẽ trả về mảng ["Bearer", "abcdef12345"].

3.  Giá trị cuối cùng:
- Giá trị cuối cùng của token sẽ là chuỗi "abcdef12345", tức là phần sau từ "Bearer" trong tiêu đề Authorization.
- Nếu tiêu đề Authorization không tồn tại hoặc không hợp lệ, token sẽ là undefined.

## Tóm tắt:
- Lấy token: Dòng mã này lấy token từ tiêu đề Authorization.
- Xử lý lỗi: Nếu không có tiêu đề hoặc tiêu đề không hợp lệ, mã sẽ không gặp lỗi mà trả về undefined.
- Sử dụng token: Sau khi có được token, bạn có thể sử dụng nó để xác thực người dùng, gửi yêu cầu API khác, hoặc thực hiện bất kỳ thao tác nào khác cần thiết.


## Cải thiện hàm kiểm tra token
- Dưới đây là một phiên bản cải thiện của hàm validateToken để kiểm tra tính hợp lệ của token:

```ts
const validateToken = (token: string | null | undefined): boolean => {
    // Kiểm tra xem token có tồn tại và không phải là chuỗi rỗng
    return !!token && token.trim() !== "";
}
```

## Giải thích:
- Kiểm tra token có tồn tại và không phải là chuỗi rỗng:
- !!token: Chuyển đổi token thành giá trị boolean. Nếu token là null, undefined, hoặc một chuỗi rỗng, !!token sẽ là false.
token.trim() !== "": Đảm bảo token không chỉ chứa các ký tự khoảng trắng.

- Trả về boolean:
- Nếu token hợp lệ (không phải là null, không phải là chuỗi rỗng hoặc chỉ chứa khoảng trắng), hàm trả về true. Ngược lại, trả về false.

## Toán tử && (và) và || (hoặc) là hai toán tử logic cơ bản trong JavaScript và TypeScript, và chúng thường được sử dụng trong các điều kiện và biểu thức logic. Dưới đây là giải thích chi tiết về cách chúng hoạt động:

## Toán tử && (AND)
- Cú pháp: condition1 && condition2
- Kết quả: Trả về giá trị của condition2 nếu condition1 là true. Nếu condition1 là false, toán tử && không đánh giá condition2 (ngắn mạch), và trả về false.

```js
const a = true;
const b = false;

console.log(a && b); // false
console.log(a && true); // true
console.log(false && b); // false
```

- Giải thích:
+ true && false trả về false vì a là true nhưng b là false.
+ true && true trả về true vì cả hai điều kiện đều là true.
+ false && b trả về false ngay cả khi b có giá trị gì đó, vì false khiến toàn bộ biểu thức là false.

## Toán tử || (OR)
- Cú pháp: condition1 || condition2
- Kết quả: Trả về giá trị của condition1 nếu condition1 là true. Nếu condition1 là false, toán tử || sẽ đánh giá và trả về giá trị của condition2.

```js
const a = true;
const b = false;

console.log(a || b); // true
console.log(false || true); // true
console.log(b || b); // false
```

- Giải thích:
+ true || false trả về true vì a là true.
+ false || true trả về true vì b là true mặc dù a là false.
+ false || false trả về false vì cả hai điều kiện đều là false.

## Kết hợp && và ||
- Toán tử && và || có thể được kết hợp trong cùng một biểu thức. Để hiểu rõ hơn, hãy xem xét các ví dụ sau:

```js
const a = true;
const b = false;
const c = true;

console.log(a && (b || c)); // true
console.log((a && b) || c); // true
console.log((false && false) || true); // true
console.log(a && (b || false)); // false
```

## Set-up enviroment trong POSTMAN để tự động kế thừa và gửi token