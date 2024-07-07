// 0.1.0-beta.15
//
// Entrypoint messages for position token proxy

import { Binary } from "../../../cosmwasm.d.ts";
import { ContractVersion } from "../../../cw2.d.ts";
import { Expiration } from "../../../cw20.d.ts";
import { Option, u32, u64, Vec } from "../../../rust.d.ts";
import { Addr, MarketId, RawAddr } from "../../prelude.d.ts";
import { Approval, Metadata } from "./position_token.d.ts";

// ———————————————Structs———————————————

/** Response for QueryMsg::AllNftInfo */
export interface AllNftInfoResponse {
	/** Who can transfer the token */
	access: OwnerOfResponse;
	/** Data on the token itself, */
	info: NftInfoResponse;
}

/** Response for QueryMsg::Approval */
export interface ApprovalResponse {
	/** Approval information */
	approval: Approval;
}

/** Response for QueryMsg::Approvals */
export interface ApprovalsResponse {
	/** Approval information */
	approvals: Vec<Approval>;
}

/** Instantiate a new position token proxy contract */
export interface InstantiateMsg {
	/** The factory address */
	factory: RawAddr;
	/** Unique market identifier, also used for `symbol` in ContractInfo response */
	market_id: MarketId;
}

/** Placeholder migration message */
export interface MigrateMsg {}

/** Response for QueryMsg::ContractInfo */
export interface NftContractInfo {
	/** Name of this contract */
	name: string;
	/** Ticker symbol for this contract */
	symbol: string;
}

/** Response for QueryMsg::NftInfo */
export interface NftInfoResponse {
	/** You can add any custom metadata here when you extend cw721-base */
	extension: Metadata;
}

/** Response for QueryMsg::NumTokens */
export interface NumTokensResponse {
	/** Total number of tokens in the protocol */
	count: u64;
}

/** Response for [QueryMsg::Operators] */
export interface OperatorsResponse {
	/** Operator approval information */
	operators: Vec<Approval>;
}

/** Response for QueryMsg::OwnerOf */
export interface OwnerOfResponse {
	/** Owner of the token */
	owner: Addr;
	/** If set this address is approved to transfer/send the token as well */
	approvals: Vec<Approval>;
}

/** Response for QueryMsg::Tokens */
export interface TokensResponse {
	/** Contains all token_ids in lexicographical ordering If there are more than `limit`, use `start_from` in future queries to achieve pagination. */
	tokens: Vec<string>;
}

// ———————————————Enums———————————————

/**
 * Execute messages for a position token proxy
 *
 * Matches the CW721 standard.
 */
export type ExecuteMsg =
	| {
		/** Transfer is a base message to move a token to another account without triggering actions */
		transfer_nft: {
			/** Recipient of the NFT (position) */
			recipient: RawAddr;
			/** Position ID, represented as a `String` to match the NFT spec */
			token_id: string;
		};
	}
	| {
		/** Send is a base message to transfer a token to a contract and trigger an action on the receiving contract. */
		send_nft: {
			/** Contract to receive the position */
			contract: RawAddr;
			/** Position ID, represented as a `String` to match the NFT spec */
			token_id: string;
			/** Message to execute on the contract */
			msg: Binary;
		};
	}
	| {
		/** Allows operator to transfer / send the token from the owner’s account. If expiration is set, then this allowance has a time/height limit */
		approve: {
			/** Address that is allowed to spend the NFT */
			spender: RawAddr;
			/** Position ID, represented as a `String` to match the NFT spec */
			token_id: string;
			/** When the approval expires */
			expires?: Option<Expiration>;
		};
	}
	| {
		/** Remove previously granted Approval */
		revoke: {
			/** Address that is no longer allowed to spend the NFT */
			spender: RawAddr;
			/** Position ID, represented as a `String` to match the NFT spec */
			token_id: string;
		};
	}
	| {
		/** Allows operator to transfer / send any token from the owner’s account. If expiration is set, then this allowance has a time/height limit */
		approve_all: {
			/** Address that is allowed to spend all NFTs by the sending wallet */
			operator: RawAddr;
			/** When the approval expires */
			expires?: Option<Expiration>;
		};
	}
	| {
		/** Remove previously granted ApproveAll permission */
		revoke_all: {
			/** Address that is no longer allowed to spend all NFTs */
			operator: RawAddr;
		};
	};

