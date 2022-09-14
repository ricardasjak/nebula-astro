import type { Kingdom } from "../models/kingdom-dto.model";
import { GAME_VARS } from "./game.cost";
import { GameUtil } from "./game.util";

type Error = string | undefined;

export const ExploreUtil = {
	getExploreCost: (kd: Kingdom): number => {
		const current = GameUtil.getCurrent(kd);
		return Math.round(Math.pow(current.land, 0.5) * GAME_VARS.exploreCost);
	},
	explore: (kd: Kingdom, amount: number): [Kingdom, Error] => {
		const current = GameUtil.getCurrent(kd);
		const cost = ExploreUtil.getExploreCost(kd) * amount;
		if (cost > current.money) {
			return [kd, `Insufficient money to explore ${amount} land`];
		}
		current.money -= cost;
		current.queues.land = GameUtil.getProductionQueue(current.queues.land, amount, GAME_VARS.exploreDuration);

		return [kd, undefined];
	},
};
