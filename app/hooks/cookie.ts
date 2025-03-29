import Cookies from "js-cookie";

interface CookieOptions {
  expires?: number | Date | "never";
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  if (options.expires === "never") {
    delete options.expires;
  }
  Cookies.set(name, value, options as Cookies.CookieAttributes);
  return value;
}

function getCookie(name: string, request?: Request): string | null {
  if (request) {
    const cookieHeader = request.headers.get("Cookie");
    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split("; ").map((cookie) => cookie.split("="))
      );
      return cookies[name] || null;
    }
    return null;
  }
  return Cookies.get(name) || null;
}

function deleteCookie(name: string, options: CookieOptions = {}): void {
  Cookies.remove(name, options as Cookies.CookieAttributes);
}

function modifyCookie(
  name: string,
  newValue: string,
  options: CookieOptions = {}
): void {
  if (Cookies.get(name) !== undefined) {
    if (options.expires === "never") {
      delete options.expires;
    }
    Cookies.set(name, newValue, options as Cookies.CookieAttributes);
  }
}

export { setCookie, getCookie, deleteCookie, modifyCookie };
