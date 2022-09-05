export type PlanetType = "FW" | "Mount";
export type RaceType = "Xivornai" | "Gistrami";
export type KingdomState = "Mobilization" | "Growth";

export type Kingdom = {
	userId: string;
	id: number;
	created_at?: unknown;
	nickname: string;
	name: string;
	ruler: string;
	sector: number;
	galaxy: number;
	planetType: PlanetType;
	raceType: RaceType;
	state: KingdomState;
};

export type Buildings = {
	residences: number;
	starMines: number;
	barracks: number;
	powerPlants: number;
	trainingCamps: number;
};

export type Military = {
	soldiers: number;
	lt: number;
	tr: number;
	dr: number;
	ld: number;
	tanks: number;
	hgl: number;
	tf: number;
	sci: number;
};

export type ResearchType = {
	points: number;
	scientists: number;
	percentage: number;
};

export type Research = {
	pop: ResearchType;
	power: ResearchType;
	military: ResearchType;
	money: ResearchType;
};

export type KingdomSnapshot = {
	tick: number;
	kdid: number;
	body: {
		nw: number;
		land: number;
		money: number;
		buildings: Buildings;
		military: Military;
		research: Research;
		queues: {
			buildings: Buildings[];
			military: Military[];
			land: number[];
		};
	};
};
