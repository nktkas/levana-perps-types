import { Option, u32 } from "../../../rust.d.ts";
import { NumberGtZero } from "../../prelude.d.ts";
import { Usd } from "../../prelude.d.ts";
import { Collateral } from "../../prelude.d.ts";
import { NonZero } from "../../prelude.d.ts";
import { Decimal256, Number } from "../../prelude.d.ts";
import { SpotPriceConfig, SpotPriceConfigInit } from "./spot_price.d.ts";

// Structs

/** Configuration info for the vAMM Set by admin-only Since this tends to cross the message boundary all the numeric types are u32 or lower helper functions are available where more bits are needed */
export interface Config {
	/** The fee to open a position, as a percentage of the notional size */
	trading_fee_notional_size: Decimal256;
	/** The fee to open a position, as a percentage of the counter-side collateral */
	trading_fee_counter_collateral: Decimal256;
	/** default number of crank exeuctions to do when none specified */
	crank_execs: u32;
	/** The maximum allowed leverage when opening a position */
	max_leverage: Number;
	/** Impacts how much the funding rate changes in response to net notional changes. */
	funding_rate_sensitivity: Decimal256;
	/** The maximum annualized rate for a funding payment */
	funding_rate_max_annualized: Decimal256;
	/** The minimum annualized rate for borrow fee payments */
	borrow_fee_rate_min_annualized: NumberGtZero;
	/** The maximum annualized rate for borrow fee payments */
	borrow_fee_rate_max_annualized: NumberGtZero;
	/**
	 * Needed to ensure financial model is balanced
	 *
	 * Must be at most 1 less than the Config::max_leverage
	 */
	carry_leverage: Decimal256;
	/** Do not emit events (default is false, events will be emitted) */
	mute_events: boolean;
	/** Delay between liquifundings, in seconds */
	liquifunding_delay_seconds: u32;
	/** The percentage of fees that are taken for the protocol */
	protocol_tax: Decimal256;
	/** How long it takes to unstake xLP tokens into LP tokens, in seconds */
	unstake_period_seconds: u32;
	/** Target utilization ratio liquidity, given as a ratio. (Must be between 0 and 1). */
	target_utilization: NonZero<Decimal256>;
	/**
	 * Borrow fee sensitivity parameter.
	 *
	 * See [section 5.5 of the whitepaper](https://www.notion.so/levana-protocol/Levana-Well-funded-Perpetuals-Whitepaper-9805a6eba56d429b839f5551dbb65c40#295f9f2689e74ccab16ca28177eb32cb).
	 */
	borrow_fee_sensitivity: NumberGtZero;
	/**
	 * Maximum multiplier for xLP versus LP borrow fee shares.
	 *
	 * For example, if this number is 5, then as liquidity in the protocol approaches 100% in LP and 0% in xLP, any xLP token will receive 5x the rewards of an LP token.
	 */
	max_xlp_rewards_multiplier: NumberGtZero;
	/** Minimum counterpoint to Config::max_xlp_rewards_multiplier */
	min_xlp_rewards_multiplier: NumberGtZero;
	/**
	 * Delta neutrality fee sensitivity parameter.
	 *
	 * Higher values indicate markets with greater depth of liquidity, and allow for larger divergence for delta neutrality in the markets.
	 *
	 * This value is specified in the notional asset.
	 */
	delta_neutrality_fee_sensitivity: NumberGtZero;
	/** Delta neutrality fee cap parameter, given as a percentage */
	delta_neutrality_fee_cap: NumberGtZero;
	/** Proportion of delta neutrality inflows that are sent to the protocol. */
	delta_neutrality_fee_tax: Decimal256;
	/** The crank fee to be paid into the system, in collateral */
	crank_fee_charged: Usd;
	/**
	 * The crank surcharge charged for every 10 items in the deferred execution queue.
	 *
	 * This is intended to create backpressure in times of high congestion.
	 *
	 * For every 10 items in the deferred execution queue, this amount is added to the crank fee charged on performing a deferred execution message.
	 *
	 * This is only charged while adding new items to the queue, not when performing ongoing tasks like liquifunding or liquidations.
	 */
	crank_fee_surcharge: Usd;
	/** The crank fee to be sent to crankers, in collateral */
	crank_fee_reward: Usd;
	/** Minimum deposit collateral, given in USD */
	minimum_deposit_usd: Usd;
	/**
	 * The liquifunding delay fuzz factor, in seconds.
	 *
	 * Up to how many seconds will we perform a liquifunding early. This will be part of a semi-randomly generated value and will allow us to schedule liquifundings arbitrarily to smooth out spikes in traffic.
	 */
	liquifunding_delay_fuzz_seconds: u32;
	/** The maximum amount of liquidity that can be deposited into the market. */
	max_liquidity: MaxLiquidity;
	/** Disable the ability to proxy CW721 execution messages for positions. Even if this is true, queries will still work as usual. */
	disable_position_nft_exec: boolean;
	/**
	 * The liquidity cooldown period.
	 *
	 * After depositing new funds into the market, liquidity providers will have a period of time where they cannot withdraw their funds. This is intended to prevent an MEV attack where someone can reorder transactions to extract fees from traders without taking on any impairment risk.
	 *
	 * This protection is only triggered by deposit of new funds; reinvesting existing yield does not introduce a cooldown.
	 *
	 * While the cooldown is in place, providers are prevented from either withdrawing liquidity or transferring their LP and xLP tokens.
	 *
	 * For migration purposes, this value defaults to 0, meaning no cooldown period.
	 */
	liquidity_cooldown_seconds: u32;
	/** Ratio of notional size used for the exposure component of the liquidation margin. */
	exposure_margin_ratio: Decimal256;
	/** The spot price config for this market */
	spot_price: SpotPriceConfig;
	/** Just for historical reasons/migrations */
	price_update_too_old_seconds: Option<u32>;
	/** Just for historical reasons/migrations */
	unpend_limit: Option<u32>;
	/** Just for historical reasons/migrations */
	limit_order_fee: Option<Collateral>;
	/** Just for historical reasons/migrations */
	staleness_seconds: Option<u32>;
}

