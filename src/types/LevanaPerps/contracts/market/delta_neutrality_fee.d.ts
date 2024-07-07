// 0.1.0-beta.15
//
// Events around the delta neutrality fee

import { Collateral, Signed } from "../../prelude.d.ts";

// ———————————————Structs———————————————

/** Event when a delta neutrality payment is made. */
export interface DeltaNeutralityFeeEvent {
	/** Amount of the fee. Negative means paid to trader. */
	amount: Signed<Collateral>;
	/** Fund size before */
	total_funds_before: Collateral;
	/** Fund size after */
	total_funds_after: Collateral;
	/** Action taken by trader */
	reason: DeltaNeutralityFeeReason;
	/** Amount taken for the protocol tax */
	protocol_amount: Collateral;
}

// ———————————————Enums———————————————

/** Action taken by trader to incur a delta neutrality fee */
export type DeltaNeutralityFeeReason =
	/** Open a new position */
	| "position_open"
	/** Update an existing position */
	| "position_update"
	/** Close a position */
	| "position_close";
