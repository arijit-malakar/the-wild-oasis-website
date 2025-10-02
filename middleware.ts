// Basic usage of middleware for sending a response
// import { NextResponse } from "next/server";
// export const middleware = (request: Request) => {
//   console.log(request);
//   return NextResponse.redirect(new URL("/about", request.url));
// };

import { auth } from "@/app/_lib/auth";

export const middleware = auth;

// Route that we want to protect / enable authorization
export const config = {
  matcher: ["/account"],
};
