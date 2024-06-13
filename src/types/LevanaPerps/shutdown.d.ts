// Time of last check: 2024-06-08

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
	| "new-trades"
	/** Ability to close positions */
	| "close-positions"
	/** Any owner actions on the market */
	| "owner-actions"
	/** Deposit liquidity, including reinvesting yield */
	| "deposit-liquidity"
	/**
	 * Withdraw liquidity in any way
	 *
	 * Includes withdrawing, claiming yield
	 */
	| "withdraw-liquidity"
	/** Any activities around xLP staking */
	| "staking"
	/** Any activities around unstaking xLP, including collecting */
	| "unstaking"
	/** Transfers of positions tokens */
	| "transfer-positions"
	/** Transfers of liquidity tokens, both LP and xLP */
	| "transfer-lp"
	/** Setting the price */
	| "set-price"
	/** Transfer DAO fees */
	| "transfer-dao-fees"
	/** Turning the crank */
	| "crank"
	/** Setting manual price */
	| "set-manual-price";

/** Which wallet called the shutdown action? */
export type ShutdownWallet =
	/** The kill switch wallet */
	| "kill-switch"
	/** The wind down wallet */
	| "wind-down";
