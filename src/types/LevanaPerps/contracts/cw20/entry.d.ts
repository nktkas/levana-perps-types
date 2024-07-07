// 0.1.0-beta.15
//
// Entrypoint messages for the CW20 contract.

import { Binary, Uint128 } from "../../../cosmwasm.d.ts";
import { Expiration } from "../../../cw20.d.ts";
import { Option, u32, u8, Vec } from "../../../rust.d.ts";
import { Addr, RawAddr } from "../../prelude.d.ts";
import { Cw20Coin } from "./cw20.d.ts";
import { ContractVersion } from "../../../cw2.d.ts";

// ———————————————Structs———————————————

export interface AllAccountsResponse {
	accounts: Vec<Addr>;
}

export interface AllAllowancesResponse {
	allowances: Vec<AllowanceInfo>;
}

export interface AllSpenderAllowancesResponse {
	allowances: Vec<SpenderAllowanceInfo>;
}

export interface AllowanceInfo {
	spender: Addr;
	allowance: Uint128;
	expires: Expiration;
}

export interface AllowanceResponse {
	allowance: Uint128;
	expires: Expiration;
}

export interface BalanceResponse {
	balance: Uint128;
}

/** When we download an embedded logo, we get this response type. We expect a SPA to be able to accept this info and display it. */
export interface DownloadLogoResponse {
	mime_type: string;
	data: Binary;
}

export interface InstantiateMarketingInfo {
	project: Option<string>;
	description: Option<string>;
	marketing: Option<Addr>;
	logo: Option<Logo>;
}

export interface InstantiateMinter {
	minter: RawAddr;
	cap: Option<Uint128>;
}

export interface InstantiateMsg {
	name: string;
	symbol: string;
	decimals: u8;
	initial_balances: Vec<Cw20Coin>;
	/** We make this mandatory since we always need an owner for these CW20s. */
	minter: InstantiateMinter;
	marketing: Option<InstantiateMarketingInfo>;
}

export interface MarketingInfoResponse {
	/** A URL pointing to the project behind this token. */
	project: Option<string>;
	/** A longer description of the token and it’s utility. Designed for tooltips or such */
	description: Option<string>;
	/** A link to the logo, or a comment there is an on-chain logo stored */
	logo: Option<LogoInfo>;
	/** The address (if any) who can update this data structure */
	marketing: Option<Addr>;
}

/** Placeholder migration message */
export interface MigrateMsg {}

export interface MinterResponse {
	minter: Addr;
	/** cap is a hard cap on total supply that can be achieved by minting. Note that this refers to total_supply. If None, there is unlimited cap. */
	cap: Option<Uint128>;
}

export interface SpenderAllowanceInfo {
	owner: Addr;
	allowance: Uint128;
	expires: Expiration;
}

export interface TokenInfoResponse {
	name: string;
	symbol: string;
	decimals: u8;
	total_supply: Uint128;
}

// ———————————————Enums———————————————

/** This is used to store the logo on the blockchain in an accepted format. Enforce maximum size of 5KB on all variants. */
export type EmbeddedLogo =
	| {
		/**
		 * Store the Logo as an SVG file. The content must conform to the spec at https://en.wikipedia.org/wiki/Scalable_Vector_Graphics
		 *
		 * (The contract should do some light-weight sanity-check validation)
		 */
		svg: Binary;
	}
	| {
		/** Store the Logo as a PNG file. This will likely only support up to 64x64 or so within the 5KB limit. */
		png: Binary;
	};

