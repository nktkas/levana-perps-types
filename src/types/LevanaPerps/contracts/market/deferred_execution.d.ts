// Time of last check: 2024-06-13

import { PositionId } from "./position.d.ts";
import {
	Addr,
	Collateral,
	DirectionToBase,
	LeverageToBase,
	MaxGainsInQuote,
	NonZero,
	PriceBaseInQuote,
	PricePoint,
	TakeProfitTrader,
	Timestamp,
	Usd,
} from "../../prelude.d.ts";
import { OrderId } from "./order.d.ts";
import { Option, Vec } from "../../../rust.d.ts";
import { SlippageAssert, StopLoss } from "./entry.d.ts";

// ———————————————Structs———————————————

/** Event when a deferred execution item is executed via the crank. */
export interface DeferredExecExecutedEvent {
	/** ID */
	deferred_exec_id: DeferredExecId;
	/** Entity targeted by this action */
	target: DeferredExecTarget;
	/** Address that owns this item */
	owner: Addr;
	/** Was this item executed successfully? */
	success: boolean;
	/** Text description of what happened */
	desc: string;
}

/** A unique numeric ID for each deferred execution in the protocol. */
export type DeferredExecId = string;

/** Event emitted when a deferred execution is queued. */
export interface DeferredExecQueuedEvent {
	/** ID */
	deferred_exec_id: DeferredExecId;
	/** What entity is targetted by this item */
	target: DeferredExecTarget;
	/** Address that queued the event */
	owner: Addr;
}

/** A deferred execution work item and its current status. */
export interface DeferredExecWithStatus {
	/** ID of this item */
	id: DeferredExecId;
	/** Timestamp this was created, and therefore minimum price update timestamp needed */
	created: Timestamp;
	/** Status */
	status: DeferredExecStatus;
	/** Who owns (i.e. created) this item? */
	owner: Addr;
	/** Work item */
	item: DeferredExecItem;
}

/** Event when fees are returned to a user */
export interface FeesReturnedEvent {
	/** Who overpaid the fees and received them back */
	recipient: Addr;
	/** Amount received in collateral */
	amount: NonZero<Collateral>;
	/** Current USD amount */
	amount_usd: NonZero<Usd>;
}

/** Enumeration API for getting deferred exec IDs */
export interface ListDeferredExecsResp {
	/** Next batch of items */
	items: Vec<DeferredExecWithStatus>;
	/** Only `Some` if more IDs exist */
	next_start_after: Option<DeferredExecId>;
}

// ———————————————Enums———————————————

/**
 * After successful execution of an item, what did it impact?
 *
 * Unlike {@link DeferredExecTarget} because, after execution, we always have a specific position or order impacted.
 */
export type DeferredExecCompleteTarget =
	| {
		/** Modifying an existing position */
		position: PositionId;
	}
	| {
		/** Modifying an existing limit order */
		order: OrderId;
	};

