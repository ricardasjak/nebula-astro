import type { AstroGlobal } from "astro";
import type { Account } from "../models/account.model";
import { COLLECTIONS } from "../models/collections.const";
import type { Profile } from "../models/profile.model";
import { supabase } from "../supabaseClient";
import { loginHandler } from "./login.handler";

export const createAccountHandler = async (
	Astro: AstroGlobal,
	email: string,
	password: string,
	nickname: string
): Promise<Response | null> => {
	// if (!email || !password || !nickname) {
	// 	const errorResponse =  Astro.response;
	// 	errorResponse.status = 400;
	// 	return new Promise(r => r(errorResponse));
	// }
	try {
		// const profileInsert = await supabase.from(COLLECTIONS.profile).insert<Partial<Profile>>({ username: email });
		// if (profileInsert.error) {
		// 	console.log("profile error", profileInsert.error);
		// 	return null;
		// }

		/*
			create in-game Account
		 */
		const dbResponse = await supabase
			.from(COLLECTIONS.accounts)
			.insert<Partial<Account>>({
				email,
				//id: data.session?.user.id,
				nickname,
			})
			.select()
			.single();

		console.log("insert account", { dbResponse });
		if (dbResponse.error) {
			return null;
		}

		/*
			create auth Account, attach in-game account id
		 */
		const signupResponse = await supabase.auth.signUp({
			email,
			password,
			options: { data: { nickname, accountId: (dbResponse.data as unknown as Account).id } },
		});
		console.log("signup", { signupResponse });

		return loginHandler(Astro, email, password);
	} catch (e) {
		console.error(e);
	}
	return null;
};