export type ExecuteMsg =
	| {
		/** Transfer is a base message to move tokens to another account without triggering actions */
		transfer: {
			recipient: RawAddr;
			amount: Uint128;
		};
	}
	| {
		/** Burn is a base message to destroy tokens forever */
		burn: {
			amount: Uint128;
		};
	}
	| {
		/** Send is a base message to transfer tokens to a contract and trigger an action on the receiving contract. */
		send: {
			contract: RawAddr;
			amount: Uint128;
			msg: Binary;
		};
	}
	| {
		/** Allows spender to access an additional amount tokens from the owner’s (env.sender) account. If expires is Some(), overwrites current allowance expiration with this one. */
		increase_allowance: {
			spender: RawAddr;
			amount: Uint128;
			expires?: Option<Expiration>;
		};
	}
	| {
		/** Lowers the spender’s access of tokens from the owner’s (env.sender) account by amount. If expires is Some(), overwrites current allowance expiration with this one. */
		decrease_allowance: {
			spender: RawAddr;
			amount: Uint128;
			expires?: Option<Expiration>;
		};
	}
	| {
		/** Transfers amount tokens from owner -> recipient if `env.sender` has sufficient pre-approval. */
		transfer_from: {
			owner: RawAddr;
			recipient: RawAddr;
			amount: Uint128;
		};
	}
	| {
		/** Sends amount tokens from owner -> contract if `env.sender` has sufficient pre-approval. */
		send_from: {
			owner: RawAddr;
			contract: RawAddr;
			amount: Uint128;
			msg: Binary;
		};
	}
	| {
		/** Destroys tokens forever */
		burn_from: {
			owner: RawAddr;
			amount: Uint128;
		};
	}
	| {
		/** If authorized, creates amount new tokens and adds to the recipient balance. */
		mint: {
			recipient: RawAddr;
			amount: Uint128;
		};
	}
	| {
		/**
		 * This variant is according to spec. The current minter may set a new minter. Setting the minter to None will remove the token’s minter forever. there is deliberately not a way to set the proprietary MinterKind so the only way to set the minter to MinterKind::MarketId is at instantiation
		 *
		 * Note: we require that there always be a minter, so this is not optional!
		 */
		update_minter: {
			new_minter: RawAddr;
		};
	}
	| {
		/** If authorized, updates marketing metadata. Setting None/null for any of these will leave it unchanged. Setting Some(“”) will clear this field on the contract storage */
		update_marketing: {
			/** A URL pointing to the project behind this token. */
			project?: Option<string>;
			/** A longer description of the token and it’s utility. Designed for tooltips or such */
			description?: Option<string>;
			/** The address (if any) who can update this data structure */
			marketing?: Option<string>;
		};
	}
	| {
		/** If set as the “marketing” role on the contract, upload a new URL, SVG, or PNG for the token */
		upload_logo: Logo;
	}
	| {
		/** Set factory addr */
		set_market: {
			addr: RawAddr;
		};
	};

/** This is used for uploading logo data, or setting it in InstantiateData */
export type Logo =
	| {
		/** A reference to an externally hosted logo. Must be a valid HTTP or HTTPS URL. */
		url: string;
	}
	| {
		/** Logo content stored on the blockchain. Enforce maximum size of 5KB on all variants */
		embedded: EmbeddedLogo;
	};

/** This is used to display logo info, provide a link or inform there is one that can be downloaded from the blockchain itself */
export type LogoInfo =
	| {
		/** A reference to an externally hosted logo. Must be a valid HTTP or HTTPS URL. */
		url: string;
	}
	/** There is an embedded logo on the chain, make another call to download it. */
	| "embedded";

export type QueryMsg =
	| {
		/**
		 * The current balance of the given address, 0 if unset.
		 * @returns {BalanceResponse}
		 */
		balance: {
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
		 * Returns who can mint and the hard cap on maximum tokens after minting.
		 * @returns {MinterResponse}
		 */
		minter: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * Returns how much spender can use from owner account, 0 if unset.
		 * @returns {AllowanceResponse}
		 */
		allowance: {
			owner: RawAddr;
			spender: RawAddr;
		};
	}
	| {
		/**
		 * Returns all allowances this owner has approved. Supports pagination.
		 * @returns {AllAllowancesResponse}
		 */
		all_allowances: {
			owner: RawAddr;
			start_after?: Option<RawAddr>;
			limit?: Option<u32>;
		};
	}
	| {
		/**
		 * Returns all allowances this spender has been granted. Supports pagination.
		 * @returns {AllSpenderAllowancesResponse}
		 */
		all_spender_allowances: {
			spender: RawAddr;
			start_after?: Option<RawAddr>;
			limit?: Option<u32>;
		};
	}
	| {
		/**
		 * Returns all accounts that have balances. Supports pagination.
		 * @returns {AllAccountsResponse}
		 */
		all_accounts: {
			start_after?: Option<RawAddr>;
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
		 * Downloads the embedded logo data (if stored on chain). Errors if no logo data is stored for this contract.
		 * @returns {DownloadLogoResponse}
		 */
		download_logo: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * @returns {ContractVersion}
		 */
		version: Record<string | number | symbol, never>;
	};
