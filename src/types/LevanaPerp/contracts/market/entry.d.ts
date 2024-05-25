import { Config, ConfigUpdate } from "./config.d.ts";
import { DeferredExecId } from "./deferred_execution.d.ts";
import { LiquidityStats } from "./liquidity.d.ts";
import { LimitOrder, OrderId } from "./order.d.ts";
import { Option, u32, u64, Vec } from "../../../rust.d.ts";
import { ClosedPosition, PositionId } from "./position.d.ts";
import {
	Addr,
	Collateral,
	Decimal256,
	DirectionToBase,
	LeverageToBase,
	LpToken,
	MarketId,
	MarketType,
	MaxGainsInQuote,
	NonZero,
	Notional,
	Number,
	NumberGtZero,
	OrderInMessage,
	PriceBaseInQuote,
	PriceCollateralInUsd,
	PricePoint,
	RawAddr,
	Signed,
	TakeProfitTrader,
	Timestamp,
	Usd,
} from "../../prelude.d.ts";
import { Token, TokenInit } from "../../token.d.ts";
import { CrankWorkInfo } from "./crank.d.ts";
import { SpotPriceConfigInit } from "./spot_price.d.ts";
import { LiquidityTokenKind } from "../liquidity_token/liquidity_token.d.ts";
import { ExecuteMsg as PositionTokenExecuteMsg, QueryMsg as PositionTokenQueryMsg } from "../position_token/entry.d.ts";
import { ExecuteMsg as LiquidityTokenExecuteMsg, QueryMsg as LiquidityTokenQueryMsg } from "../liquidity_token/entry.d.ts";
import { Binary, BlockInfo, Uint128 } from "../../../cosmwasm.d.ts";

// Structs

/** A cursor used for paginating the closed position history */
export interface ClosedPositionCursor {
	/** Last close timestamp */
	time: Timestamp;
	/** Last closed position ID */
	position: PositionId;
}

/** Return value from QueryMsg::ClosedPositionHistory */
export interface ClosedPositionsResp {
	/** Closed positions */
	positions: ClosedPosition;
	/** the next cursor to start from if we’ve reached the end, it’s a None */
	cursor: Option<ClosedPositionCursor>;
}

/** Response for QueryMsg::DeltaNeutralityFee */
export interface DeltaNeutralityFeeResp {
	/** the amount charged */
	amount: Signed<Collateral>;
	/** the amount in the fund currently */
	fund_total: Collateral;
	/** Expected effective price after slippage, can be used for the slippage assert. */
	slippage_assert_price: PriceBaseInQuote;
}

/** Response for QueryMsg::DeltaNeutralityFee */
export interface DeltaNeutralityFeeResp {
	/** the amount charged */
	amount: Signed<Collateral>;
	/** the amount in the fund currently */
	fund_total: Collateral;
	/** Expected effective price after slippage, can be used for the slippage assert. */
	slippage_assert_price: PriceBaseInQuote;
}

/** History information on a limit order which was triggered. */
export interface ExecutedLimitOrder {
	/** The order itself */
	order: LimitOrder;
	/** The result of triggering the order */
	result: LimitOrderResult;
	/** When the order was triggered */
	timestamp: Timestamp;
}

/** Fees held within the market contract. */
export interface Fees {
	/** Fees available for individual wallets to withdraw. */
	wallets: Collateral;
	/** Fees available for the protocol overall to withdraw. */
	protocol: Collateral;
	/** Crank fees collected and waiting to be allocated to crankers. */
	crank: Collateral;
}

/** Initial price when instantiating a contract */
export interface InitialPrice {
	/** Price of base in terms of quote */
	price: PriceBaseInQuote;
	/** Price of collateral in terms of USD */
	price_usd: PriceCollateralInUsd;
}

/** The InstantiateMsg comes from Factory only */
export interface InstantiateMsg {
	/** The factory address */
	factory: RawAddr;
	/** Modifications to the default config value */
	config: Option<ConfigUpdate>;
	/** Mandatory spot price config */
	spot_price: SpotPriceConfigInit;
	/**
	 * Initial price to use in the contract
	 *
	 * This is required when doing manual price updates, and prohibited for oracle based price updates. It would make more sense to include this in SpotPriceConfigInit, but that will create more complications in config update logic.
	 */
	initial_price: Option<InitialPrice>;
	/** Base, quote, and market type */
	market_id: MarketId;
	/** The token used for collateral */
	token: TokenInit;
	/** Initial borrow fee rate when launching the protocol, annualized */
	initial_borrow_fee_rate: Decimal256;
}

