import { COLLECTIONS } from "../models/collections.const";
import type { KingdomEntityWithSnapshots } from "../models/kingdom-dto.model";
import { supabase } from "../supabaseClient";

interface GameState {
	kingdoms: KingdomEntityWithSnapshots[];
	tick: number;
}

let game: GameState;

export const tickHandler = async () => {
	if (!game) {
		const dbResponse = await supabase.from(COLLECTIONS.kingdoms).select("*, snapshots(*)");
		console.log("kingdoms loaded", { dbResponse });
		game = {
			kingdoms: dbResponse.data as KingdomEntityWithSnapshots[],
			tick: 0,
		};
	} else {
		console.log("game state is already loaded");
	}
};
