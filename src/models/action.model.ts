import type { UnitType } from "./kingdom-dto.model";

export type ActionType = "skip" | "explore" | UnitType;

export const ACTION_TITLE: Record<ActionType, (amount: number) => string> = {
	explore: (amount: number) => `Explore ${amount} land`,
	tanks: (amount: number) => `Buy ${amount} Tanks`,
	tr: (amount: number) => `Buy ${amount} Troopers`,
	lt: (amount: number) => `Buy ${amount} Laser Troopers`,
	dr: (amount: number) => `Buy ${amount} Dragoons`,
	ld: (amount: number) => `Buy ${amount} Laser Dragoons`,
	tf: (amount: number) => `Buy ${amount} Tactical Fighters`,
	hgl: (amount: number) => `Buy ${amount} High Guard Lancers`,
	sci: (amount: number) => `Educate ${amount} scientists`,
	soldiers: (amount: number) => `Train ${amount} soldiers`,
	skip: (amount: number) => "Advance without action",
};

export type Action = {
	type: ActionType;
	amount: number;
};
