// 0.1.0-beta.15
//
// Spot price data structures

import { PriceIdentifier } from "../../../pyth.d.ts";
import { Option, u32, Vec } from "../../../rust.d.ts";
import { Addr, NumberGtZero, RawAddr } from "../../prelude.d.ts";

// ———————————————Structs———————————————

/** Configuration for pyth */
export interface PythConfig {
	/** The address of the pyth oracle contract */
	contract_address: Addr;
	/** Which network to use for the price service This isn’t used for any internal logic, but clients must use the appropriate price service endpoint to match this */
	network: PythPriceServiceNetwork;
}

/** Configuration for pyth init messages */
export interface PythConfigInit {
	/** The address of the pyth oracle contract */
	contract_address: RawAddr;
	/** Which network to use for the price service This isn’t used for any internal logic, but clients must use the appropriate price service endpoint to match this */
	network: PythPriceServiceNetwork;
}

/** An individual feed used to compose a final spot price */
export interface SpotPriceFeed {
	/** The data for this price feed */
	data: SpotPriceFeedData;
	/** is this price feed inverted */
	inverted: boolean;
	/**
	 * Is this a volatile feed?
	 *
	 * Volatile feeds are expected to have frequent and significant price swings. By contrast, a non-volatile feed may be a redemption rate, which will slowly update over time. The purpose of volatility is to determine whether the publich time for a composite spot price should include the individual feed or not. For example, if we have a market like StakedETH_BTC, we would have a StakedETH redemption rate, the price of ETH, and the price of BTC. We’d mark ETH and BTC as volatile, and the redemption rate as non-volatile. Then the publish time would be the earlier of the ETH and BTC publish time.
	 *
	 * This field is optional. If omitted, it will use a default based on the `data` field, specifically: Pyth and Sei variants are considered volatile, Constant, Stride, and Simple are non-volatile.
	 */
	volatile: Option<boolean>;
}

/** An individual feed used to compose a final spot price */
export interface SpotPriceFeedInit {
	/** The data for this price feed */
	data: SpotPriceFeedDataInit;
	/** is this price feed inverted */
	inverted: boolean;
	/** See {@link SpotPriceFeed.volatile} */
	volatile: Option<boolean>;
}

/** Configuration for stride */
export interface StrideConfig {
	/** The address of the redemption rate contract */
	contract_address: Addr;
}

/** Configuration for stride */
export interface StrideConfigInit {
	/** The address of the redemption rate contract */
	contract_address: RawAddr;
}

// ———————————————Enums———————————————

/** Which network to use for the price service */
export type PythPriceServiceNetwork =
	/**
	 * Stable CosmWasm
	 *
	 * From https://pyth.network/developers/price-feed-ids#cosmwasm-stable
	 */
	| "stable"
	/**
	 * Edge CosmWasm
	 *
	 * From https://pyth.network/developers/price-feed-ids#cosmwasm-edge
	 */
	| "edge";

/** Spot price config */
export type SpotPriceConfig =
	| {
		/** Manual spot price */
		manual: {
			/** The admin address for manual spot price updates */
			admin: Addr;
		};
	}
	| {
		/** External oracle */
		oracle: {
			/** Pyth configuration, required on chains that use pyth feeds */
			pyth: Option<PythConfig>;
			/** Stride configuration, required on chains that use stride */
			stride: Option<StrideConfig>;
			/** sequence of spot price feeds which are composed to generate a single spot price */
			feeds: Vec<SpotPriceFeed>;
			/** if necessary, sequence of spot price feeds which are composed to generate a single USD spot price */
			feeds_usd: Vec<SpotPriceFeed>;
			/**
			 * How many seconds the publish time of volatile feeds are allowed to diverge from each other
			 *
			 * An attacker can, in theory, selectively choose two different publish times for a pair of assets and manipulate the combined price. This value allows us to say that the publish time cannot diverge by too much. As opposed to age tolerance, this allows for latency in getting transactions to land on-chain after publish time, and therefore can be a much tighter value.
			 *
			 * By default, we use 5 seconds.
			 */
			volatile_diff_seconds: Option<u32>;
		};
	};

/** Spot price config for initialization messages */
export type SpotPriceConfigInit =
	| {
		/** Manual spot price */
		manual: {
			/** The admin address for manual spot price updates */
			admin: RawAddr;
		};
	}
	| {
		/** External oracle */
		oracle: {
			/** Pyth configuration, required on chains that use pyth feeds */
			pyth: Option<PythConfigInit>;
			/** Stride configuration, required on chains that use stride feeds */
			stride: Option<StrideConfigInit>;
			/** sequence of spot price feeds which are composed to generate a single spot price */
			feeds: Vec<SpotPriceFeedInit>;
			/** if necessary, sequence of spot price feeds which are composed to generate a single USD spot price */
			feeds_usd: Vec<SpotPriceFeedInit>;
			/** See [SpotPriceConfig::volatile_diff_seconds] */
			volatile_diff_seconds: Option<u32>;
		};
	};

/** The data for an individual spot price feed */
export type SpotPriceFeedData =
	| {
		/** Hardcoded value */
		constant: {
			/** The constant price */
			price: NumberGtZero;
		};
	}
	| {
		/** Pyth price feeds */
		pyth: {
			/** The identifier on pyth */
			id: PriceIdentifier;
			/**
			 * price age tolerance, in seconds
			 *
			 * We thought about removing this parameter when moving to deferred execution. However, this would leave open a potential attack vector of opening limit orders or positions, shutting down price updates, and then selectively replaying old price updates for favorable triggers.
			 */
			age_tolerance_seconds: u32;
		};
	}
	| {
		/** Stride liquid staking */
		stride: {
			/** The IBC denom for the asset */
			denom: string;
			/** price age tolerance, in seconds */
			age_tolerance_seconds: u32;
		};
	}
	| {
		/** Native oracle module on the sei chain */
		sei: {
			/** The denom to use */
			denom: string;
		};
	}
	| {
		/** Simple contract with a QueryMsg::Price call */
		simple: {
			/** The contract to use */
			contract: Addr;
			/** price age tolerance, in seconds */
			age_tolerance_seconds: u32;
		};
	};

/** The data for an individual spot price feed */
export type SpotPriceFeedDataInit =
	| {
		/** Hardcoded value */
		constant: {
			/** The constant price */
			price: NumberGtZero;
		};
	}
	| {
		/** Pyth price feeds */
		pyth: {
			/** The identifier on pyth */
			id: PriceIdentifier;
			/** price age tolerance, in seconds */
			age_tolerance_seconds: u32;
		};
	}
	| {
		/** Stride liquid staking */
		stride: {
			/** The IBC denom for the asset */
			denom: string;
			/** price age tolerance, in seconds */
			age_tolerance_seconds: u32;
		};
	}
	| {
		/** Native oracle module on the sei chain */
		sei: {
			/** The denom to use */
			denom: string;
		};
	}
	| {
		/** Simple contract with a QueryMsg::Price call */
		simple: {
			/** The contract to use */
			contract: RawAddr;
			/** price age tolerance, in seconds */
			age_tolerance_seconds: u32;
		};
	};
