import { Binary } from "../../../cosmwasm.d.ts";
import { Expiration } from "../../../cw20.d.ts";
import { Option, Vec } from "../../../rust.d.ts";
import { Addr } from "../../prelude.d.ts";

// Structs

/** copied/adapted from the cw721-base reference */
export interface Approval {
	/** Account that can transfer/send the token */
	spender: Addr;
	/** When the Approval expires (maybe Expiration::never) */
	expires: Expiration;
}

/** Cw721ReceiveMsg should be de/serialized under `Receive()` variant in a ExecuteMsg */
export interface Cw721ReceiveMsg {
	/** Sender of the NFT */
	sender: string;
	/** Position ID transferred */
	token_id: string;
	/** Binary message for the receiving contract to execute. */
	msg: Binary;
}

/** copied/adapted from the cw721-base reference */
export interface FullTokenInfo {
	/** The owner of the newly minted NFT */
	owner: Addr;
	/** Approvals are stored here, as we clear them all upon transfer and cannot accumulate much */
	approvals: Vec<Approval>;
	/** metadata, as per spec */
	extension: Metadata;
}

/** NFT standard metadata */
export interface Metadata {
	/** Unused by perps */
	image: Option<string>;
	/** Unused by perps */
	image_data: Option<string>;
	/** Unused by perps */
	external_url: Option<string>;
	/** Unused by perps */
	description: Option<string>;
	/** Unused by perps */
	name: Option<string>;
	/** Characteristics of the position */
	attributes: Option<Vec<Trait>>;
	/** Unused by perps */
	background_color: Option<string>;
	/** Unused by perps */
	animation_url: Option<string>;
	/** Unused by perps */
	youtube_url: Option<string>;
}

/** NFT-standard traits, used to express information on the position */
export interface Trait {
	/** Unused by pers */
	display_type: Option<string>;
	/** The type of data contained in this trait. */
	trait_type: string;
	/** The value for the given trait type. */
	value: string;
}
