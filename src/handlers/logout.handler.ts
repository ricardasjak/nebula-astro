import type { AstroGlobal } from "astro";
import { ENV } from "../utils/env.util";
import { ROUTES } from "../utils/routes.const";
import { errorHandler } from "./error.handler";

export const logoutHandler = async (Astro: AstroGlobal): Promise<Response | null> => {
	try {
		const response = Astro.redirect(ROUTES.home);

		// todo: clear cookie properly, this doesn't work as it
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
		response.headers.append(
			"Set-Cookie",
			`${ENV.AUTH_COOKIE_TOKEN}=''; Expires=${new Date("2022-01-01").toUTCString()}; Max-Age=0`
		);
		return response;
	} catch (e) {
		return errorHandler(Astro, "Failed to logout");
	}
};
