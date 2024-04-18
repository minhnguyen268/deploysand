import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request) {
    if (request.nextUrl.pathname.startsWith("/admin")) {
      const role = request?.nextauth?.token?.role ?? "user";
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (!token) {
          return false;
        }
        return true;
      },
    },
  }
);
export const config = {
  matcher: [
    "/admin/:path*",
    "/games/:path*",
    "/deposit/:path*",
    "/profile/:path*",
    "/balance-fluctuations/:path*",
    "/list-bank/:path*",
    "/notifications/:path*",
    "/contact/:path*",
    "/sign-out",
  ],
};
