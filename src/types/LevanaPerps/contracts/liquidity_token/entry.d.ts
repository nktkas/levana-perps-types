// Time of last check: 2024-06-12

import { Binary, Uint128 } from "../../../cosmwasm.d.ts";
import { Expiration } from "../../../cw20.d.ts";
import { Option, u32 } from "../../../rust.d.ts";
import { MarketId, RawAddr } from "../../prelude.d.ts";
import { LiquidityTokenKind } from "./liquidity_token.d.ts";
import {
	AllAccountsResponse,
	AllAllowancesResponse,
	AllowanceResponse,
	AllSpenderAllowancesResponse,
	BalanceResponse,
	MarketingInfoResponse,
	TokenInfoResponse,
} from "../cw20/entry.d.ts";
import { ContractVersion } from "../../../cw2.d.ts";

// ———————————————Structs———————————————

/** Instantiate message for liquidity token proxy */
export interface InstantiateMsg {
	/** The factory address */
	factory: RawAddr;
	/** Unique market identifier, also used for `symbol` in ContractInfo response */
	market_id: MarketId;
	/** The liquidity token kind */
	kind: LiquidityTokenKind;
}

/** Placeholder migration message */
export interface MigrateMsg {
}

// ———————————————Enums———————————————

/** Execute message for liquidity token proxy */
export type ExecuteMsg =
	| {
		/** Transfer is a base message to move tokens to another account without triggering actions */
		transfer: {
			/** Recipient of the funds */
			recipient: RawAddr;
			/** Amount to transfer */
			amount: Uint128;
		};
	}
	| {
		/** Send is a base message to transfer tokens to a contract and trigger an action on the receiving contract. */
		send: {
			/** Contract to receive the funds */
			contract: RawAddr;
			/** Amount to send */
			amount: Uint128;
			/** Message to execute on the receiving contract */
			msg: Binary;
		};
	}
	| {
		/** Allows spender to access an additional amount tokens from the owner’s (env.sender) account. If expires is Some(), overwrites current allowance expiration with this one. */
		increase_allowance: {
			/** Who is allowed to spend */
			spender: RawAddr;
			/** Amount they can spend */
			amount: Uint128;
			/** When the allowance expires */
			expires?: Option<Expiration>;
		};
	}
	| {
		/** Lowers the spender’s access of tokens from the owner’s (env.sender) account by amount. If expires is Some(), overwrites current allowance expiration with this one. */
		decrease_allowance: {
			/** Whose spending to reduced */
			spender: RawAddr;
			/** Amount to reduce by */
			amount: Uint128;
			/** When the allowance should expire */
			expires?: Option<Expiration>;
		};
	}
	| {
		/** Transfers amount tokens from owner -> recipient if `env.sender` has sufficient pre-approval. */
		transfer_from: {
			/** Owner of the tokens being transferred */
			owner: RawAddr;
			/** Recipient of the tokens */
			recipient: RawAddr;
			/** Amount to send */
			amount: Uint128;
		};
	}
	| {
		/** Sends amount tokens from owner -> contract if env.sender has sufficient pre-approval. */
		send_from: {
			/** Owner of the tokens being transferred */
			owner: RawAddr;
			/** Contract to receive the funds */
			contract: RawAddr;
			/** Amount to send */
			amount: Uint128;
			/** Message to execute on the receiving contract */
			msg: Binary;
		};
	};

/** Query message for liquidity token proxy */
export type QueryMsg =
	| {
		/**
		 * The current balance of the given address, 0 if unset.
		 * @returns {BalanceResponse}
		 */
		balance: {
			/** Address whose balance to check */
			address: RawAddr;
		};
	}
	| {
		/**
		 * Returns metadata on the contract - name, decimals, supply, etc.
		 * @returns {TokenInfoResponse}
		 */
		token_info: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * Returns how much spender can use from owner account, 0 if unset.
		 * @returns {AllowanceResponse}
		 */
		allowance: {
			/** Owner of tokens */
			owner: RawAddr;
			/** Who is allowed to spend them */
			spender: RawAddr;
		};
	}
	| {
		/**
		 * Returns all allowances this owner has approved. Supports pagination.
		 * @returns {AllAllowancesResponse}
		 */
		all_allowances: {
			/** Owner of tokens */
			owner: RawAddr;
			/** Last spender we saw */
			start_after?: Option<RawAddr>;
			/** How many spenders to iterate on */
			limit?: Option<u32>;
		};
	}
	| {
		/**
		 * Returns all allowances this spender has been granted. Supports pagination.
		 * @returns {AllSpenderAllowancesResponse}
		 */
		all_spender_allowances: {
			/** Spender address */
			spender: RawAddr;
			/** Last owner we saw */
			start_after?: Option<RawAddr>;
			/** How many owners to iterate on */
			limit?: Option<u32>;
		};
	}
	| {
		/**
		 * Returns all accounts that have balances. Supports pagination.
		 * @returns {AllAccountsResponse}
		 */
		all_accounts: {
			/** Last owner we saw */
			start_after?: Option<RawAddr>;
			/** How many owners to iterate on */
			limit?: Option<u32>;
		};
	}
	| {
		/**
		 * Returns more metadata on the contract to display in the client:
		 * * description, logo, project url, etc.
		 * @returns {MarketingInfoResponse}
		 */
		marketing_info: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * @returns {ContractVersion}
		 */
		version: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * @returns {LiquidityTokenKind}
		 */
		kind: Record<string | number | symbol, never>;
	};
