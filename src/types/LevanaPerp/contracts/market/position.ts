import {
	Addr,
	Base,
	Collateral,
	DirectionToBase,
	LeverageToBase,
	MaxGainsInQuote,
	Notional,
	PriceBaseInQuote,
	Signed,
	TakeProfitTrader,
	Timestamp,
	Usd,
} from "../../prelude.ts";

import { Option, Vec } from "../../../rust.ts";
import { PricePoint } from "../../prelude.ts";
import { NonZero } from "../../prelude.ts";
import { Price } from "../../prelude.ts";

// Structs

/**
 * Instructions to close a position.
 *
 * Closing a position can occur for multiple reasons: explicit action by the trader, settling price exposure (meaning: you hit a liquidation or take profit), insufficient margin… the point of this data structure is to capture all the information needed by the close position actions to do final settlement on a position and move it to the closed position data structures.
 */
export interface ClosePositionInstructions {
	/** The position in its current state */
	pos: Position;
	/**
	 * The capped exposure amount after taking liquidation margin into account.
	 *
	 * Positive value means a transfer from counter collateral to active collateral. Negative means active to counter collateral. This is not reflected in the position itself, since Position requires non-zero active and counter collateral, and it’s entirely possible we will consume the entirety of one of those fields.
	 */
	capped_exposure: Signed<Collateral>;
	/**
	 * Additional losses that the trader experienced that cut into liquidation margin.
	 *
	 * If the trader experienced max gains, then this value is 0. In the case where the trader experienced a liquidation event and capped_exposure did not fully represent losses due to liquidation margin, this value contains additional losses we would like to take away from the trader after paying all pending fees.
	 */
	additional_losses: Collateral;
	/** The price point used for settling this position. */
	settlement_price: PricePoint;
	/** See ClosedPosition::reason */
	reason: PositionCloseReason;
	/** Did this occur because the position was closed during liquifunding? */
	closed_during_liquifunding: boolean;
}

/** Information on a closed position */
export interface ClosedPosition {
	/** Owner at the time the position closed */
	owner: Addr;
	/** ID of the position */
	id: PositionId;
	/** Direction (to base) of the position */
	direction_to_base: DirectionToBase;
	/** Timestamp the position was created, block time. */
	created_at: Timestamp;
	/** Timestamp of the price point used for creating this position. */
	price_point_created_at: Option<Timestamp>;
	/** Timestamp of the last liquifunding */
	liquifunded_at: Timestamp;
	/**
	 * The one-time fee paid when opening or updating a position
	 *
	 * this value is the current balance, including all updates
	 */
	trading_fee_collateral: Collateral;
	/** Cumulative trading fees expressed in USD */
	trading_fee_usd: Usd;
	/**
	 * The ongoing fee paid (and earned!) between positions to incentivize keeping longs and shorts in balance which in turn reduces risk for LPs
	 *
	 * This value is the current balance, not a historical record of each payment
	 */
	funding_fee_collateral: Signed<Collateral>;
	/** Cumulative funding fee in USD */
	funding_fee_usd: Signed<Usd>;
	/**
	 * The ongoing fee paid to LPs to lock up their deposit as counter-size collateral in this position
	 *
	 * This value is the current balance, not a historical record of each payment
	 */
	borrow_fee_collateral: Collateral;
	/** Cumulative borrow fee in USD */
	borrow_fee_usd: Usd;
	/** Cumulative amount of crank fees paid by the position */
	crank_fee_collateral: Collateral;
	/** Cumulative crank fees in USD */
	crank_fee_usd: Usd;
	/**
	 * Cumulative amount of delta neutrality fees paid by (or received by) the position.
	 *
	 * Positive == outgoing, negative == incoming, like funding_fee.
	 */
	delta_neutrality_fee_collateral: Signed<Collateral>;
	/** Cumulative delta neutrality fee in USD */
	delta_neutrality_fee_usd: Signed<Usd>;
	/**
	 * Deposit collateral for the position.
	 *
	 * This includes any updates from collateral being added or removed.
	 */
	deposit_collateral: Signed<Collateral>;
	/** Deposit collateral in USD, using cost basis analysis. */
	deposit_collateral_usd: Signed<Usd>;
	/** Final active collateral, the amount sent back to the trader on close */
	active_collateral: Collateral;
	/**
	 * Profit or loss of the position in terms of collateral.
	 *
	 * This is the final collateral send to the trader minus all deposits (including updates).
	 */
	pnl_collateral: Signed<Collateral>;
	/**
	 * Profit or loss, in USD
	 *
	 * This is not simply the PnL in collateral converted to USD. It converts each individual event to a USD representation using the historical timestamp. This can be viewed as a cost basis view of PnL.
	 */
	pnl_usd: Signed<Usd>;
	/** The notional size of the position at close. */
	notional_size: Signed<Notional>;
	/** Entry price */
	entry_price_base: PriceBaseInQuote;
	/**
	 * the time at which the position is actually closed
	 *
	 * This will always be the block time when the crank closed the position, whether via liquidation, deferred execution of a ClosePosition call, or liquifunding.
	 */
	close_time: Timestamp;
	/** needed for calculating final settlement amounts if by user: same as close time if by liquidation: first time position became liquidatable */
	settlement_time: Timestamp;
	/** the reason the position is closed */
	reason: PositionCloseReason;
	/** liquidation margin at the time of close Optional for the sake of backwards-compatibility */
	liquidation_margin: Option<LiquidationMargin>;
}