/** Response for QueryMsg::LimitOrderHistory */
export interface LimitOrderHistoryResp {
	/** list of triggered limit orders that happened historically */
	orders: Vec<ExecutedLimitOrder>;
	/**
	 * Next start_after value to continue pagination
	 *
	 * None means no more pagination
	 */
	next_start_after: Option<string>;
}

/** Return value from QueryMsg::LimitOrder. */
export interface LimitOrderResp {
	/** The order identifier */
	order_id: OrderId;
	/** The price at which the order will trigger */
	trigger_price: PriceBaseInQuote;
	/** Amount of deposit collateral on the order */
	collateral: NonZero<Collateral>;
	/** Leverage to open the position at */
	leverage: LeverageToBase;
	/** Direction of the new position */
	direction: DirectionToBase;
	/** Max gains of the new position */
	max_gains: Option<MaxGainsInQuote>;
	/** Stop loss of the new position */
	stop_loss_override: Option<PriceBaseInQuote>;
	/** Take profit of the new position */
	take_profit: TakeProfitTrader;
}

/** Response for QueryMsg::LimitOrders */
export interface LimitOrdersResp {
	/** The list of limit orders */
	orders: Vec<LimitOrderResp>;
	/**
	 * Next start_after value to continue pagination
	 *
	 * None means no more pagination
	 */
	next_start_after: Option<OrderId>;
}

/** When a liquidity cooldown period will end */
export interface LiquidityCooldown {
	/** Timestamp when it will end */
	at: Timestamp;
	/** Number of seconds until it will end */
	seconds: u64;
}

/** A distinct lp history action */
export interface LpAction {
	/** Kind of action */
	kind: LpActionKind;
	/** When the action happened */
	timestamp: Timestamp;
	/** How many tokens were involved, if relevant */
	tokens: Option<LpToken>;
	/** Amount of collateral */
	collateral: Collateral;
	/** Value of that collateral in USD at the time */
	collateral_usd: Usd;
}

/** Response for QueryMsg::LpActionHistory */
export interface LpActionHistoryResp {
	/** list of earn actions that happened historically */
	actions: Vec<LpAction>;
	/**
	 * Next start_after value to continue pagination
	 *
	 * None means no more pagination
	 */
	next_start_after: Option<string>;
}

/** The summary for LP history */
export interface LpHistorySummary {
	/** How much collateral was deposited in total */
	deposit: Collateral;
	/** Value of the collateral in USD at time of deposit */
	deposit_usd: Usd;
	/** Cumulative yield claimed by the provider */
	yield: Collateral;
	/** Cumulative yield expressed in USD at time of claiming */
	yield_usd: Usd;
}

/** Returned by QueryMsg::LpInfo */
export interface LpInfoResp {
	/** This LP amount includes both actual LP tokens and xLP unstaked to LP but not yet collected. */
	lp_amount: LpToken;
	/** Collateral backing the LP tokens */
	lp_collateral: Collateral;
	/** This shows the balance of xLP minus any xLP already unstaked. */
	xlp_amount: LpToken;
	/** Collateral backing the xLP tokens */
	xlp_collateral: Collateral;
	/** Total available yield, sum of the available LP, xLP, and crank rewards. */
	available_yield: Collateral;
	/** Available yield from LP tokens */
	available_yield_lp: Collateral;
	/** Available yield from xLP tokens */
	available_yield_xlp: Collateral;
	/** Available crank rewards */
	available_crank_rewards: Collateral;
	/**
	 * Current status of an unstaking, if under way
	 *
	 * This will return `Some` from the time the provider begins an unstaking process until either:
	 * 1. They either cancel it, or
	 * 2. They unstake all request xLP into LP and collect that LP within the contract.
	 */
	unstaking: Option<UnstakingStatus>;
	/** Historical information on LP activity */
	history: LpHistorySummary;
	/** Liquidity cooldown information, if active. */
	liquidity_cooldown: Option<LiquidityCooldown>;
}

/** Config info passed on to all sub-contracts in order to add a new market. */
export interface NewMarketParams {
	/** Base, quote, and market type */
	market_id: MarketId;
	/** The token used for collateral */
	token: TokenInit;
	/** config */
	config: Option<ConfigUpdate>;
	/** mandatory spot price config */
	spot_price: SpotPriceConfigInit;
	/** Initial borrow fee rate, annualized */
	initial_borrow_fee_rate: Decimal256;
	/** Initial price, only provided for manual price updates */
	initial_price: Option<InitialPrice>;
}

