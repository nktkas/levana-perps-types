// Time of last check: 2024-06-12

import {
	Addr,
	Collateral,
	DirectionToNotional,
	LeverageToBase,
	MaxGainsInQuote,
	NonZero,
	PriceBaseInQuote,
	TakeProfitTrader,
	Usd,
} from "../../prelude.d.ts";
import { Option } from "../../../rust.d.ts";

// ———————————————Structs———————————————

/** A limit order */
export interface LimitOrder {
	/** ID of the order */
	order_id: OrderId;
	/** Owner of the order */
	owner: Addr;
	/** Price where the order will trigger */
	trigger_price: PriceBaseInQuote;
	/** Deposit collateral */
	collateral: NonZero<Collateral>;
	/** Leverage */
	leverage: LeverageToBase;
	/** Direction of the position */
	direction: DirectionToNotional;
	/**
	 * @deprecated Use take_profit instead
	 *
	 * Maximum gains
	 */
	max_gains: Option<MaxGainsInQuote>;
	/** Stop loss price */
	stop_loss_override: Option<PriceBaseInQuote>;
	/** Take profit price */
	take_profit: Option<TakeProfitTrader>;
	/** Crank fee charged during deferred execution and placing the limit order */
	crank_fee_collateral: Collateral;
	/** Same as Self::crank_fee_collateral but cost-basis expressed in USD. */
	crank_fee_usd: Usd;
}

/** A unique numeric ID for each order in the protocol. */
export type OrderId = string;
