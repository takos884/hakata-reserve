import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "zh-CN", "zh-TW", "ko", "th"];
const defaultLocale = "en";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip admin, api, and static paths
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if locale is already in path
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocale) {
    return NextResponse.next();
  }

  // Detect locale from Accept-Language header
  const acceptLang = request.headers.get("accept-language") || "";
  let detectedLocale = defaultLocale;

  for (const locale of locales) {
    if (acceptLang.includes(locale.toLowerCase())) {
      detectedLocale = locale;
      break;
    }
  }

  // Check simpler codes
  if (detectedLocale === defaultLocale) {
    if (acceptLang.includes("zh")) detectedLocale = "zh-CN";
    else if (acceptLang.includes("ko")) detectedLocale = "ko";
    else if (acceptLang.includes("th")) detectedLocale = "th";
  }

  // Redirect to localized path
  return NextResponse.redirect(
    new URL(`/${detectedLocale}${pathname}`, request.url)
  );
}

export const config = {
  matcher: ["/((?!_next|api|admin|favicon.ico).*)"],
};
