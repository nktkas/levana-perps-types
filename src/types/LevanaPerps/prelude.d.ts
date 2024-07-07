// 0.1.0-beta.15
//
// Convenience prelude module.
//
// This reexports commonly used identifiers for use by contracts and tools.

import { Attribute } from "../cosmwasm.d.ts";
import { Option, u32, u64, Vec } from "../rust.d.ts";

// ———————————————Modules———————————————

/** Represents a ratio between 0 and 1 inclusive */
export type InclusiveRatio = unknown;

// ———————————————Structs———————————————

/**
 * A human readable address.
 *
 * In Cosmos, this is typically bech32 encoded. But for multi-chain smart contracts no assumptions should be made other than being UTF-8 encoded and of reasonable length.
 *
 * This type represents a validated address. It can be created in the following ways
 *
 * 1. Use `Addr::unchecked(input)`
 * 2. Use `let checked: Addr = deps.api.addr_validate(input)?`
 * 3. Use `let checked: Addr = deps.api.addr_humanize(canonical_addr)?`
 * 4. Deserialize from JSON. This must only be done from JSON that was validated before such as a contract’s state. Addr must not be used in messages sent by the user because this would result in unvalidated instances.
 *
 * This type is immutable. If you really need to mutate it (Really? Are you sure?), create a mutable copy using `let mut mutable = Addr::to_string()` and operate on that `String` instance.
 */
export type Addr = string;

/** Unsigned value */
export type Base = string;

/** Unsigned value */
export type Collateral = string;

/**
 * A fixed-point decimal value with 18 fractional digits, i.e. Decimal256(1_000_000_000_000_000_000) == 1.0
 *
 * The greatest possible value that can be represented is 115792089237316195423570985008687907853269984665640564039457.584007913129639935 (which is (2^256 - 1) / 10^18)
 */
export type Decimal256 = string;

/** A duration of time measured in nanoseconds */
export type Duration = string;

/**
 * A full [Cosmos SDK event](https://docs.cosmos.network/main/basics/events).
 *
 * This version uses string attributes (similar to [Cosmos SDK StringEvent](https://github.com/cosmos/cosmos-sdk/blob/v0.42.5/proto/cosmos/base/abci/v1beta1/abci.proto#L56-L70)), which then get magically converted to bytes for Tendermint somewhere between the Rust-Go interface, JSON deserialization and the `NewEvent` call in Cosmos SDK.
 */
export interface Event {
	/** The event type. This is renamed to “ty” because “type” is reserved in Rust. This sucks, we know. */
	ty: string;
	/**
	 * The attributes to be included in the event.
	 *
	 * You can learn more about these from [Cosmos SDK docs](https://docs.cosmos.network/main/learn/advanced/events).
	 */
	attributes: Vec<Attribute>;
}

/** Unsigned value */
export type FarmingToken = string;

/**
 * The absolute leverage for a position, in terms of the base asset.
 *
 * Note that while leverage specified by the trader must be strictly positive (greater than 0), this type allows zero leverage to occur, since calculated leverage within the system based on the off-by-one exposure calculation may end up as 0.
 */
export type LeverageToBase = string;

/** Unsigned value */
export type LockdropShares = string;

/** Unsigned value */
export type LpToken = string;

/** Unsigned value */
export type LvnToken = string;

/** An identifier for a market. */
export type MarketId = `${string}_${string}`;

/** Ensure that the inner value is never 0. */
export type NonZero<T> = T;

/** Unsigned value */
export type Notional = string;

/** An error message for the perps protocol */
export interface PerpError<T = unknown> {
	/** Unique identifier for this error */
	id: ErrorId;
	/** Where in the protocol the error came from */
	domain: ErrorDomain;
	/** User friendly description */
	description: string;
	/** Optional additional information */
	data: Option<T>;
}

/** The price of the pair as used internally by the protocol, given as `collateral / notional`. */
export type Price = string;

