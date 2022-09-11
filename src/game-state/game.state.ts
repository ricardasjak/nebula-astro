import { COLLECTIONS } from "../models/collections.const";
import type { Kingdom, KingdomEntityWithSnapshots, KingdomSnapshot } from "../models/kingdom-dto.model";
import { supabase } from "../supabaseClient";

type AcountID = number;

interface GameState {
	kingdoms: Map<AcountID, Kingdom>;
	tick: number;
}

class Game {
	private kingdoms: Map<AcountID, Kingdom>;
	private tick: number;
	/**
	 * await if db is being updated
	 */
	suspend: Promise<void>;

	constructor() {
		this.kingdoms = new Map();
		this.tick = 3;
		this.suspend = Promise.resolve();
	}

	async load(): Promise<GameState> {
		await this.suspend;

		if (this.kingdoms.size === 0) {
			try {
				const dbResponse = await supabase.from(COLLECTIONS.kingdoms).select("*, snapshots(*)");
				console.log("Game is loaded", { count: dbResponse.data?.length, error: dbResponse.error });

				this.kingdoms = ((dbResponse.data || []) as KingdomEntityWithSnapshots[]).reduce(
					(result, { snapshots, ...kd }) => {
						const snapshotsMap = snapshots.reduce((result2, snap) => {
							result2.set(snap.tick, snap);
							return result2;
						}, new Map());
						result.set(kd.accountId, { ...kd, snapshots: snapshotsMap });

						return result;
					},
					new Map()
				);
				this.tick = 0;
			} catch (ex) {
				console.error("Failed to load Game data", ex);
				this.tick = 0;
				this.kingdoms = new Map();
			}
		} else {
			// console.log("Game state is already loaded");
		}
		return {
			kingdoms: this.kingdoms,
			tick: this.tick,
		};
	}

	async save(): Promise<void> {
		// this.suspend = new Promise((resolve) => {
		// 	// setTimeout(() => {
		// 	// 	resolve();
		// 	// }, 6000);
		// });

		const snapshots: KingdomSnapshot[] = [];
		this.kingdoms.forEach((kd, accountId) => {
			const snap = kd.snapshots.get(this.tick);
			if (snap) {
				snapshots.push(snap);
				const newSnap = JSON.parse(JSON.stringify(snap));
				newSnap.body.land += 1;
				newSnap.tick += 1;
				snapshots.push(newSnap);
			}
		});
		console.log("update: ", snapshots.length);

		await supabase.from(COLLECTIONS.kingdomSnapshots).upsert(snapshots);
		this.tick += 1;
		this.suspend = Promise.resolve();
		// return new Promise((resolve) => {
		// 	setTimeout(() => {
		//         this.suspend = false;
		//         resolve();
		//     }, 2000);
		// });
	}

	async tickKingdom(accountId: number) {
		const { kingdoms } = await this.load();
		const kd = kingdoms.get(accountId);
		if (!kd) {
			throw "Kingdom not found, account id: " + accountId;
		}
		const kdTick = kd.snapshots.size;
		const current = kd.snapshots.get(kdTick - 1);
		const next = JSON.parse(JSON.stringify(current)) as KingdomSnapshot;

		next.body.land += 1;
		next.tick = kdTick;

		kd.snapshots.set(kdTick, next);
	}
}

export const GameEngine = new Game();
