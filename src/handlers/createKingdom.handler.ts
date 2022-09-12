import type { AstroGlobal } from "astro";
import { GameEngine } from "../game-state/game.state";
import { COLLECTIONS } from "../models/collections.const";
import type { KingdomEntity, KingdomBase, KingdomSnapshot } from "../models/kingdom-dto.model";
import { supabase } from "../supabaseClient";

export const createKingdomHandler = async (
	Astro: AstroGlobal,
	accountId: number,
	name: string,
	ruler: string,
	nickname: string
): Promise<Response | null> => {
	// if (!email || !password || !nickname) {
	// 	const errorResponse =  Astro.response;
	// 	errorResponse.status = 400;
	// 	return new Promise(r => r(errorResponse));
	// }

	const kingdom: KingdomBase = {
		accountId,
		name,
		ruler,
		galaxy: 1,
		nickname,
		planet: "FW",
		race: "Xivornai",
		sector: 1,
	};

	const kingdomSnapshot: KingdomSnapshot = {
		tick: 0,
		kdid: 0,
		body: {
			state: "Growth",
			x: 0,
			y: 0,
			buildings: {
				barracks: 10,
				powerPlants: 40,
				residences: 80,
				starMines: 30,
				trainingCamps: 0,
			},
			land: 250,
			military: {
				dr: 0,
				hgl: 0,
				ld: 0,
				lt: 0,
				sci: 100,
				soldiers: 200,
				tanks: 0,
				tf: 0,
				tr: 0,
			},
			money: 300_000,
			nw: 16200,
			queues: {
				buildings: [],
				land: [],
				military: [],
			},
			research: {
				pop: {
					percentage: 0,
					points: 0,
					scientists: 0,
				},
				power: {
					percentage: 0,
					points: 0,
					scientists: 0,
				},
				military: {
					percentage: 0,
					points: 0,
					scientists: 0,
				},
				money: {
					percentage: 0,
					points: 0,
					scientists: 0,
				},
			},
		},
	};

	try {
		let dbResponse = await supabase.from(COLLECTIONS.kingdoms).insert(kingdom).select().single();
		console.log("insert kingdom", { dbResponse });
		kingdomSnapshot.kdid = (dbResponse.data as KingdomEntity).id;
		dbResponse = await supabase.from(COLLECTIONS.kingdomSnapshots).insert(kingdomSnapshot);
		console.log("insert snapshot", { dbResponse });
		await GameEngine.reload();
	} catch (e) {
		throw e;
	}
	return null;
};