/** The price of the currency pair, given as `quote / base`, e.g. “20,000 USD per BTC”. */
export type PriceBaseInQuote = string;

/** PriceBaseInQuote converted to USD */
export type PriceCollateralInUsd = string;

/**
 * All prices in the protocol for a given point in time.
 *
 * This includes extra information necessary for performing all conversions, such as the {@link MarketType}.
 */
export interface PricePoint {
	/**
	 * Price as used internally by the protocol, in terms of collateral and notional.
	 *
	 * This is generally less useful for external consumers, where {@link PricePoint.price_usd} and {@link PricePoint.price_base} are used.
	 */
	price_notional: Price;
	/**
	 * Price of the collateral asset in terms of USD.
	 *
	 * This is generally used for reporting of values like PnL and trade volume.
	 */
	price_usd: PriceCollateralInUsd;
	/** Price of the base asset in terms of the quote. */
	price_base: PriceBaseInQuote;
	/**
	 * Publish time of this price point.
	 *
	 * Before deferred execution, this was the block time when the field was added. Since deferred execution, this is a calculated value based on the publish times of individual feeds.
	 */
	timestamp: Timestamp;
	/**
	 * Is the notional asset USD?
	 *
	 * Used for avoiding lossy conversions to USD when they aren’t needed.
	 *
	 * We do not need to track if the collateral asset is USD, since USD can never be used as collateral directly. Instead, stablecoins would be used, in which case an explicit price to USD is always needed.
	 */
	is_notional_usd: boolean;
	/** Indicates if this market uses collateral as base or quote, needed for price conversions. */
	market_type: MarketType;
	/**
	 * Latest price publish time for the feeds composing the price, if available
	 *
	 * This field will always be empty since implementation of deferred execution.
	 */
	publish_time: Option<Timestamp>;
	/**
	 * Latest price publish time for the feeds composing the price_usd, if available
	 *
	 * This field will always be empty since implementation of deferred execution.
	 */
	publish_time_usd: Option<Timestamp>;
}

/** Unsigned value */
export type Quote = string;

/**
 * A raw address passed in via JSON.
 *
 * The purpose of this newtype wrapper is to make it clear at the type level if a parameter is an address, and ensure that we go through a proper validation step when using it.
 */
export type RawAddr = string;

/** Wrap up any UnsignedDecimal to provide negative values too. */
export type Signed<T> = T;

/**
 * The user-specified leverage for a position, with direction expressed as the signed value
 *
 * Leverage is always specified by the user in terms of the base currency. In a collateral-is-quote market, that directly becomes the exposure to notional. In a collateral-is-base market, we need to convert that exposure from collateral to notional for internal calculations.
 */
export type SignedLeverageToBase = string;

/**
 * Leverage calculated based on the protocol’s internal representation.
 *
 * This is calculated by comparing the notional size of a position against some amount of collateral (either active collateral from the trader or counter collateral from the liquidity pool). One of these values needs to be converted using a {@link Price}, so the leverage will change over time based on exchange rate.
 */
export type SignedLeverageToNotional = string;

/**
 * Essentially a newtype wrapper for Timestamp providing additional impls.
 *
 * Internal representation in nanoseconds since the epoch. We keep a {@link u64} directly (instead of a Timestamp or {@link Uint64}) to make it easier to derive some impls. The result is that we need to explicitly implement [Serialize](https://docs.rs/serde/1.0.200/serde/ser/trait.Serialize.html) and [Deserialize](https://docs.rs/serde/1.0.200/serde/de/trait.Deserialize.html) to keep the stringy representation.
 */
export type Timestamp = string;

/** A thin wrapper around u64 that is using strings for JSON encoding/decoding, such that the full u64 range can be used for clients that convert JSON numbers to floats, like JavaScript and jq. */
export type Uint64 = u64;

/** Unsigned value */
export type Usd = string;

// ———————————————Enums———————————————

