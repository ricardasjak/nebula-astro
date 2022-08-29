type UnitType = 'SOL' |  'T' | 'LD'; // | 'DR' | 'LT' | 'TR';

type MilitaryType = {
    title: string;
    offense: number;
    defense: number;
    cost: number;
}

const MILITARY_TYPES: Record<UnitType, MilitaryType> = {
    SOL: {
        title: 'Soldier',
        cost: 150,
        defense: 1,
        offense: 1,
    },
    LD: {
        title: 'Laser Dragoon',
        cost: 550,
        defense: 5,
        offense: 0,
    },
    T: {
        title: 'Tank',
        cost: 1750,
        defense: 9,
        offense: 9,
    },
}


export async function get() {
    return {
        body: JSON.stringify(MILITARY_TYPES),
    }
}