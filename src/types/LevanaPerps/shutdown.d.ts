// 0.1.0-beta.15
//
// Types for market kill switch and winddown.
//
// These two mechanisms both allow authorized wallets to shut down parts of the protocol, either at a market level or the entire protocol. Therefore they share a set of types here.

// ———————————————Enums———————————————

/** Are we turning off these features or turning them back on? */
export type ShutdownEffect =
	/** Disable the given portion of the protocol */
	| "disable"
	/** Turn the given portion of the protocol back on */
	| "enable";

/** Which part of the protocol should be impacted */
export type ShutdownImpact =
	/**
	 * Ability to open new positions and update existing positions.
	 *
	 * Includes: updating trigger orders, creating limit orders.
	 */
	| "new_trades"
	/** Ability to close positions */
	| "close_positions"
	/** Any owner actions on the market */
	| "owner_actions"
	/** Deposit liquidity, including reinvesting yield */
	| "deposit_liquidity"
	/**
	 * Withdraw liquidity in any way
	 *
	 * Includes withdrawing, claiming yield
	 */
	| "withdraw_liquidity"
	/** Any activities around xLP staking */
	| "staking"
	/** Any activities around unstaking xLP, including collecting */
	| "unstaking"
	/** Transfers of positions tokens */
	| "transfer_positions"
	/** Transfers of liquidity tokens, both LP and xLP */
	| "transfer_lp"
	/** Setting the price */
	| "set_price"
	/** Transfer DAO fees */
	| "transfer_dao_fees"
	/** Turning the crank */
	| "crank"
	/** Setting manual price */
	| "set_manual_price";

/** Which wallet called the shutdown action? */
export type ShutdownWallet =
	/** The kill switch wallet */
	| "kill_switch"
	/** The wind down wallet */
	| "wind_down";