/** Check that an addr satisfies auth checks */
export type AuthCheck =
	/** The owner addr for runtime administration. not necessarily the same as migration admin */
	| "owner"
	| {
		/** Any specific address */
		addr: Addr;
	}
	/** The market wind down address, used to gate the close all positions command. */
	| "wind_down";

/** What was the user doing when they hit the congestion error message? */
export type CongestionReason =
	/** Opening a new position via market order */
	| "open_market"
	/** Placing a new limit order */
	| "place_limit"
	/** Updating an existing position */
	| "update"
	/** Setting a trigger price on an existing position */
	| "set_trigger";

/** Flags for gating debug_log */
export type DebugLog =
	| "sanity_funds_add_unallocated"
	| "sanity_funds_remove_unallocated"
	| "sanity_funds_add_collateral"
	| "sanity_funds_remove_collateral"
	| "sanity_funds_add_trading_fees"
	| "sanity_funds_add_borrow_fees"
	| "sanity_funds_remove_fees"
	| "sanity_funds_add_liquidity"
	| "sanity_funds_remove_liquidity"
	| "sanity_funds_balance_assertion"
	| "sanity_funds_subtotal"
	| "sanity_funds_delta_neutrality_fee"
	| "funding_payment_event"
	| "funding_rate_change_event"
	| "borrow_fee_event"
	| "trading_fee_event"
	| "delta_neutrality_fee_event"
	| "limit_order_fee_event"
	| "delta_neutrality_ratio_event";

/** Direction in terms of base */
export type DirectionToBase =
	/** Long versus base */
	| "long"
	/** Short versus base */
	| "short";

/** Direction in terms of notional */
export enum DirectionToNotional {
	/** Long versus notional */
	long = 0,
	/** Short versus notional */
	short = 1,
}

/** Source within the protocol for the error */
export type ErrorDomain =
	| "market"
	| "spot_price"
	| "position_token"
	| "liquidity_token"
	| "cw20"
	| "wallet"
	| "factory"
	| "default"
	| "faucet"
	| "pyth"
	| "farming"
	| "stride"
	| "simple_oracle";

/** Unique identifier for an error within perps */
export type ErrorId =
	| "invalid_stake_lp"
	| "invalid_amount"
	| "slippage_assert"
	| "price_already_exists"
	| "price_not_found"
	| "price_too_old"
	| "position_update"
	| "native_funds"
	| "cw20_funds"
	| "auth"
	| "expired"
	| "msg_validation"
	| "conversion"
	| "config"
	| "internal_reply"
	| "exceeded"
	| "any"
	| "stale"
	| "insufficient_margin"
	| "invalid_liquidity_token_msg"
	| "address_already_exists"
	| "delta_neutrality_fee_already_long"
	| "delta_neutrality_fee_already_short"
	| "delta_neutrality_fee_newly_long"
	| "delta_neutrality_fee_newly_short"
	| "delta_neutrality_fee_long_to_short"
	| "delta_neutrality_fee_short_to_long"
	| "direction_to_base_flipped"
	| "missing_funds"
	| "unnecessary_funds"
	| "no_yield_to_claim"
	| "insufficient_for_reinvest"
	| "timestamp_subtract_underflow"
	| "invalid_infinite_max_gains"
	| "invalid_infinite_take_profit_price"
	| "max_gains_too_large"
	| "withdraw_too_much"
	| "insufficient_liquidity_for_withdrawal"
	| "missing_position"
	| "trader_leverage_out_of_range"
	| "counter_leverage_out_of_range"
	| "minimum_deposit"
	| "congestion"
	| "max_liquidity"
	| "invalid_trigger_price"
	| "liquidity_cooldown"
	| "pending_deferred_exec"
	| "volatile_price_feed_time_delta"
	| "limit_order_already_canceling"
	| "position_already_closing"
	| "no_price_publish_time_found"
	| "position_already_closed"
	| "missing_take_profit"
	| "insufficient_liquidity_for_unlock"
	| "liquidity";