/** Part of {@link OraclePriceResp} */
export interface OraclePriceFeedPythResp {
	/** The pyth price */
	price: NumberGtZero;
	/** The pyth lish time */
	lish_time: Timestamp;
	/** Is this considered a volatile feed? */
	volatile: boolean;
}

/** Part of {@link OraclePriceResp} */
export interface OraclePriceFeedSeiResp {
	/** The Sei price */
	price: NumberGtZero;
	/** The Sei lish time */
	lish_time: Timestamp;
	/** Is this considered a volatile feed? */
	volatile: boolean;
}

/** Part of {@link OraclePriceResp} */
export interface OraclePriceFeedSimpleResp {
	/** The price value */
	value: NumberGtZero;
	/** The block info when this price was set */
	block_info: BlockInfo;
	/** Optional timestamp for the price, independent of block_info.time */
	lish_time: Option<Timestamp>;
	/** Is this considered a volatile feed? */
	volatile: boolean;
}

/** Part of {@link OraclePriceResp} */
export interface OraclePriceFeedStrideResp {
	/** The redemption rate */
	redemption_rate: NumberGtZero;
	/** The redemption price lish time */
	lish_time: Timestamp;
	/** Is this considered a volatile feed? */
	volatile: boolean;
}

/** Response for QueryMsg::OraclePrice */
export interface OraclePriceResp {
	/** A map of each pyth id used in this market to the price and lish time */
	pyth: {
		[key: string]: OraclePriceFeedPythResp;
	};
	/** A map of each sei denom used in this market to the price */
	sei: {
		[key: string]: OraclePriceFeedSeiResp;
	};
	/** A map of each stride denom used in this market to the redemption price */
	stride: {
		[key: string]: OraclePriceFeedStrideResp;
	};
	/** A map of each simple contract used in this market to the contract price */
	simple: {
		[key: string]: OraclePriceFeedSimpleResp;
	};
	/** The final, composed price. See QueryMsg::OraclePrice for more information about this value */
	composed_price: PricePoint;
}

/** A distinct position history action */
export interface PositionAction {
	/**
	 * ID of the position impacted
	 *
	 * For ease of migration, we allow for a missing position ID.
	 */
	id: Option<PositionId>;
	/** Kind of action taken by the trader */
	kind: PositionActionKind;
	/** Timestamp when the action occurred */
	timestamp: Timestamp;
	/** Timestamp of the PricePoint used for this action, if relevant */
	price_timestamp: Option<Timestamp>;
	/** the amount of collateral at the time of the action */
	collateral: Collateral;
	/** The amount of collateral transferred to or from the trader */
	transfer_collateral: Signed<Collateral>;
	/** Leverage of the position at the time of the action, if relevant */
	leverage: Option<LeverageToBase>;
	/** max gains in quote */
	max_gains: Option<MaxGainsInQuote>;
	/** the trade fee in USD */
	trade_fee: Option<Usd>;
	/** The delta neutrality fee paid (or, if negative, received) in USD */
	delta_neutrality_fee: Option<Signed<Usd>>;
	/** If this is a position transfer, the previous owner. */
	old_owner: Option<Addr>;
	/** If this is a position transfer, the new owner. */
	new_owner: Option<Addr>;
	/** The take profit price set by the trader. For historical reasons this is optional, i.e. if the trader had set max gains price instead */
	take_profit_trader: Option<TakeProfitTrader>;
	/** The stop loss override, if set. */
	stop_loss_override: Option<PriceBaseInQuote>;
}

/** Response for QueryMsg::PositionActionHistory */
export interface PositionActionHistoryResp {
	/** list of position actions that happened historically */
	actions: Vec<PositionAction>;
	/**
	 * Next start_after value to continue pagination
	 *
	 * None means no more pagination
	 */
	next_start_after: Option<string>;
}

/** Use this price as the current price during a query. */
export interface PriceForQuery {
	/** Price of the base asset in terms of quote */
	base: PriceBaseInQuote;
	/**
	 * Price of the collateral asset in terms of USD
	 *
	 * This is optional if the notional asset is USD and required otherwise.
	 */
	collateral: PriceCollateralInUsd;
}