/** A deferred execution work item */
export type DeferredExecItem =
	| {
		/** Open a new position */
		open_position: {
			/** Assertion that the price has not moved too far */
			slippage_assert: Option<SlippageAssert>;
			/** Leverage of new position */
			leverage: LeverageToBase;
			/** Direction of new position */
			direction: DirectionToBase;
			/**
			 * @deprecated use take_profit instead
			 *
			 * Maximum gains of new position
			 */
			max_gains: Option<MaxGainsInQuote>;
			/** Stop loss price of new position */
			stop_loss_override: Option<PriceBaseInQuote>;
			/** Take profit price of new position */
			take_profit: Option<TakeProfitTrader>;
			/** The amount of collateral provided */
			amount: NonZero<Collateral>;
			/**
			 * Crank fee already charged
			 *
			 * Note that this field only exists for variants where there isn’t a position or order to charge the fee against. In those cases, the position/order itself is immediately updated to reflect the new charge.
			 */
			crank_fee: Collateral;
			/** Crank fee charged, in USD */
			crank_fee_usd: Usd;
		};
	}
	| {
		/**
		 * Add collateral to a position, causing leverage to decrease
		 *
		 * The amount of collateral to add must be attached as funds
		 */
		update_position_add_collateral_impact_leverage: {
			/** ID of position to update */
			id: PositionId;
			/** The amount of collateral provided */
			amount: NonZero<Collateral>;
		};
	}
	| {
		/**
		 * Add collateral to a position, causing notional size to increase
		 *
		 * The amount of collateral to add must be attached as funds
		 */
		update_position_add_collateral_impact_size: {
			/** ID of position to update */
			id: PositionId;
			/** Assertion that the price has not moved too far */
			slippage_assert: Option<SlippageAssert>;
			/** The amount of collateral provided */
			amount: NonZero<Collateral>;
		};
	}
	| {
		/** Remove collateral from a position, causing leverage to increase */
		update_position_remove_collateral_impact_leverage: {
			/** ID of position to update */
			id: PositionId;
			/** Amount of funds to remove from the position */
			amount: NonZero<Collateral>;
		};
	}
	| {
		/** Remove collateral from a position, causing notional size to decrease */
		update_position_remove_collateral_impact_size: {
			/** ID of position to update */
			id: PositionId;
			/** Amount of funds to remove from the position */
			amount: NonZero<Collateral>;
			/** Assertion that the price has not moved too far */
			slippage_assert: Option<SlippageAssert>;
		};
	}
	| {
		/**
		 * Modify the leverage of the position
		 *
		 * This will impact the notional size of the position
		 */
		update_position_leverage: {
			/** ID of position to update */
			id: PositionId;
			/** New leverage of the position */
			leverage: LeverageToBase;
			/** Assertion that the price has not moved too far */
			slippage_assert: Option<SlippageAssert>;
		};
	}
	| {
		/** Modify the max gains of a position */
		update_position_max_gains: {
			/** ID of position to update */
			id: PositionId;
			/** New max gains of the position */
			max_gains: MaxGainsInQuote;
		};
	}
	| {
		/** Modify the take profit price of a position */
		update_position_take_profit_price: {
			/** ID of position to update */
			id: PositionId;
			/** New take profit price of the position */
			price: TakeProfitTrader;
		};
	}
	| {
		/** Modify the stop loss price of a position */
		update_position_stop_loss_price: {
			/** ID of position to update */
			id: PositionId;
			/** New stop loss price of the position */
			stop_loss: StopLoss;
		};
	}
	| {
		/** Close a position */
		close_position: {
			/** ID of position to close */
			id: PositionId;
			/** Assertion that the price has not moved too far */
			slippage_assert: Option<SlippageAssert>;
		};
	}
	| {
		/** Set a stop loss or take profit override. */
		set_trigger_order: {
			/** ID of position to modify */
			id: PositionId;
			/** New stop loss price of the position Passing None will remove the override. */
			stop_loss_override: Option<PriceBaseInQuote>;
			/** New take_profit price of the position Passing None will bypass changing this */
			take_profit: Option<TakeProfitTrader>;
		};
	}
	| {
		/** Set a limit order to open a position when the price of the asset hits the specified trigger price. */
		place_limit_order: {
			/** Price when the order should trigger */
			trigger_price: PriceBaseInQuote;
			/** Leverage of new position */
			leverage: LeverageToBase;
			/** Direction of new position */
			direction: DirectionToBase;
			/**
			 * @deprecated use take_profit instead
			 *
			 * Maximum gains of new position
			 */
			max_gains: Option<MaxGainsInQuote>;
			/** Stop loss price of new position */
			stop_loss_override: Option<PriceBaseInQuote>;
			/** Take profit price of new position */
			take_profit: Option<TakeProfitTrader>;
			/** The amount of collateral provided */
			amount: NonZero<Collateral>;
			/** Crank fee already charged */
			crank_fee: Collateral;
			/** Crank fee charged, in USD */
			crank_fee_usd: Usd;
		};
	}
	| {
		/** Cancel an open limit order */
		cancel_limit_order: {
			/** ID of the order */
			order_id: OrderId;
		};
	};

/** Current status of a deferred execution work item */
export type DeferredExecStatus =
	/** Waiting to be cranked */
	| "pending"
	| {
		/** Successfully applied */
		success: {
			/** Entity in the system that was impacted by this execution */
			target: DeferredExecCompleteTarget;
			/** Timestamp when it was successfully executed */
			executed: Timestamp;
		};
	}
	| {
		/** Did not successfully apply */
		failure: {
			/** Reason it didn’t apply successfully */
			reason: string;
			/** Timestamp when it failed execution */
			executed: Timestamp;
			/** Price point when it was cranked, if applicable */
			crank_price: Option<PricePoint>;
		};
	};

/** What entity within the system will be affected by this. */
export type DeferredExecTarget =
	/** For open positions or limit orders, no ID exists yet */
	| "does-not-exist"
	| {
		/** Modifying an existing position */
		position: PositionId;
	}
	| {
		/** Modifying an existing limit order */
		order: OrderId;
	};

/** Result of trying to query a single deferred execution item. */
export type GetDeferredExecResp =
	| {
		/** The requested ID was found */
		found: {
			/** The current state of the item */
			item: DeferredExecWithStatus;
		};
	}
	| {
		/** The requested ID was not found */
		not_found: Record<string | number | symbol, never>;
	};
