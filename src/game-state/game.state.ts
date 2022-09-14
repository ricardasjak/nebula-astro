import { COLLECTIONS } from "../models/collections.const";
import type { Kingdom, KingdomBase, KingdomEntityWithSnapshots, KingdomSnapshot } from "../models/kingdom-dto.model";
import { supabase } from "../supabaseClient";
import { GameUtil } from "./game.util";
import { TickUtil } from "./tick.util";

type AcountID = number;

interface GameState {
	kingdoms: Map<AcountID, Kingdom>;
	kingdomsArray: Kingdom[];
	// tick: number;
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

	async load(force = false): Promise<GameState> {
		await this.suspend;

		if (this.kingdoms.size === 0 || force) {
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
			kingdomsArray: [...this.kingdoms.values()],
			// tick: this.tick,
		};
	}

	async loadKingdom(accountId: number): Promise<Kingdom | undefined> {
		await this.load();
		return this.kingdoms.get(accountId);
	}

	async reload(): Promise<GameState> {
		await this.save();
		return this.load(true);
	}

	async save(): Promise<void> {
		this.kingdoms.forEach((value, key) => {
			console.log(`${value.name}: ${value.snapshots.size}`);
		});

		// console.log("kd 24", [...this.kingdoms.get(24).snapshots.values()]);

		const snapshots: KingdomSnapshot[] = [];
		this.kingdoms.forEach((kd, accountId) => {
			kd.snapshots.forEach((snap, kdid) => {
				snapshots.push(snap);
				if (kdid === 30) {
					console.log(snap.body.queues);
				}
			});
		});
		console.log("update count: ", snapshots.length);
		console.log("update: ", snapshots);

		this.suspend = new Promise((resolve, reject) => {
			supabase
				.from(COLLECTIONS.kingdomSnapshots)
				.upsert(snapshots)
				.then(
					(dbResponse) => {
						console.log("ADMIN: saved", dbResponse);
						resolve();
					},
					(err) => {
						console.error("ADMIN: failed to save");
						reject();
					}
				);
		});
		return await this.suspend;
	}

	// async addKingdom(accountId: number, kingdom: KingdomBase, snapshot: KingdomSnapshot): Promise<void> {
	//     const fullKingdom: Kingdom = {
	//         ...kingdom,
	//         snapshots: (new Map()).set(0, snapshot),
	//     }
	//     this.kingdoms.set(accountId, fullKingdom);
	// }

	async tickKingdom(accountId: number) {
		const kd = await this.loadKingdom(accountId);
		if (!kd) {
			return;
		}
		// console.log(kd);
		TickUtil.tick(kd);
		// console.log(kd);
		// const kd = kingdoms.get(accountId);
		// if (!kd) {
		// 	throw "Kingdom not found, account id: " + accountId;
		// }
		// const kdTick = kd.snapshots.size;
		// const current = kd.snapshots.get(kdTick - 1);
		// const next = JSON.parse(JSON.stringify(current)) as KingdomSnapshot;

		// next.body.land += 1;
		// next.body.military.tanks += 100;
		// next.tick = kdTick;

		// kd.snapshots.set(kdTick, next);
		// next.body.nw = GameUtil.getNetworth(kd);
	}
}

export const GameEngine = new Game();
