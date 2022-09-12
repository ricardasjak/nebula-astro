import type { AstroGlobal } from "astro";
import { supabase } from "../supabaseClient";
import { ENV } from "../utils/env.util";
import { ROUTES } from "../utils/routes.const";

export const loginHandler = async (Astro: AstroGlobal, email: string, password: string): Promise<Response | null> => {
	try {
		const signInWithPasswordResponse = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		const token = signInWithPasswordResponse.data?.session?.access_token;

		const response = Astro.redirect(ROUTES.status);

		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
		response.headers.append("Set-Cookie", `${ENV.AUTH_COOKIE_TOKEN}=${token}; Path=/; Secure; Max-Age=3600`);
		return response;
	} catch (e) {
		console.error(e);
	}
	return null;
};
