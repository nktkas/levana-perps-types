// 0.1.0-beta.15
//
// Represents the native coin or CW20 used for collateral in a market.

import type { u8 } from "../rust.d.ts";
import type { RawAddr } from "./prelude.d.ts";

// ———————————————Enums———————————————

/**
 * The overall ideas of the Token API are:
 *
 * 1. use the Number type, not u128 or Uint128
 * 2. abstract over the Cw20/Native variants
 *
 * At the end of the day, call transfer/query with the same business logic as contract math and don’t worry at all about conversions or addresses/denoms
 */
export type Token =
	| {
		/** An asset controlled by a CW20 token. */
		cw20: {
			/** Address of the contract */
			addr: RawAddr;
			/** Decimals places used by the contract */
			decimal_places: u8;
		};
	}
	| {
		/** Native coin on the blockchain */
		native: {
			/** Native coin denom string */
			denom: string;
			/** Decimal places used by the asset */
			decimal_places: u8;
		};
	};

/** The number of decimal places for tokens may vary and there is a smart query cost for deriving it at runtime so we grab the info at init time and then store it as a full-fledged token */
export type TokenInit =
	| {
		/** A cw20 address. Decimal places will be derived. */
		cw20: {
			/** Address of the CW20 contract */
			addr: RawAddr;
		};
	}
	| {
		/** Native currency. May cover some IBC tokens too */
		native: {
			/** Denom used within the chain for this native coin */
			denom: string;
			/** Number of decimal points */
			decimal_places: u8;
		};
	};