/**
 * Helper struct to conveniently update Config
 *
 * For each field below, please see the corresponding {@link Config} field’s documentation.
 */
export interface ConfigUpdate {
	trading_fee_notional_size: Option<Decimal256>;
	trading_fee_counter_collateral: Option<Decimal256>;
	crank_execs: Option<u32>;
	max_leverage: Option<Number>;
	carry_leverage: Option<Decimal256>;
	funding_rate_sensitivity: Option<Decimal256>;
	funding_rate_max_annualized: Option<Decimal256>;
	borrow_fee_rate_min_annualized: Option<NumberGtZero>;
	borrow_fee_rate_max_annualized: Option<NumberGtZero>;
	mute_events: Option<boolean>;
	liquifunding_delay_seconds: Option<u32>;
	protocol_tax: Option<Decimal256>;
	unstake_period_seconds: Option<u32>;
	target_utilization: Option<NumberGtZero>;
	borrow_fee_sensitivity: Option<NumberGtZero>;
	max_xlp_rewards_multiplier: Option<NumberGtZero>;
	min_xlp_rewards_multiplier: Option<NumberGtZero>;
	delta_neutrality_fee_sensitivity: Option<NumberGtZero>;
	delta_neutrality_fee_cap: Option<NumberGtZero>;
	delta_neutrality_fee_tax: Option<Decimal256>;
	crank_fee_charged: Option<Usd>;
	crank_fee_surcharge: Option<Usd>;
	crank_fee_reward: Option<Usd>;
	minimum_deposit_usd: Option<Usd>;
	liquifunding_delay_fuzz_seconds: Option<u32>;
	max_liquidity: Option<MaxLiquidity>;
	disable_position_nft_exec: Option<boolean>;
	liquidity_cooldown_seconds: Option<u32>;
	spot_price: Option<SpotPriceConfigInit>;
	exposure_margin_ratio: Option<Decimal256>;
}

// Enums

/**
 * Maximum liquidity for deposit.
 *
 * Note that this limit can be exceeded due to changes in collateral asset price or impairment.
 */
export type MaxLiquidity =
	| {
		/** No bounds on how much liquidity can be deposited. */
		unlimited: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * Only allow the given amount in USD.
		 *
		 * The exchange rate at time of deposit will be used.
		 */
		usd: {
			/** Amount in USD */
			amount: NonZero<Usd>;
		};
	};
