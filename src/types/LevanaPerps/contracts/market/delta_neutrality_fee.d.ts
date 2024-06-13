// Time of last check: 2024-06-12

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
	| "position-open"
	/** Update an existing position */
	| "position-update"
	/** Close a position */
	| "position-close";
