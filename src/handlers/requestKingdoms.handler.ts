import { COLLECTIONS } from "../models/collections.const";
import { supabase } from "../supabaseClient";

export const requestKingdoms = async (accountId: number): Promise<any[]> => {
	const dbResponse = await supabase.from(COLLECTIONS.kingdoms).select("*").eq("accountId", accountId);
	console.log("requestKingdom", { dbResponse });
	return dbResponse.data || [];
};
