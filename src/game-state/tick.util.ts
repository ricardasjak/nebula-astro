import type { Kingdom, KingdomSnapshot, Snapshot, UnitType } from "../models/kingdom-dto.model";
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

		// console.log("military queue next: ", next.queues.military);
		// next.military.tanks += next.queues.military.tanks[0] || 0;
		// next.queues.military.tanks.splice(0, 1);

		(Object.keys(next.queues.military) as UnitType[]).forEach((unit) => {
			if (next.queues.military[unit][0]) {
				next.military[unit] += next.queues.military[unit][0];
				next.queues.military[unit].splice(0, 1);
			}
		});

		next.nw = GameUtil.getNetworth(next);
		next.money += 100000; //next.land * 100; // temp hack
		kd.snapshots.set(tick, { tick, kdid: kd.id, body: next, created_at: new Date().toUTCString() });

		console.log("tick", { current });
		console.log("tick", { next });

		return [kd, undefined];
	},
};