/** An error type for known market errors with potentially special error handling. */
export type MarketError =
	| {
		invalid_infinite_max_gains: {
			market_type: MarketType;
			direction: DirectionToBase;
		};
	}
	| {
		invalid_infinite_take_profit_price: {
			market_type: MarketType;
			direction: DirectionToBase;
		};
	}
	| {
		max_gains_too_large: Record<string | number | symbol, never>;
	}
	| {
		withdraw_too_much: {
			requested: NonZero<LpToken>;
			available: NonZero<LpToken>;
		};
	}
	| {
		insufficient_liquidity_for_withdrawal: {
			requested_lp: NonZero<LpToken>;
			requested_collateral: NonZero<Collateral>;
			unlocked: Collateral;
		};
	}
	| {
		missing_position: {
			id: string;
		};
	}
	| {
		trader_leverage_out_of_range: {
			low_allowed: Decimal256;
			high_allowed: Decimal256;
			new_leverage: Decimal256;
			current_leverage: Option<Decimal256>;
		};
	}
	| {
		counter_leverage_out_of_range: {
			low_allowed: Decimal256;
			high_allowed: Decimal256;
			new_leverage: Decimal256;
			current_leverage: Option<Decimal256>;
		};
	}
	| {
		minimum_deposit: {
			deposit_collateral: Collateral;
			deposit_usd: Usd;
			minimum_usd: Usd;
		};
	}
	| {
		congestion: {
			current_queue: u32;
			max_size: u32;
			reason: CongestionReason;
		};
	}
	| {
		max_liquidity: {
			price_collateral_in_usd: PriceCollateralInUsd;
			current: Usd;
			deposit: Usd;
			max: Usd;
		};
	}
	| {
		delta_neutrality_fee_already_long: {
			cap: Signed<Decimal256>;
			sensitivity: Signed<Decimal256>;
			instant_before: Signed<Decimal256>;
			net_notional_before: Signed<Notional>;
			net_notional_after: Signed<Notional>;
		};
	}
	| {
		delta_neutrality_fee_already_short: {
			cap: Signed<Decimal256>;
			sensitivity: Signed<Decimal256>;
			instant_before: Signed<Decimal256>;
			net_notional_before: Signed<Notional>;
			net_notional_after: Signed<Notional>;
		};
	}
	| {
		delta_neutrality_fee_newly_long: {
			cap: Signed<Decimal256>;
			sensitivity: Signed<Decimal256>;
			instant_after: Signed<Decimal256>;
			net_notional_before: Signed<Notional>;
			net_notional_after: Signed<Notional>;
		};
	}
	| {
		delta_neutrality_fee_newly_short: {
			cap: Signed<Decimal256>;
			sensitivity: Signed<Decimal256>;
			instant_after: Signed<Decimal256>;
			net_notional_before: Signed<Notional>;
			net_notional_after: Signed<Notional>;
		};
	}
	| {
		delta_neutrality_fee_long_to_short: {
			cap: Signed<Decimal256>;
			sensitivity: Signed<Decimal256>;
			instant_before: Signed<Decimal256>;
			instant_after: Signed<Decimal256>;
			net_notional_before: Signed<Notional>;
			net_notional_after: Signed<Notional>;
		};
	}
	| {
		delta_neutrality_fee_short_to_long: {
			cap: Signed<Decimal256>;
			sensitivity: Signed<Decimal256>;
			instant_before: Signed<Decimal256>;
			instant_after: Signed<Decimal256>;
			net_notional_before: Signed<Notional>;
			net_notional_after: Signed<Notional>;
		};
	}
	| {
		liquidity_cooldown: {
			ends_at: Timestamp;
			seconds_remaining: u64;
		};
	}
	| {
		pending_deferred_exec: Record<string | number | symbol, never>;
	}
	| {
		volatile_price_feed_time_delta: {
			oldest: Timestamp;
			newest: Timestamp;
		};
	}
	| {
		limit_order_already_canceling: {
			order_id: Uint64;
		};
	}
	| {
		position_already_closing: {
			position_id: Uint64;
		};
	}
	| "no_price_publish_time_found"
	| {
		position_already_closed: {
			id: Uint64;
			close_time: Timestamp;
			reason: string;
		};
	}
	| {
		insufficient_liquidity_for_unlock: {
			requested: NonZero<Collateral>;
			total_locked: Collateral;
		};
	}
	| {
		liquidity: {
			/** Total amount of liquidity requested to take from unlocked pool. */
			requested: NonZero<Collateral>;
			/** Total amount of liquidity available in the unlocked pool. */
			total_unlocked: Collateral;
			/**
			 * Liquidity allowed to be taken for this action.
			 *
			 * In particular, carry leverage may restrict the total amount of liquidity that can be used to ensure sufficient funds for cash-and-carry balancing operations.
			 */
			allowed: Collateral;
		};
	};