/**
 * Query messages for a position token proxy
 *
 * Matches the CW721 standard.
 */
export type QueryMsg =
	| {
		/**
		 * Return the owner of the given token, error if token does not exist
		 * @returns {OwnerOfResponse}
		 */
		owner_of: {
			/** Position ID, represented as a `String` to match the NFT spec */
			token_id: string;
			/** unset or false will filter out expired approvals, you must set to true to see them */
			include_expired?: Option<boolean>;
		};
	}
	| {
		/**
		 * Return operator that can access all of the owner’s tokens.
		 * @returns {ApprovalResponse}
		 */
		approval: {
			/** Position ID, represented as a `String` to match the NFT spec */
			token_id: string;
			/** Spender */
			spender: RawAddr;
			/** Should we include expired approvals? */
			include_expired?: Option<boolean>;
		};
	}
	| {
		/**
		 * Return approvals that a token has
		 * @returns {ApprovalsResponse}
		 */
		approvals: {
			/** Position ID, represented as a `String` to match the NFT spec */
			token_id: string;
			/** Should we include expired approvals? */
			include_expired?: Option<boolean>;
		};
	}
	| {
		/**
		 * List all operators that can access all of the owner’s tokens
		 * @returns {OperatorsResponse}
		 */
		all_operators: {
			/** Position ID, represented as a `String` to match the NFT spec */
			owner: RawAddr;
			/** unset or false will filter out expired items, you must set to true to see them */
			include_expired?: Option<boolean>;
			/** Last operator seen */
			start_after?: Option<string>;
			/** How many operators to return */
			limit?: Option<u32>;
		};
	}
	| {
		/**
		 * Total number of tokens issued
		 * @returns {NumTokensResponse}
		 */
		num_tokens: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * Returns top-level metadata about the contract: `ContractInfoResponse`
		 * @returns {NftContractInfo}
		 */
		contract_info: Record<string | number | symbol, never>;
	}
	| {
		/**
		 * Returns metadata for a given token/position the format is based on the ERC721 Metadata JSON Schema but directly from the contract: `NftInfoResponse`
		 * @returns {NftInfoResponse}
		 */
		nft_info: {
			/** Position ID, represented as a `String` to match the NFT spec */
			token_id: string;
		};
	}
	| {
		/**
		 * Returns the result of both `NftInfo` and `OwnerOf` as one query as an optimization for clients: `AllNftInfo`
		 * @returns {AllNftInfoResponse}
		 */
		all_nft_info: {
			/** Position ID, represented as a `String` to match the NFT spec */
			token_id: string;
			/** unset or false will filter out expired approvals, you must set to true to see them */
			include_expired?: Option<boolean>;
		};
	}
	| {
		/**
		 * Returns all tokens owned by the given address, [] if unset.
		 * @returns {TokensResponse}
		 */
		tokens: {
			/** Owner to enumerate over */
			owner: RawAddr;
			/** Last position ID seen */
			start_after?: Option<string>;
			/** Number of positions to return */
			limit?: Option<u32>;
		};
	}
	| {
		/**
		 * Requires pagination. Lists all token_ids controlled by the contract.
		 * @returns {TokensResponse}
		 */
		all_tokens: {
			/** Last position ID seen */
			start_after?: Option<string>;
			/** Number of positions to return */
			limit?: Option<u32>;
		};
	}
	| {
		/**
		 * @returns {ContractVersion}
		 */
		version: Record<string | number | symbol, never>;
	};