/** Collateral and USD which will always be non-negative. */
export type CollateralAndUsd = string;

/**
 * Liquidation margin for a position, broken down by component.
 *
 * Each field represents how much collateral has been set aside for the given fees, or the maximum amount the position can pay at liquifunding.
 */
export interface LiquidationMargin {
	/** Maximum borrow fee payment. */
	borrow: Collateral;
	/** Maximum funding payment. */
	funding: Collateral;
	/** Maximum delta neutrality fee. */
	delta_neutrality: Collateral;
	/** Funds set aside for a single crank fee. */
	crank: Collateral;
	/** Funds set aside to cover additional price exposure losses from sparse price updates. */
	exposure: Collateral;
}

/** The position itself */
export interface Position {
	/** Owner of the position */
	owner: Addr;
	/** Unique identifier for a position */
	id: PositionId;
	/**
	 * The amount of collateral deposited by the trader to create this position.
	 *
	 * It would seem like the type here should be `NonZero<Collateral>`. However, due to updates, this isn’t accurate. It’s possible for someone to update a position and withdraw more collateral than the original deposit.
	 */
	deposit_collateral: SignedCollateralAndUsd;
	/**
	 * Active collateral for the position
	 *
	 * As a position stays open, we liquifund to realize price exposure and take fees. This is the current trader-side collateral after those steps.
	 */
	active_collateral: NonZero<Collateral>;
	/** Collateral owned by the liquidity pool that is locked in this position. */
	counter_collateral: NonZero<Collateral>;
	/** This is signed, where negative represents a short and positive is a long */
	notional_size: Signed<Notional>;
	/** When the position was created, in terms of block time. */
	created_at: Timestamp;
	/**
	 * Price point timestamp of the crank that created this position.
	 *
	 * This field is only used since deferred execution, before that it is `None`.
	 */
	price_point_created_at: Option<Timestamp>;
	/**
	 * The one-time fee paid when opening or updating a position
	 *
	 * this value is the current balance, including all updates
	 */
	trading_fee: CollateralAndUsd;
	/**
	 * The ongoing fee paid (and earned!) between positions to incentivize keeping longs and shorts in balance which in turn reduces risk for LPs
	 *
	 * This value is the current balance, not a historical record of each payment
	 */
	funding_fee: SignedCollateralAndUsd;
	/**
	 * The ongoing fee paid to LPs to lock up their deposit as counter-size collateral in this position
	 *
	 * This value is the current balance, not a historical record of each payment
	 */
	borrow_fee: CollateralAndUsd;
	/** Total crank fees paid */
	crank_fee: CollateralAndUsd;
	/**
	 * Cumulative amount of delta neutrality fees paid by (or received by) the position.
	 *
	 * Positive == outgoing, negative == incoming, like funding_fee.
	 */
	delta_neutrality_fee: SignedCollateralAndUsd;
	/**
	 * Last time the position was liquifunded.
	 *
	 * For newly opened positions, this is the same as the creation time.
	 */
	liquifunded_at: Timestamp;
	/**
	 * When is our next scheduled liquifunding?
	 *
	 * The crank will automatically liquifund this position once this timestamp has passed. Additionally, liquifunding may be triggered by updating the position.
	 */
	next_liquifunding: Timestamp;
	/** A trader specified price at which the position will be liquidated */
	stop_loss_override: Option<PriceBaseInQuote>;
	/** Stored separately to ensure there are no rounding errors, since we need precise binary equivalence for lookups. */
	stop_loss_override_notional: Option<Price>;
	/** The most recently calculated liquidation price */
	liquidation_price: Option<Price>;
	/** The amount of liquidation margin set aside */
	liquidation_margin: LiquidationMargin;
	/** The take profit value set by the trader in a message. For historical reasons, this value can be optional if the user provided a max gains price. */
	take_profit_trader: Option<TakeProfitTrader>;
	/** Derived directly from `take_profit_trader` to get the PriceNotionalInCollateral representation. This will be `None` if `take_profit_trader` is infinite. For historical reasons, this value will also be `None` if the user provided a max gains price. Stored separately to ensure there are no rounding errors, since we need precise binary equivalence for lookups. */
	take_profit_trader_notional: Option<Price>;
	/** The most recently calculated price at which the trader will achieve maximum gains and take all counter collateral. This is the notional price, not the base price, to avoid rounding errors */
	take_profit_total: Option<Price>;
}

