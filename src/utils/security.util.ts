import type { AstroGlobal } from "astro";
import { ENV } from "./env.util";
import jwt from 'jsonwebtoken';

const parseCookie = (cookieHeader: string) => {
    const list: Record<string, string> = {};
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(cookie => {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim() || '';
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });

    return list;
}

// {
//     "aud": "authenticated",
//     "exp": 1661988371,
//     "sub": "a031d234-0ede-40b9-adbb-8159dc3400d4",
//     "email": "ricardas.jaksebaga@gmail.com",
//     "phone": "",
//     "app_metadata": {
//       "provider": "email",
//       "providers": [
//         "email"
//       ]
//     },
//     "user_metadata": {},
//     "role": "authenticated"
//   }

type Session = {
    exp: number;
    email: string;
    user_metadata: object;
    role: 'authenticated';
}

export const SecurityUtil = {
  getSession: (request: Request): Session | undefined => {
    const cookieHeader = request.headers.get("cookie") || "";
    const token = parseCookie(cookieHeader)[ENV.AUTH_COOKIE_TOKEN];

    try {
      const session = jwt.verify(token, ENV.JWT_SECRET);
      return session as Session;
    } catch (err) {
      console.log("invalid token");
    }
    return undefined;
  },
  isLoggedIn: (request: Request) => !!SecurityUtil.getSession(request),
};