/** Whether the collateral asset is the same as the quote or base asset. */
export type MarketType =
	/** A market where the collateral is the base asset */
	| "collateral_is_quote"
	/** A market where the collateral is the quote asset */
	| "collateral_is_base";

/**
 * The max gains for a position.
 *
 * Max gains are always specified by the user in terms of the quote currency.
 *
 * Note that when opening long positions in collateral-is-base markets, infinite max gains is possible. However, this is an error in the case of short positions or collateral-is-quote markets.
 */
export type MaxGainsInQuote =
	| {
		/** Finite max gains */
		finite: NonZero<Decimal256>;
	}
	/** Infinite max gains */
	| "pos_infinity";

export enum Order {
	ascending = 1,
	descending = 2,
}

/** Like {@link Order} but serialized as a string and with a schema export */
export type OrderInMessage =
	/** Ascending order */
	| "ascending"
	/** Descending order */
	| "descending";

/**
 * The take profit price for a position, as supplied by client messsages (in terms of BaseInQuote).
 *
 * Infinite take profit price is possible. However, this is an error in the case of short positions or collateral-is-quote markets.
 */
export type TakeProfitTrader =
	| {
		/** Finite take profit price */
		finite: NonZero<Decimal256>;
	}
	/** Infinite take profit price */
	| "pos_infinity";

/** Was the price provided by the trader too high or too low? */
export type TriggerPriceMustBe =
	/** Specified price must be less than the bound */
	| "less"
	/** Specified price must be greater than the bound */
	| "greater";

/** What type of price trigger occurred? */
export type TriggerType =
	/** A stop loss */
	| "stop_loss"
	/** A take profit */
	| "take_profit";

// ———————————————Constants———————————————

/** useful for placing an upper cap on query iterators as a safety measure to prevent exhausting resources on nodes that allow unbounded query gas */
export const QUERY_MAX_LIMIT = 1000;

// ———————————————Type Aliases———————————————

/**
 * A signed number type with high fidelity.
 *
 * Similar in spirit to cosmwasm_bignumber::Decimal256 - it is a more ergonomic wrapper around cosmwasm-std by making more things public but we also add negative values and other methods as-needed
 *
 * MANY OF THE METHODS ARE COPY/PASTE FROM cosmwasm_std the hope is that this is a temporary hack until cosmwasm_math lands
 */
export type Number = Signed<Decimal256>;

/**
 * A special case of {@link NonZero} which stores a big endian array of data.
 *
 * Purpose: this is intended to be used as a key in a cw-storage-plus Map. This wouldn’t be necessary if cw-storage-plus allowed non-reference A {@link Number} which is always greater than zero.
 *
 * This is useful for representing things like price.
 */
export type NumberGtZero = NonZero<Decimal256>;

/**
 * `Result<T, Error>`
 *
 * This is a reasonable return type to use throughout your application but also for `fn main`; if you do, failures will be printed along with any context and a backtrace if one was captured.
 *
 * `anyhow::Result` may be used with one or two type parameters.
 */
export type Result<T, E = Error> = {
	/** Contains the success value */
	ok: T;
} | {
	/** Contains the error value */
	err: E;
};
