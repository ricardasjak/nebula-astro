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
		//console.log("login", { signInWithPasswordResponse });
		const token = signInWithPasswordResponse.data?.session?.access_token;

		const response = Astro.redirect(ROUTES.account);
		response.headers.append("Set-Cookie", `${ENV.AUTH_COOKIE_TOKEN}=${token}`);
		return response;
	} catch (e) {
		console.error(e);
	}
	return null;
};
