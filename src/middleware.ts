import createMiddleware from "next-intl/middleware";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "id"];
const publicPages = ["/login"];

const intlMiddleware = (request: NextRequest, result?: any) => {
  const url = new URL(request.url);
  const origin = url.origin;
  const pathname = url.pathname;

  const handleI18nRouting = createMiddleware({
    locales: ["en", "id"],
    localePrefix: "as-needed",
    defaultLocale: "en",
    alternateLinks: false,
  });
  const response = handleI18nRouting(request);

  response.headers.set("x-url", request.url);
  response.headers.set("x-origin", origin);
  response.headers.set("x-pathname", pathname);

  if (result) {
    response.headers.set("x-userdata", JSON.stringify(result.user));
  }

  return response;
};

const authMiddleware = async (request: NextRequest) => {
  const cookieStore = cookies();
  const lang = cookieStore.get("NEXT_LOCALE");
  const jwt = cookieStore.get("jwt");
  return await fetch(`${process.env.SERVER_API_URL}auth/me`, {
    method: "get",
    headers: {
      "x-app-locale": lang ? lang.value : "id",
      "x-token": jwt ? jwt.value : "",
    },
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res.status) {
        if (res.code === 401) {
          const url = new URL(`/login`, request.url);
          return NextResponse.redirect(url);
        } else {
          throw new Error(res.message, { cause: res });
        }
      } else {
        return intlMiddleware(request, res.data);
      }
    })
    .catch((err: Error) => {
      console.error(err);
      return NextResponse.json({
        error: "Backend error. Please check system log.",
        cause: err,
      });
    });
};

export default async function middleware(request: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(request.nextUrl.pathname);
  if (isPublicPage) {
    const cookieStore = cookies();
    const jwt = cookieStore.get("jwt");
    if (jwt && request.nextUrl.pathname === "/login") {
      const url = new URL(`/`, request.url);
      return NextResponse.redirect(url);
    } else {
      return intlMiddleware(request);
    }
  } else {
    return (authMiddleware as any)(request);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images/|favicon.ico).*)"],
};
