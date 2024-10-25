import createMiddleware from "next-intl/middleware";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Authenticated, JsonResponse } from "./types/common.types";
import { routing } from "./i18n/routing";

const locales = ["en", "id"];
const publicPages = ["/login"];

const intlMiddleware = (
  request: NextRequest,
  result?: JsonResponse<Authenticated>
) => {
  const url = new URL(request.url);
  const origin = url.origin;
  const pathname = url.pathname;

  const handleI18nRouting = createMiddleware(routing, {
    alternateLinks: false,
    localeDetection: false,
  });
  const response = handleI18nRouting(request);

  response.headers.set("x-url", request.url);
  response.headers.set("x-origin", origin);
  response.headers.set("x-pathname", pathname);

  if (result) {
    const userInfo: Authenticated = {
      user: result.data.user,
      privileges: result.data.privileges,
      subscriptions: result.data.subscriptions,
      company: result.data.company,
      outlet: result.data.outlet,
      token_expired_at: result.data.token_expired_at,
      geolocation: {
        ...result.data.geolocation,
        country_emoji: encodeURIComponent(
          result.data.geolocation.country_emoji
        ),
      },
    };

    response.headers.set("x-userdata", JSON.stringify(userInfo));
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
    .then((res: JsonResponse<Authenticated>) => {
      if (!res.status) {
        if (res.code === 401) {
          const url = new URL(`/login`, request.url);
          return NextResponse.redirect(url);
        } else {
          throw new Error(res.message, { cause: res });
        }
      } else {
        if (!res.data.user.company_id && !request.url.includes("onboarding")) {
          return NextResponse.redirect(new URL("/onboarding", request.url));
        }

        return intlMiddleware(request, res);
      }
    })
    .catch((err: Error) => {
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
    if (jwt) {
      const url = new URL(`/dashboard`, request.url);
      return NextResponse.redirect(url);
    } else {
      return intlMiddleware(request);
    }
  } else {
    return (authMiddleware as any)(request);
  }
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
