import type { AstroGlobal } from "astro";
import { COLLECTIONS } from "../models/collections.const";
import type { Kingdom, KingdomEntityWithSnapshots } from "../models/kingdom-dto.model";
import { supabase } from "../supabaseClient";
import { ROUTES } from "../utils/routes.const";

type AcountID = number;

interface GameState {
	kingdoms: Map<AcountID, Kingdom>;
	tick: number;
}

let game: GameState = {
	kingdoms: new Map(),
	tick: 0,
};

export const loadGameHandler = async (): Promise<GameState> => {
	if (!game || game.kingdoms.size === 0) {
		try {
			const dbResponse = await supabase.from(COLLECTIONS.kingdoms).select("*, snapshots(*)");
			console.log("Game is loaded", { success: dbResponse.data, error: dbResponse.error });
			game = {
				kingdoms: ((dbResponse.data || []) as KingdomEntityWithSnapshots[]).reduce(
					(result, { snapshots, ...kd }) => {
						const snapshotsMap = snapshots.reduce((result2, snap) => {
							result2.set(snap.tick, snap);
							return result2;
						}, new Map());
						result.set(kd.accountId, { ...kd, snapshots: snapshotsMap });

						return result;
					},
					new Map()
				),
				tick: 0,
			};
		} catch (ex) {
			console.error("Failed to load Game data", ex);
			return {
				tick: 0,
				kingdoms: new Map(),
			};
		}
	} else {
		// console.log("Game state is already loaded");
	}
	console.log(game);
	return game;
};
