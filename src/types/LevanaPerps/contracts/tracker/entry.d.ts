// 0.1.0-beta.15
//
// Tracks different code IDs and instantiated contracts on testnet.
// This is used by perps on testnet, not in production.

import type { Option, u32, u64 } from "../../../rust.d.ts";
import type { Timestamp } from "../../prelude.d.ts";

// ———————————————Enums———————————————

export type CodeIdResp =
	| {
		not_found: Record<string | number | symbol, never>;
	}
	| {
		found: {
			contract_type: string;
			code_id: u64;
			hash: string;
			tracked_at: Timestamp;
			gitrev: Option<string>;
		};
	};

export type ContractResp =
	| {
		not_found: Record<string | number | symbol, never>;
	}
	| {
		found: {
			address: string;
			contract_type: string;
			original_code_id: u64;
			/** When we received the Instantiate call */
			original_tracked_at: Timestamp;
			current_code_id: u64;
			/** When we received the most recent instantiate or migrate */
			current_tracked_at: Timestamp;
			family: string;
			sequence: u32;
			/** How many times have we been migrated? */
			migrate_count: u32;
		};
	};

export type ExecuteMsg =
	| {
		/** Track the upload of a WASM file */
		code_id: {
			/** User friendly string describing the contract */
			contract_type: string;
			/** Code ID of the uploaded file */
			code_id: u64;
			/** SHA256 hash to uniquely identify a file */
			hash: string;
			/** Git commit that generated this code, if known */
			gitrev?: Option<string>;
		};
	}
	| {
		/**
		 * Track the instantiation of a new contract
		 *
		 * Will automatically assign a unique identifier from the deployment family
		 */
		instantiate: {
			code_id: u64;
			address: string;
			/**
			 * Family of the deployment.
			 *
			 * This can be things like osmodev or dragonci. The idea would be that there can be a series of contracts in this family, and the latest one is the current true deployment.
			 *
			 * Each individual instantiation will get a unique identifier based on this name.
			 */
			family: string;
		};
	}
	| {
		/**
		 * Track the migration of an existing contract to a new code ID.
		 *
		 * This information is already tracked on the blockchain, it’s just convenient to have it here too.
		 */
		migrate: {
			new_code_id: u64;
			address: string;
		};
	}
	| {
		/** Add an administrator address */
		add_admin: {
			address: string;
		};
	}
	| {
		/** Remove an administrator address */
		remove_admin: {
			address: string;
		};
	};

export type QueryMsg =
	| {
		/** Lookup the code by ID */
		code_by_id: {
			code_id: u64;
		};
	}
	| {
		/** Lookup the code by hash */
		code_by_hash: {
			hash: string;
		};
	}
	| {
		/** Get the contract information for the given contract address */
		contract_by_address: {
			address: string;
		};
	}
	| {
		/** Get the contract information for the latest contract in a family */
		contract_by_family: {
			/** This is derived from the Code ID during the Instantiate call */
			contract_type: string;
			family: string;
			/**
			 * Unique identifier within the series to look up.
			 *
			 * If omitted, gets the most recent
			 */
			sequence?: Option<u32>;
		};
	};
