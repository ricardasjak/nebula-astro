import { ENV } from "./env.util";
import jwt from "jsonwebtoken";
import type { AstroGlobal } from "astro";
import { ROUTES } from "./routes.const";

const parseCookie = (cookieHeader: string) => {
	const list: Record<string, string> = {};
	if (!cookieHeader) return list;

	cookieHeader.split(`;`).forEach((cookie) => {
		let [name, ...rest] = cookie.split(`=`);
		name = name?.trim() || "";
		if (!name) return;
		const value = rest.join(`=`).trim();
		if (!value) return;
		list[name] = decodeURIComponent(value);
	});

	return list;
};

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
	user_metadata: {
		nickname: string;
		role: "Player" | "Admin";
		accountId: number;
	};
	sub: string;
	role: "authenticated";
};

type User = {
	email: string;
	nickname: string;
	accountId: number;
	role: "Player" | "Admin";
};

export const SecurityUtil = {
	getUser: (request: Request): User | undefined => {
		const cookieHeader = request.headers.get("cookie") || "";
		const token = parseCookie(cookieHeader)[ENV.AUTH_COOKIE_TOKEN];

		try {
			const { email, user_metadata, sub } = jwt.verify(token, ENV.JWT_SECRET) as Session;
			return { email, ...user_metadata };
		} catch (err) {
			console.log("invalid token");
		}
		return undefined;
	},
	isLoggedIn: (request: Request) => !!SecurityUtil.getUser(request),
	authGuard: (Astro: AstroGlobal) => {
		if (!SecurityUtil.isLoggedIn(Astro.request)) {
			return Astro.redirect(ROUTES.login);
		}
		// return Astro.request;
	},
};
