import type { Kingdom, UnitType, Error } from "../models/kingdom-dto.model";
import { GAME_VARS } from "./game.cost";
import { GameUtil } from "./game.util";

const MILITARY_COST: Record<UnitType, number> = {
	dr: 450,
	hgl: 900,
	ld: 550,
	lt: 450,
	tr: 350,
	sci: 1000,
	soldiers: 150,
	tanks: 1750,
	tf: 1600,
};

export const MilitaryUtil = {
	unitCost: (kd: Kingdom, unit: UnitType): number => {
		const current = GameUtil.getCurrent(kd);
		const tcRatio = Math.min(current.buildings.trainingCamps / current.land, 0.1);
		const discount = 0.3 * (tcRatio / 0.1);

		return Math.round(MILITARY_COST[unit] * (1 - discount));
	},
	buy: (kd: Kingdom, unit: UnitType, amount: number): Error => {
		const current = GameUtil.getCurrent(kd);
		const cost = amount * MilitaryUtil.unitCost(kd, unit);
		if (cost > current.money) {
			return `Insufficient money to buy ${amount} units.`;
		}
		current.money -= cost;
		console.log("***************** typeof", typeof current.queues.military);
		current.queues.military[unit] = GameUtil.getProductionQueue(
			current.queues.military[unit],
			amount,
			GAME_VARS.militaryDuration
		);
		return undefined;
	},
};
