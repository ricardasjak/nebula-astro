export type ActionType = "skip" | "explore" | "tanks" | "soldiers";

export const ACTION_TITLE: Record<ActionType, (amount: number) => string> = {
	explore: (amount: number) => `Explore ${amount} land`,
	tanks: (amount: number) => `Buy ${amount} tanks`,
	soldiers: (amount: number) => `Train ${amount} soldiers`,
	skip: (amount: number) => "Advance without action",
};

export type Action = {
	type: ActionType;
	amount: number;
};
