import type { Kingdom, KingdomSnapshot, Snapshot } from "../models/kingdom-dto.model";
import { GameUtil } from "./game.util";

type Error = string | undefined;

export const TickUtil = {
	tick: (kd: Kingdom): [Kingdom, Error] => {
		const tick = kd.snapshots.size;
		const current = GameUtil.getCurrent(kd);
		const next = JSON.parse(JSON.stringify(current)) as typeof current;

		next.land += next.queues.land[0] || 0;
		next.queues.land.splice(0, 1);

		next.nw = GameUtil.getNetworth(next);
		next.money += next.land * 120; // temp hack
		kd.snapshots.set(tick, { tick, kdid: kd.id, body: next, created_at: new Date().toUTCString() });

		console.log({ current });
		console.log({ next });

		return [kd, undefined];
	},
};
