export type ActionType = "explore" | "tanks";

export const ACTION_TITLE: Record<ActionType, (amount: number) => string> = {
	explore: (amount: number) => `Explore ${amount} land`,
	tanks: (amount: number) => `Manifacture ${amount} tanks`,
};

export type Action = {
	type: ActionType;
	amount: number;
};
