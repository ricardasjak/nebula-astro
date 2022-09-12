import type { Kingdom, Military, Snapshot } from "../models/kingdom-dto.model";

export const GameUtil = {
	getCurrent: (kingdom: Kingdom) => {
		let result = kingdom.snapshots.get(kingdom.snapshots.size - 1);
		if (!result) {
			console.warn("Kingdom snapshot not found. Fallback to an array last element");
			const allSnapshots = [...kingdom.snapshots.values()];
			result = allSnapshots[allSnapshots.length - 1];
		}
		if (!result) {
			console.warn("Kingdom snapshot not found");
		}
		return result!.body;
	},
	getNetworth: (kingdom: Kingdom): number => {
		const current = GameUtil.getCurrent(kingdom);
		const NW_TABLE = {
			land: 50,
			money: 1 / 500,
		};
		const NW_TABLE_MILITARY: Record<keyof Military, number> = {
			dr: 7,
			hgl: 15,
			ld: 8,
			lt: 7,
			sci: 8,
			soldiers: 3,
			tanks: 22,
			tf: 18,
			tr: 6,
		};

		let result = NW_TABLE.land * current.land + NW_TABLE.money * current.money;

		const m = current.military;
		result +=
			NW_TABLE_MILITARY.dr * m.dr +
			NW_TABLE_MILITARY.hgl * m.hgl +
			NW_TABLE_MILITARY.ld * m.ld +
			NW_TABLE_MILITARY.lt * m.lt +
			NW_TABLE_MILITARY.sci * m.sci +
			NW_TABLE_MILITARY.soldiers * m.soldiers +
			NW_TABLE_MILITARY.tanks * m.tanks +
			NW_TABLE_MILITARY.tf * m.tf +
			NW_TABLE_MILITARY.tr * m.tr;

		return result;
	},
};
