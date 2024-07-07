// 0.1.0-beta.15
//
// Messages for the perps liquidity token contract.
// The liquidity token is a proxy providing a CW20 interface for the LP and xLP balances within a single market.

// ———————————————Enums———————————————

/** The kind of liquidity token */
export type LiquidityTokenKind =
	/** LP token */
	| "lp"
	/** xLP token */
	| "xlp";
