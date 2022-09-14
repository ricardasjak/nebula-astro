import type { Kingdom, KingdomSnapshot, Snapshot } from "../models/kingdom-dto.model";
import { GameUtil } from "./game.util";

type Error = string | undefined;

export const TickUtil = {
	tick: (kd: Kingdom): [Kingdom, Error] => {
		const tick = kd.snapshots.size;
		if (tick === 480) {
			return [kd, undefined];
		}
		const current = GameUtil.getCurrent(kd);
		// console.log("military queue current: ", current.queues.military);
		const next = JSON.parse(JSON.stringify(current)) as typeof current;

		next.land += next.queues.land[0] || 0;
		next.queues.land.splice(0, 1);

		if (typeof next.queues.military === "array") {
			// next.queues.military = {
			// 	dr: [],
			// 	hgl: [],
			// 	ld: [],
			// 	lt: [],
			// 	sci: [],
			// 	soldiers: [],
			// 	tanks: [],
			// 	tf: [],
			// 	tr: [],
			// };
			console.log("*************** FOUND AN ARRAY!!!! ******", next.queues.military);
		}

		// console.log("military queue next: ", next.queues.military);
		next.military.tanks += next.queues.military.tanks[0] || 0;
		next.queues.military.tanks.splice(0, 1);

		next.nw = GameUtil.getNetworth(next);
		next.money += next.land * 120; // temp hack
		kd.snapshots.set(tick, { tick, kdid: kd.id, body: next, created_at: new Date().toUTCString() });

		console.log("tick", { current });
		console.log("tick", { next });

		return [kd, undefined];
	},
};
