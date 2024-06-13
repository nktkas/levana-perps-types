import { u64 } from "./rust.d.ts";

/**
 * A point in time in nanosecond precision.
 *
 * This type can represent times from 1970-01-01T00:00:00Z to 2554-07-21T23:34:33Z.
 */
export type Timestamp = string;

/** A thin wrapper around u128 that is using strings for JSON encoding/decoding, such that the full u128 range can be used for clients that convert JSON numbers to floats, like JavaScript and jq. */
export type Uint128 = string;

export interface BlockInfo {
	/** The height of a block is the number of blocks preceding it in the blockchain. */
	height: u64;
	/**
	 * Absolute time of the block creation in seconds since the UNIX epoch (00:00:00 on 1970-01-01 UTC).
	 *
	 * The source of this is the BFT Time in Tendermint, which has the same nanosecond precision as the `Timestamp` type.
	 */
	time: Timestamp;
	chain_id: string;
}

/**
 * Binary is a wrapper around Vec to add base64 de/serialization with serde. It also adds some helper methods to help encode inline.
 *
 * This is only needed as serde-json-{core,wasm} has a horrible encoding for Vec. See also https://github.com/CosmWasm/cosmwasm/blob/main/docs/MESSAGE_TYPES.md.
 */
export type Binary = string;

/** An key value pair that is used in the context of event attributes in logs */
export type Attribute = {
	key: string;
	value: string;
};
