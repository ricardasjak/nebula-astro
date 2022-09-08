import type { AstroGlobal } from "astro";
import { ROUTES } from "../utils/routes.const";

export const errorHandler = (Astro: AstroGlobal, message: string, error?: Error) => {
	const response = Astro.redirect(ROUTES.error);
	console.error(message);
	error && console.error(error);

	// todo: pass error message and error object to the Error page
	return response;
};
