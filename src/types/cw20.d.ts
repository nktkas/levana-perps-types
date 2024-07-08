import type { Timestamp } from "./cosmwasm.d.ts";
import type { u64 } from "./rust.d.ts";

/** Expiration represents a point in time when some event happens. It can compare with a BlockInfo and will return is_expired() == true once the condition is hit (and for every block in the future) */
export type Expiration =
	| {
		/** AtHeight will expire when `env.block.height` >= height */
		at_height: u64;
	}
	| {
		/** AtTime will expire when `env.block.time` >= time */
		at_time: Timestamp;
	}
	| {
		/** Never will never expire. Used to express the empty variant */
		never: Record<string | number | symbol, never>;
	};
