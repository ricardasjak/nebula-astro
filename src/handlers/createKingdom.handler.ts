import type { AstroGlobal } from "astro";
import type { Kingdom, KingdomSnapshot } from "../models/kingdom.model";
import { supabase } from "../supabaseClient";
import { loginHandler } from "./login.handler";

export const createKingdomHandler = async (
	Astro: AstroGlobal,
	userId: string,
	name: string,
	ruler: string
): Promise<Response | null> => {
	// if (!email || !password || !nickname) {
	// 	const errorResponse =  Astro.response;
	// 	errorResponse.status = 400;
	// 	return new Promise(r => r(errorResponse));
	// }

	const kingdom: Kingdom = {
		userId,
		name,
                
		ruler,
		galaxy: 1,
		id: 1,
		nickname: "",
		planetType: "FW",
		raceType: "Xivornai",
		sector: 1,
		state: "Growth",
	};

	const kingdomSnapshot: KingdomSnapshot = {
        tick: 0,
		kdid: 1,
		body: {
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
		const resp = await supabase.from("kingdoms").insert(kingdom);
		const resp2 = await supabase.from("kingdomSnapshots").insert(kingdomSnapshot);
	} catch (e) {
		console.error(e);
	}
	return null;
};