/** Would a price update trigger a liquidation/take profit/etc? */
export interface PriceWouldTriggerResp {
	/** Would a price update trigger a liquidation/take profit/etc? */
	would_trigger: boolean;
}

/**
 * There are two sources of slippage in the protocol:
 *
 * * Change in the oracle price from creation of the message to execution of the message.
 * * Change in delta neutrality fee from creation of the message to execution of the message. Slippage assert tolerance is the tolerance to the sum of the two sources of slippage.
 */
export interface SlippageAssert {
	/** Expected effective price from the sender. To incorporate tolerance on delta neutrality fee, the expected price should be modified by expected fee rate: `price = oracle_price * (1 + fee_rate)` `fee_rate` here is the ratio between the delta neutrality fee amount and notional size delta (in collateral asset). */
	price: PriceBaseInQuote;
	/** Max ratio tolerance of actual trade price differing in an unfavorable direction from expected price. Tolerance of 0.01 means max 1% difference */
	tolerance: Number;
}

/** Response for QueryMsg::SpotPriceHistory */
export interface SpotPriceHistoryResp {
	/** list of historical price points */
	price_points: Vec<PricePoint>;
}

/**
 * Overall market status information
 *
 * Returned from QueryMsg::Status
 */
export interface StatusResp {
	/** This market’s identifier */
	market_id: MarketId;
	/** Base asset */
	base: string;
	/** Quote asset */
	quote: string;
	/** Type of market */
	market_type: MarketType;
	/** The asset used for collateral within the system */
	collateral: Token;
	/** Config for this market */
	config: Config;
	/** Current status of the liquidity pool */
	liquidity: LiquidityStats;
	/** Next bit of crank work available, if any */
	next_crank: Option<CrankWorkInfo>;
	/** Timestamp of the last completed crank */
	last_crank_completed: Option<Timestamp>;
	/** Earliest deferred execution price timestamp needed */
	next_deferred_execution: Option<Timestamp>;
	/** Latest deferred execution price timestamp needed */
	newest_deferred_execution: Option<Timestamp>;
	/** Next liquifunding work item timestamp */
	next_liquifunding: Option<Timestamp>;
	/** Number of work items sitting in the deferred execution queue */
	deferred_execution_items: u32;
	/** Last processed deferred execution ID, if any */
	last_processed_deferred_exec_id: Option<DeferredExecId>;
	/** Overall borrow fee rate (annualized), combining LP and xLP */
	borrow_fee: Decimal256;
	/** LP component of Self::borrow_fee */
	borrow_fee_lp: Decimal256;
	/** xLP component of Self::borrow_fee */
	borrow_fee_xlp: Decimal256;
	/** Long funding rate (annualized) */
	long_funding: Number;
	/** Short funding rate (annualized) */
	short_funding: Number;
	/** Total long interest, given in the notional asset. */
	long_notional: Notional;
	/** Total short interest, given in the notional asset. */
	short_notional: Notional;
	/** Total long interest, given in USD, converted at the current exchange rate. */
	long_usd: Usd;
	/** Total short interest, given in USD, converted at the current exchange rate. */
	short_usd: Usd;
	/**
	 * Instant delta neutrality fee value
	 *
	 * This is based on net notional and the sensitivity parameter
	 */
	instant_delta_neutrality_fee_value: Signed<Decimal256>;
	/** Amount of collateral in the delta neutrality fee fund. */
	delta_neutrality_fee_fund: Collateral;
	/** Fees held by the market contract */
	fees: Fees;
}

/** The summary for trade history */
export interface TradeHistorySummary {
	/** Given in usd */
	trade_volume: Usd;
	/** Given in usd */
	realized_pnl: Signed<Usd>;
}

/** Response for QueryMsg::TraderActionHistory */
export interface TraderActionHistoryResp {
	/** list of position actions that this trader performed */
	actions: Vec<PositionAction>;
	/**
	 * Next start_after value to continue pagination
	 *
	 * None means no more pagination
	 */
	next_start_after: Option<string>;
}

