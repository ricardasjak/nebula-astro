import { COLLECTIONS } from "../models/collections.const";
import type { KingdomEntityWithSnapshots } from "../models/kingdom-dto.model";
import { supabase } from "../supabaseClient";

export const requestKingdoms = async (accountId: number): Promise<KingdomEntityWithSnapshots> => {
	const dbResponse = await supabase
		.from(COLLECTIONS.kingdoms)
		.select("*, snapshots(*)")
		.eq("accountId", accountId)
		.single();
	console.log("requestKingdom", { dbResponse });
	return dbResponse.data as KingdomEntityWithSnapshots;
};
