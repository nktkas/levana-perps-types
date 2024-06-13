// Time of last check: 2024-06-12

import { Addr, MarketId, RawAddr, Uint64 } from "../../prelude.d.ts";
import { Option, u32, Vec } from "../../../rust.d.ts";
import { ShutdownEffect, ShutdownImpact } from "../../shutdown.d.ts";
import { NewMarketParams } from "../market/entry.d.ts";
import { ContractVersion } from "../../../cw2.d.ts";

// ———————————————Structs———————————————

/** Response from QueryMsg::AddrIsContract */
export interface AddrIsContractResp {
	/** Boolean indicating whether this is a success for failure. */
	is_contract: boolean;
	/** If this is a contract: what type of contract is it? */
	contract_type: Option<ContractType>;
}

/** Which code IDs are currently set for new markets */
export interface CodeIds {
	/** Market code ID */
	market: Uint64;
	/** Position token proxy code ID */
	position_token: Uint64;
	/** Liquidity token proxy code ID */
	liquidity_token: Uint64;
}

/** Information on owners and other protocol-wide special addresses */
export interface FactoryOwnerResp {
	/** Owner of the factory */
	owner: Addr;
	/** Migration admin of the factory */
	admin_migration: Addr;
	/** Wallet that receives DAO/protocol fees for all markets */
	dao: Addr;
	/** Wallet that can activate kill switch shutdowns */
	kill_switch: Addr;
	/** Wallet that can activate market wind downs */
	wind_down: Addr;
}

/** Instantiate a new factory contract. */
export interface InstantiateMsg {
	/** The code id for the market contract */
	market_code_id: string;
	/** The code id for the position_token contract */
	position_token_code_id: string;
	/** The code id for the liquidity_token contract */
	liquidity_token_code_id: string;
	/** Migration admin, needed for instantiating/migrating sub-contracts */
	migration_admin: RawAddr;
	/** Perpetual swap admin address */
	owner: RawAddr;
	/** DAO address */
	dao: RawAddr;
	/** Kill switch address */
	kill_switch: RawAddr;
	/** Wind down address */
	wind_down: RawAddr;
	/** Suffix attached to all contracts instantiated by the factory */
	label_suffix: Option<string>;
}

/** Information about a specific market, returned from QueryMsg::MarketInfo. */
export interface MarketInfoResponse {
	/** Address of the market */
	market_addr: Addr;
	/** Address of the position token */
	position_token: Addr;
	/** Address of the LP liquidity token */
	liquidity_token_lp: Addr;
	/** Address of the xLP liquidity token */
	liquidity_token_xlp: Addr;
}

/**
 * Response from QueryMsg::Markets
 *
 * Use QueryMsg::MarketInfo for details on each market.
 */
export interface MarketsResp {
	/** Markets maintained by this factory */
	markets: Vec<MarketId>;
}

/** Placeholder migration message */
export interface MigrateMsg {
}

/** Return value from [QueryMsg::Shutdown] */
export interface ShutdownStatus {
	/** Any parts of the market which have been disabled. */
	disabled: Vec<ShutdownImpact>;
}

// ———————————————Enums———————————————

/** The type of contract identified by QueryMsg::AddrIsContract. */
export type ContractType =
	/** The factory contract */
	| "factory"
	/** An LP or xLP liquidity token proxy */
	| "liquidity-token"
	/** A position NFT proxy */
	| "position-token"
	/** A market */
	| "market";

/** Execute a message on the factory. */
export type ExecuteMsg =
	| {
		/** Add a new market */
		add_market: {
			/** Parameters for the new market */
			new_market: NewMarketParams;
		};
	}
	| {
		/** Set the market code id, i.e. if it’s been migrated */
		set_market_code_id: {
			/** Code ID to use for future market contracts */
			code_id: string;
		};
	}
	| {
		/** Set the position token code id, i.e. if it’s been migrated */
		set_position_token_code_id: {
			/** Code ID to use for future position token contracts */
			code_id: string;
		};
	}
	| {
		/** Set the liquidity token code id, i.e. if it’s been migrated */
		set_liquidity_token_code_id: {
			/** Code ID to use for future liquidity token contracts */
			code_id: string;
		};
	}
	| {
		/** Change the owner addr */
		set_owner: {
			/** New owner */
			owner: RawAddr;
		};
	}
	| {
		/** Change the migrationadmin */
		set_migration_admin: {
			/** New migration admin */
			migration_admin: RawAddr;
		};
	}
	| {
		/** Change the dao addr */
		set_dao: {
			/** New DAO */
			dao: RawAddr;
		};
	}
	| {
		/** Change the kill switch addr */
		set_kill_switch: {
			/** New kill switch administrator */
			kill_switch: RawAddr;
		};
	}
	| {
		/** Change the wind down addr */
		set_wind_down: {
			/** New wind down administrator */
			wind_down: RawAddr;
		};
	}
	| {
		/** Convenience mechanism to transfer all dao fees from all markets */
		transfer_all_dao_fees: Record<string | number | symbol, never>;
	}
	| {
		/** Perform a shutdown on the given markets with the given impacts */
		shutdown: {
			/** Which markets to impact? Empty list means impact all markets */
			markets: Vec<MarketId>;
			/** Which impacts to have? Empty list means shut down all activities */
			impacts: Vec<ShutdownImpact>;
			/** Are we disabling these impacts, or reenabling them? */
			effect: ShutdownEffect;
		};
	};

/** Queries available on the factory contract */
export type QueryMsg =
	| {
		/**
		 * @returns {ContractVersion}
		 */
		version: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * All the markets
		 * @returns {MarketsResp}
		 */
		markets: {
			/** Last seen market ID in a MarketsResp for enumeration */
			start_after?: Option<MarketId>;
			/** Defaults to {@link MARKETS_QUERY_LIMIT_DEFAULT} */
			limit?: Option<u32>;
		};
	}
	| {
		/**
		 * Combined query to get the market related addresses
		 * @returns {MarketInfoResponse}
		 */
		market_info: {
			/** Market ID to look up */
			market_id: MarketId;
		};
	}
	| {
		/**
		 * given an address, checks if it’s any of the registered protocol contracts.
		 * @returns {AddrIsContractResp}
		 */
		addr_is_contract: {
			/** Address to check */
			addr: RawAddr;
		};
	}
	| {
		/**
		 * Returns information about the owners of the factory
		 * @returns {FactoryOwnerResp}
		 */
		factory_owner: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * @returns {ShutdownStatus}
		 */
		shutdown_status: {
			/** Market to look up */
			market_id: MarketId;
		};
	}
	| {
		/**
		 * @returns {CodeIds}
		 */
		code_ids: Record<string | number | symbol, never>;
	};

// ———————————————Constants———————————————

/** Default limit for QueryMsg::Markets */
export const MARKETS_QUERY_LIMIT_DEFAULT = 15;