/** Status of an ongoing unstaking process. */
export interface UnstakingStatus {
	/** When the unstaking began */
	start: Timestamp;
	/** This will be in the future if unstaking is incomplete */
	end: Timestamp;
	/**
	 * Total amount requested to be unstaked
	 *
	 * Note that this value must be the sum of collected, available, and pending.
	 */
	xlp_unstaking: NonZero<LpToken>;
	/** Collateral, at current exchange rate, underlying the UnstakingStatus::xlp_unstaking */
	xlp_unstaking_collateral: Collateral;
	/** Total amount of LP tokens that have been unstaked and collected */
	collected: LpToken;
	/** Total amount of LP tokens that have been unstaked and not yet collected */
	available: LpToken;
	/** Total amount of xLP tokens that are still pending unstaking */
	pending: LpToken;
}

// Enums

/** Execute message for the market contract */
export type ExecuteMsg =
	| {
		/** Owner-only executions */
		owner: ExecuteOwnerMsg;
	}
	| {
		/** cw20 */
		receive: {
			/** Owner of funds sent to the contract */
			sender: RawAddr;
			/** Amount of funds sent */
			amount: Uint128;
			/** Must parse to a ExecuteMsg */
			msg: Binary;
		};
	}
	| {
		/** Open a new position */
		open_position: {
			/** Assertion that the price has not moved too far */
			slippage_assert: Option<SlippageAssert>;
			/** Leverage of new position */
			leverage: LeverageToBase;
			/** Direction of new position */
			direction: DirectionToBase;
			/** Maximum gains of new position */
			max_gains: Option<MaxGainsInQuote>;
			/** Stop loss price of new position */
			stop_loss_override: Option<PriceBaseInQuote>;
			/** Take profit price of new position if max_gains is `None`, this must be `Some` */
			take_profit: Option<TakeProfitTrader>;
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
		/** Update the stop loss price of a position */
		update_position_stop_loss_price: {
			/** ID of position to update */
			id: PositionId;
			/** New stop loss price of the position, or remove */
			stop_loss: StopLoss;
		};
	}
	| {
		/** Set a stop loss or take profit override. Deprecated, use UpdatePositionStopLossPrice instead */
		set_trigger_order: {
			/** ID of position to modify */
			id: PositionId;
			/** New stop loss price of the position Passing None will remove the override. */
			stop_loss_override: Option<PriceBaseInQuote>;
			/** New take profit price of the position, merely as a trigger. Passing None will bypass changing this This does not affect the locked up counter collateral (or borrow fees etc.). if this override is further away than the position’s take profit price, the position’s will be triggered first if you want to update the position itself, use ExecuteMsg::UpdatePositionTakeProfitPrice */
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
			/** Maximum gains of new position */
			max_gains: Option<MaxGainsInQuote>;
			/** Stop loss price of new position */
			stop_loss_override: Option<PriceBaseInQuote>;
			/** Take profit price of new position if max_gains is `None`, this must be `Some` */
			take_profit: Option<TakeProfitTrader>;
		};
	}
	| {
		/** Cancel an open limit order */
		cancel_limit_order: {
			/** ID of the order */
			order_id: OrderId;
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
		/** Deposits send funds into the unlocked liquidity fund Returns [LiquidityDepositResponseData] as response data */
		deposit_liquidity: {
			/**
			 * Should we stake the resulting LP tokens into xLP?
			 *
			 * Defaults to `false`.
			 */
			stake_to_xlp: boolean;
		};
	}
	| {
		/** Like ExecuteMsg::DepositLiquidity, but reinvests pending yield instead of receiving new funds. */
		reinvest_yield: {
			/**
			 * Should we stake the resulting LP tokens into xLP?
			 *
			 * Defaults to `false`.
			 */
			stake_to_xlp: boolean;
			/**
			 * Amount of rewards to reinvest.
			 *
			 * If `None`, reinvests all pending rewards.
			 */
			amount: Option<NonZero<Collateral>>;
		};
	}
	| {
		/** Withdraw liquidity calculated from specified lp_amount */
		withdraw_liquidity: {
			/** Amount of LP tokens to burn */
			lp_amount: Option<NonZero<LpToken>>;
		};
	}
	| {
		/** Claims accrued yield based on LP share allocation */
		claim_yield: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * Stake some existing LP tokens into xLP
		 *
		 * None means stake all LP tokens.
		 */
		stake_lp: {
			/** Amount of LP tokens to convert into xLP. */
			amount: Option<NonZero<LpToken>>;
		};
	}
	| {
		/**
		 * Begin unstaking xLP into LP
		 *
		 * None means unstake all xLP tokens.
		 */
		unstake_xlp: {
			/** Amount of xLP tokens to convert into LP */
			amount: Option<NonZero<LpToken>>;
		};
	}
	| {
		/** Stop an ongoing xLP unstaking process. */
		stop_unstaking_xlp: Record<string | number | symbol, never>;
	}
	| {
		/** Collect any LP tokens that have been unstaked from xLP. */
		collect_unstaked_lp: Record<string | number | symbol, never>;
	}
	| {
		/** Crank a number of times */
		crank: {
			/** Total number of crank executions to do None: config default */
			execs: Option<u32>;
			/**
			 * Which wallet receives crank rewards.
			 *
			 * If unspecified, sender receives the rewards.
			 */
			rewards: Option<RawAddr>;
		};
	}
	| {
		/** Nft proxy messages. Only allowed to be called by this market’s position_token contract */
		nft_proxy: {
			/** Original caller of the NFT proxy. */
			sender: RawAddr;
			/** Message sent to the NFT proxy */
			msg: PositionTokenExecuteMsg;
		};
	}
	| {
		/** liquidity token cw20 proxy messages. Only allowed to be called by this market’s liquidity_token contract */
		liquidity_token_proxy: {
			/** Original caller of the liquidity token proxy. */
			sender: RawAddr;
			/** Whether this was the LP or xLP proxy. */
			kind: LiquidityTokenKind;
			/** Message sent to the liquidity token proxy. */
			msg: LiquidityTokenExecuteMsg;
		};
	}
	| {
		/** Transfer all available protocol fees to the dao account */
		transfer_dao_fees: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * Begin force-closing all positions in the protocol.
		 *
		 * This can only be performed by the market wind down wallet.
		 */
		close_all_positions: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * Provide funds directly to the crank fees.
		 *
		 * The person who calls this receives no benefits. It’s intended for the DAO to use to incentivize cranking.
		 */
		provide_crank_funds: Record<string | number | symbol, never>;
	}
	| {
		/** Set manual price (mostly for testing) */
		set_manual_price: {
			/** Price of the base asset in terms of the quote. */
			price: PriceBaseInQuote;
			/**
			 * Price of the collateral asset in terms of USD.
			 *
			 * This is generally used for reporting of values like PnL and trade volume.
			 */
			price_usd: PriceCollateralInUsd;
		};
	}
	| {
		/**
		 * Perform a deferred exec
		 *
		 * This should only ever be called from the market contract itself, any other call is guaranteed to fail.
		 */
		perform_deferred_exec: {
			/** Which ID to execute */
			id: DeferredExecId;
			/** Which price point to use for this execution. */
			price_point_timestamp: Timestamp;
		};
	};

/** Owner-only messages */
export type ExecuteOwnerMsg = {
	/** Update the config */
	config_update: {
		/** New configuration parameters */
		update: ConfigUpdate;
	};
};

/** The result of triggering a limit order */
export type LimitOrderResult =
	| {
		/** Position was opened successfully */
		success: {
			/** New position ID */
			position: PositionId;
		};
	}
	| {
		/** Position failed to open */
		failure: {
			/** Error message */
			reason: string;
		};
	};

/** Kind of action for a {@link LpAction}. */
export type LpActionKind =
	/** via ExecuteMsg::DepositLiquidity */
	| "deposit-lp"
	/** via ExecuteMsg::DepositLiquidity */
	| "deposit-xlp"
	/** via ExecuteMsg::ReinvestYield */
	| "reinvest-yield-lp"
	/** via ExecuteMsg::ReinvestYield */
	| "reinvest-yield-xlp"
	/** via ExecuteMsg::UnstakeXlp the amount of collateral is determined by the time they send their message ExecuteMsg::CollectUnstakedLp is not accounted for here */
	| "unstake-xlp"
	/** Some amount of unstaked LP has been collected into actual LP. */
	| "collect-lp"
	/** via ExecuteMsg::WithdrawLiquidity */
	| "withdraw"
	/** via ExecuteMsg::ClaimYield */
	| "claim-yield";

/** Action taken by trader for a {@link PositionAction} */
export type PositionActionKind =
	/** Open a new position */
	| "open"
	/** Updated an existing position */
	| "update"
	/** Close a position */
	| "close"
	/** Position was transferred between wallets */
	| "transfer";

/** When querying an open position, how do we calculate PnL vis-a-vis fees? */
export type PositionsQueryFeeApproach =
	/** Do not include any pending fees */
	| "no-fees"
	/** Include accumulated fees (borrow and funding rates), but do not include future fees (specifically DNF). */
	| "accumulated"
	/**
	 * Include the DNF fee in addition to accumulated fees.
	 *
	 * This gives an idea of “what will be my PnL if I close my position right now.” To keep compatibility with previous contract APIs, this is the default behavior. However, going forward, `Accumulated` should be preferred, and will eventually become the default.
	 */
	| "all-fees";

/** Query messages on the market contract */
export type QueryMsg =
	| {
		/**
		 * @returns {ContractVersion}
		 */
		version: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * Provides overall information about this market.
		 *
		 * This is intended as catch-all for protocol wide information, both static (like market ID) and dynamic (like notional interest). The goal is to limit the total number of queries callers have to make to get relevant information.
		 * @returns {StatusResp}
		 */
		status: {
			/** Price to be used as the current price */
			price: Option<PriceForQuery>;
		};
	}
	| {
		/**
		 * Gets the spot price, if no time is supplied, then it’s current This is the spot price as seen by the contract storage i.e. the price that was pushed via execution messages
		 * @returns {PricePoint}
		 */
		spot_price: {
			/**
			 * Timestamp when the price should be effective.
			 *
			 * None means “give the most recent price.”
			 */
			timestamp: Option<Timestamp>;
		};
	}
	| {
		/**
		 * Gets a collection of historical spot prices
		 * @returns {SpotPriceHistoryResp}
		 */
		spot_price_history: {
			/** Last timestamp we saw */
			start_after: Option<Timestamp>;
			/** How many prices to query */
			limit: Option<u32>;
			/** Order to sort by, if None then it will be descending */
			order: Option<OrderInMessage>;
		};
	}
	| {
		/**
		 * Gets the current price from the oracle (for markets configured with an oracle)
		 *
		 * Also returns prices for each feed used to compose the final price
		 *
		 * This may be more up-to-date than the spot price which was validated and pushed into the contract storage via execution messages
		 * @returns {OraclePriceResp}
		 */
		oracle_price: {
			validate_age: boolean;
		};
	}
	| {
		/**
		 * Maps the given PositionIds into Positions
		 * @returns {PositionsResp}
		 */
		positions: {
			/** Positions to query. */
			position_ids: Vec<PositionId>;
			/**
			 * Should we skip calculating pending fees?
			 *
			 * This field is ignored if `fees` is set.
			 *
			 * The default for this field is `false`. The behavior of this field is:
			 *
			 * * `true`: the same as PositionsQueryFeeApproach::NoFees
			 * * `false`: the same as PositionsQueryFeeApproach::AllFees (though see note on that variant, this default will likely change in the future).
			 *
			 * It is recommended not to use this field going forward, and to instead use `fees`.
			 */
			skip_calc_pending_fees: Option<boolean>;
			/**
			 * How do we calculate fees for this position?
			 *
			 * Any value here will override the `skip_calc_pending_fees` field.
			 */
			fees: Option<PositionsQueryFeeApproach>;
			/** Price to be used as the current price */
			price: Option<PriceForQuery>;
		};
	}
	| {
		/**
		 * Returns the specified Limit Order
		 * @returns {LimitOrderResp}
		 */
		limit_order: {
			/** Limit order ID to query */
			order_id: OrderId;
		};
	}
	| {
		/**
		 * Returns the Limit Orders for the specified addr
		 * @returns {LimitOrdersResp}
		 */
		limit_orders: {
			/** Owner of limit orders */
			owner: RawAddr;
			/** Last limit order seen */
			start_after: Option<OrderId>;
			/** Number of order to return */
			limit: Option<u32>;
			/** Whether to return ascending or descending */
			order: Option<OrderInMessage>;
		};
	}
	| {
		/**
		 * @returns {ClosedPositionsResp}
		 */
		closed_position_history: {
			/** Owner of the positions to get history for */
			owner: RawAddr;
			/** Cursor to start from, for pagination */
			cursor: Option<ClosedPositionCursor>;
			/** limit pagination */
			limit: Option<u32>;
			/** order is default Descending */
			order: Option<OrderInMessage>;
		};
	}
	| {
		/**
		 * Nft proxy messages. Not meant to be called directly but rather for internal cross-contract calls
		 *
		 * however, these are merely queries, and can be called by anyone and clients may take advantage of this to save query gas by calling the market directly
		 * @returns [cosmwasm_std::QueryResponse]
		 */
		nft_proxy: {
			/** NFT message to process */
			nft_msg: PositionTokenQueryMsg;
		};
	}
	| {
		/**
		 * Liquidity token cw20 proxy messages. Not meant to be called directly but rather for internal cross-contract calls
		 *
		 * however, these are merely queries, and can be called by anyone and clients may take advantage of this to save query gas by calling the market directly
		 * @returns [cosmwasm_std::QueryResponse]
		 */
		liquidity_token_proxy: {
			/** Whether to query LP or xLP tokens */
			kind: LiquidityTokenKind;
			/** Query to run */
			msg: LiquidityTokenQueryMsg;
		};
	}
	| {
		/**
		 * @returns {TradeHistorySummary} for a given wallet addr
		 */
		trade_history_summary: {
			/** Which wallet’s history are we querying? */
			addr: RawAddr;
		};
	}
	| {
		/**
		 * @returns {PositionActionHistoryResp}
		 */
		position_action_history: {
			/** Which position’s history are we querying? */
			id: PositionId;
			/** Last action ID we saw */
			start_after: Option<string>;
			/** How many actions to query */
			limit: Option<u32>;
			/** Order to sort by */
			order: Option<OrderInMessage>;
		};
	}
	| {
		/**
		 * Actions taken by a trader.
		 *
		 * Similar to Self::PositionActionHistory, but provides all details for an individual trader, not an individual position.
		 * @returns {TraderActionHistoryResp}
		 */
		trader_action_history: {
			/** Which trader’s history are we querying? */
			owner: RawAddr;
			/** Last action ID we saw */
			start_after: Option<string>;
			/** How many actions to query */
			limit: Option<u32>;
			/** Order to sort by */
			order: Option<OrderInMessage>;
		};
	}
	| {
		/**
		 * @returns {LpActionHistoryResp}
		 */
		lp_action_history: {
			/** Which provider’s history are we querying? */
			addr: RawAddr;
			/** Last action ID we saw */
			start_after: Option<string>;
			/** How many actions to query */
			limit: Option<u32>;
			/** Order to sort by */
			order: Option<OrderInMessage>;
		};
	}
	| {
		/**
		 * Provides information on triggered limit orders.
		 * @returns {LimitOrderHistoryResp}
		 */
		limit_order_history: {
			/** Trader’s address for history we are querying */
			addr: RawAddr;
			/** Last order ID we saw */
			start_after: Option<string>;
			/** How many orders to query */
			limit: Option<u32>;
			/** Order to sort the order IDs by */
			order: Option<OrderInMessage>;
		};
	}
	| {
		/**
		 * Provides the data needed by the earn page.
		 * @returns {LpInfoResp}
		 */
		lp_info: {
			/** Which provider’s information are we querying? */
			liquidity_provider: RawAddr;
		};
	}
	| {
		/**
		 * Gets the delta neutrality fee at the current price, for a given change in terms of net notional
		 * @returns {DeltaNeutralityFeeResp}
		 */
		delta_neutrality_fee: {
			/** the amount of notional that would be changed */
			notional_delta: Signed<Notional>;
			/** for real delta neutrality fees, this is calculated internally should only be supplied if querying the fee for close or update */
			pos_delta_neutrality_fee_margin: Option<Collateral>;
		};
	}
	| {
		/**
		 * Check if a price update would trigger a liquidation/take profit/etc.
		 * @returns {PriceWouldTriggerResp}
		 */
		price_would_trigger: {
			/** The new price of the base asset in terms of quote */
			price: PriceBaseInQuote;
		};
	}
	| {
		/**
		 * Enumerate deferred execution work items for the given trader.
		 *
		 * Always begins enumeration from the most recent.
		 * @returns {ListDeferredExecsResp}
		 */
		list_deferred_execs: {
			/** Trader wallet address */
			addr: RawAddr;
			/** Previously seen final ID. */
			start_after: Option<DeferredExecId>;
			/** How many items to request per batch. */
			limit: Option<u32>;
		};
	}
	| {
		/**
		 * Get a single deferred execution item, if available.
		 * @returns {GetDeferredExecResp}
		 */
		get_deferred_exec: {
			/** ID */
			id: DeferredExecId;
		};
	};

/** Stop loss configuration */
export type StopLoss =
	/** Remove stop loss price for the position */
	| "remove"
	| {
		/** Set the stop loss price for the position */
		price: PriceBaseInQuote;
	};