/** PositionId */
export type PositionId = string;

/** Query response representing current state of a position */
export interface PositionQueryResponse {
	/** Owner */
	owner: Addr;
	/** Unique ID */
	id: PositionId;
	/** Direction */
	direction_to_base: DirectionToBase;
	/**
	 * Current leverage
	 *
	 * This is impacted by fees and price exposure
	 */
	leverage: LeverageToBase;
	/** Leverage of the counter collateral */
	counter_leverage: LeverageToBase;
	/** When the position was opened, block time */
	created_at: Timestamp;
	/** Price point used for creating this position */
	price_point_created_at: Option<Timestamp>;
	/** When the position was last liquifunded */
	liquifunded_at: Timestamp;
	/**
	 * The one-time fee paid when opening or updating a position
	 *
	 * This value is the current balance, including all updates
	 */
	trading_fee_collateral: Collateral;
	/** USD expression of Self::trading_fee_collateral using cost-basis calculation. */
	trading_fee_usd: Usd;
	/**
	 * The ongoing fee paid (and earned!) between positions to incentivize keeping longs and shorts in balance which in turn reduces risk for LPs
	 *
	 * This value is the current balance, not a historical record of each payment
	 */
	funding_fee_collateral: Signed<Collateral>;
	/** USD expression of Self::funding_fee_collateral using cost-basis calculation. */
	funding_fee_usd: Signed<Usd>;
	/**
	 * The ongoing fee paid to LPs to lock up their deposit as counter-size collateral in this position
	 *
	 * This value is the current balance, not a historical record of each payment
	 */
	borrow_fee_collateral: Collateral;
	/** USD expression of Self::borrow_fee_collateral using cost-basis calculation. */
	borrow_fee_usd: Usd;
	/** Cumulative amount of crank fees paid by the position */
	crank_fee_collateral: Collateral;
	/** USD expression of Self::crank_fee_collateral using cost-basis calculation. */
	crank_fee_usd: Usd;
	/** Aggregate delta neutrality fees paid or received through position opens and upates. */
	delta_neutrality_fee_collateral: Signed<Collateral>;
	/** USD expression of Self::delta_neutrality_fee_collateral using cost-basis calculation. */
	delta_neutrality_fee_usd: Signed<Usd>;
	/** See Position::deposit_collateral */
	deposit_collateral: Signed<Collateral>;
	/** USD expression of Self::deposit_collateral using cost-basis calculation. */
	deposit_collateral_usd: Signed<Usd>;
	/** See Position::active_collateral */
	active_collateral: Signed<Collateral>;
	/** Self::active_collateral converted to USD at the current exchange rate */
	active_collateral_usd: Signed<Usd>;
	/** See Position::counter_collateral */
	counter_collateral: Signed<Collateral>;
	/** Unrealized PnL on this position, in terms of collateral. */
	pnl_collateral: Signed<Collateral>;
	/** Unrealized PnL on this position, in USD, using cost-basis analysis. */
	pnl_usd: Signed<Usd>;
	/** DNF that would be charged (positive) or received (negative) if position was closed now. */
	dnf_on_close_collateral: Signed<Collateral>;
	/** Notional size of the position */
	notional_size: Signed<Notional>;
	/** Notional size converted to collateral at the current price */
	notional_size_in_collateral: Signed<Collateral>;
	/**
	 * The size of the position in terms of the base asset.
	 *
	 * Note that this is not a simple conversion from notional size. Instead, this needs to account for the off-by-one leverage that occurs in collateral-is-base markets.
	 */
	position_size_base: Signed<Base>;
	/** Convert Self::position_size_base into USD at the current exchange rate. */
	position_size_usd: Signed<Usd>;
	/** Price at which liquidation will occur */
	liquidation_price_base: Option<PriceBaseInQuote>;
	/** The liquidation margin set aside on this position */
	liquidation_margin: LiquidationMargin;
	/** Maximum gains, in terms of quote, the trader can achieve */
	max_gains_in_quote: Option<MaxGainsInQuote>;
	/** Entry price */
	entry_price_base: PriceBaseInQuote;
	/** When the next liquifunding is scheduled */
	next_liquifunding: Timestamp;
	/** Stop loss price set by the trader */
	stop_loss_override: Option<PriceBaseInQuote>;
	/** The take profit value set by the trader in a message. For historical reasons, this value can be optional if the user provided a max gains price. */
	take_profit_override: Option<TakeProfitTrader>;
	/** The most recently calculated price at which the trader will achieve maximum gains and take all counter collateral. */
	take_profit_price_base: Option<PriceBaseInQuote>;
}

