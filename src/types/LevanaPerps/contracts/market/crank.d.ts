// 0.1.0-beta.15
//
// Data types and events for cranking.

import { DeferredExecId, DeferredExecTarget } from "./deferred_execution.d.ts";
import { OrderId } from "./order.d.ts";
import { LiquidationReason, PositionId } from "./position.d.ts";

// ———————————————Enums———————————————

/** What work is currently available for the crank. */
export type CrankWorkInfo =
	| {
		/** Closing all open positions */
		close_all_positions: {
			/** Next position to be closed */
			position: PositionId;
		};
	}
	| {
		/** Resetting all LP balances to 0 after all liquidity is drained */
		reset_lp_balances: Record<string | number | symbol, never>;
	}
	| {
		/** Liquifund a position */
		liquifunding: {
			/** Next position to be liquifunded */
			position: PositionId;
		};
	}
	| {
		/**
		 * Liquidate a position.
		 *
		 * Includes max gains, take profit, and stop loss.
		 */
		liquidation: {
			/** Position to liquidate */
			position: PositionId;
			/** Reason for the liquidation */
			liquidation_reason: LiquidationReason;
		};
	}
	| {
		/** Deferred execution (open/update/closed) can be executed. */
		deferred_exec: {
			/** ID to be processed */
			deferred_exec_id: DeferredExecId;
			/** Target of the action */
			target: DeferredExecTarget;
		};
	}
	| {
		/** Limit order can be opened */
		limit_order: {
			/** ID of the order to be opened */
			order_id: OrderId;
		};
	}
	| {
		/** Finished all processing for a given price update */
		completed: Record<string | number | symbol, never>;
	};
