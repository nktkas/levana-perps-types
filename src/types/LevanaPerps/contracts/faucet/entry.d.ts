// Time of last check: 2024-06-12

import { Option, u32, u64, Vec } from "../../../rust.d.ts";
import { Addr, Decimal256, Number, RawAddr, Timestamp } from "../../prelude.d.ts";
import { Uint128 } from "../../../cosmwasm.d.ts";
import { Cw20Coin } from "../cw20/cw20.d.ts";
import { ContractVersion } from "../../../cw2.d.ts";

// ———————————————Structs———————————————

export interface ConfigResponse {
	admins: Vec<Addr>;
	/** Given in seconds */
	tap_limit: Option<u32>;
}

export interface FundsSentResponse {
	amount: Decimal256;
}

export interface GasAllowance {
	denom: string;
	amount: Uint128;
}

export interface InstantiateMsg {
	/** Given in seconds */
	tap_limit: Option<u32>;
	/** Code ID of the CW20 contract we’ll deploy */
	cw20_code_id: u64;
	/** Configuration of the gas coin allowance */
	gas_allowance: Option<GasAllowance>;
}

export interface IsAdminResponse {
	is_admin: boolean;
}

/** Placeholder migration message */
export interface MigrateMsg {
}

export interface MultitapRecipient {
	addr: RawAddr;
	assets: Vec<FaucetAsset>;
}

export interface NextTradingIndexResponse {
	next_index: u32;
}

export interface TappersResp {
	tappers: Vec<Addr>;
}

// ———————————————Enums———————————————

export type ExecuteMsg =
	| {
		tap: {
			assets: Vec<FaucetAsset>;
			recipient: RawAddr;
			amount?: Option<number>;
		};
	}
	| {
		multitap: {
			recipients: Vec<MultitapRecipient>;
		};
	}
	| {
		OwnerMsg: OwnerMsg;
	};

export type FaucetAsset =
	| { cw20: RawAddr }
	| { native: string };

export type GasAllowanceResp =
	| {
		enabled: {
			denom: string;
			amount: Uint128;
		};
	}
	| {
		disabled: Record<string | number | symbol, never>;
	};

export type GetTokenResponse =
	| {
		found: {
			address: Addr;
		};
	}
	| {
		not_found: Record<string | number | symbol, never>;
	};

export type IneligibleReason =
	| "too-soon"
	| "already-tapped";

export type OwnerMsg =
	| {
		add_admin: {
			admin: RawAddr;
		};
	}
	| {
		remove_admin: {
			admin: RawAddr;
		};
	}
	| {
		/** Given in seconds */
		set_tap_limit: {
			tap_limit: Option<u32>;
		};
	}
	| {
		set_tap_amount: {
			asset: FaucetAsset;
			amount: Number;
		};
	}
	| {
		deploy_token: {
			/** Name of the asset, used as both CW20 name and symbol. Example: `ATOM`. */
			name: string;
			tap_amount: Number;
			/**
			 * Each trading competition token for an asset is assigned an index to disambiguate them. It also makes it easier to find the token you just created with a deploy. These are intended to be monotonically increasing. When deploying a new trading competition token, consider using QueryMsg::NextTradingIndex to find the next available number.
			 *
			 * By providing None, you’re saying that you want to deploy an unrestricted token which can be tapped multiple times and be used with any contract.
			 */
			trading_competition_index: Option<u32>;
			initial_balances: Vec<Cw20Coin>;
		};
	}
	| {
		set_market_address: {
			name: string;
			trading_competition_index: u32;
			market: RawAddr;
		};
	}
	| {
		set_cw20_code_id: {
			cw20_code_id: u64;
		};
	}
	| {
		mint: {
			cw20: string;
			balances: Vec<Cw20Coin>;
		};
	}
	| {
		set_gas_allowance: {
			allowance: GasAllowance;
		};
	}
	| {
		clear_gas_allowance: Record<string | number | symbol, never>;
	}
	| {
		/** Set the tap amount for a named asset */
		set_multitap_amount: {
			name: string;
			amount: Decimal256;
		};
	};

export type QueryMsg =
	| {
		/**
		 * @returns {ContractVersion}
		 */
		version: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * @returns {ConfigResponse}
		 */
		config: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * @returns {GetTokenResponse}
		 */
		get_token: {
			name: string;
			trading_competition_index?: Option<u32>;
		};
	}
	| {
		/**
		 * Returns the next trading competition index we can use for the given asset name
		 * @returns {NextTradingIndexResponse}
		 */
		next_trading_index: {
			name: string;
		};
	}
	| {
		/**
		 * @returns {GasAllowanceResp}
		 */
		get_gas_allowance: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * @returns {TapEligibleResponse}
		 */
		is_tap_eligible: {
			addr: RawAddr;
			assets: Vec<FaucetAsset>;
		};
	}
	| {
		/**
		 * @returns {IsAdminResponse}
		 */
		is_admin: {
			addr: RawAddr;
		};
	}
	| {
		/**
		 * @returns {TapAmountResponse}
		 */
		tap_amount: {
			asset: FaucetAsset;
		};
	}
	| {
		/**
		 * @returns {TapAmountResponse}
		 */
		tapAmount_by_name: {
			name: string;
		};
	}
	| {
		/**
		 * Find out the cumulative amount of funds transferred at a given timestamp.
		 */
		funds_sent: {
			asset: FaucetAsset;
			timestamp?: Option<Timestamp>;
		};
	}
	| {
		/**
		 * Enumerate all wallets that tapped the faucet
		 */
		tappers: {
			start_after?: Option<RawAddr>;
			limit?: Option<u32>;
		};
	};

export type TapAmountResponse =
	| {
		cannot_tap: Record<string | number | symbol, never>;
	}
	| {
		can_tap: {
			amount: Decimal256;
		};
	};

export type TapEligibleResponse =
	| {
		eligible: Record<string | number | symbol, never>;
	}
	| {
		ineligible: {
			seconds: Decimal256;
			message: string;
			reason: IneligibleReason;
		};
	};