/** Response from [QueryMsg::Positions] */
export interface PositionsResp {
	/** Open positions */
	positions: Vec<PositionQueryResponse>;
	/**
	 * Positions which are pending a liquidation/take profit
	 *
	 * The closed position information is not the final version of the data, the close process itself still needs to make final payments.
	 */
	pending_close: Vec<ClosedPosition>;
	/** Positions which have already been closed. */
	closed: Vec<ClosedPosition>;
}

/** Collateral and USD which can become negative */
export type SignedCollateralAndUsd = string;

// Enums

/** Reason why a position was liquidated */
export type LiquidationReason =
	/** True liquidation: insufficient funds in active collateral. */
	| "liquidated"
	/** Maximum gains were achieved. */
	| "max_gains"
	/** Stop loss price override was triggered. */
	| "stop_loss"
	/** Specifically take profit override, not max gains. */
	| "take_profit";

/**
 * Outcome of operations which might require closing a position.
 *
 * This can apply to liquifunding, settling price exposure, etc.
 */
export type MaybeClosedPosition =
	| {
		/** The position stayed open, here’s the current status */
		open: Position;
	}
	| {
		/** We need to close the position */
		close: ClosePositionInstructions;
	};

/** Reason the position was closed */
export type PositionCloseReason =
	| {
		/** Some kind of automated price trigger */
		liquidated: LiquidationReason;
	}
	/** The trader directly chose to close the position */
	| "direct";

/**
 * Query response intermediate value on a position.
 *
 * Positions which are open but need to be liquidated cannot be represented in a {@link PositionQueryResponse}, since many of the calculated fields will be invalid. We use this data type to represent query responses for open positions.
 */
export type PositionOrPendingClose =
	| {
		/** Position which should remain open. */
		open: PositionQueryResponse;
	}
	| {
		/** The value stored here may change after actual close occurs due to pending payments. */
		pending_close: ClosedPosition;
	};
