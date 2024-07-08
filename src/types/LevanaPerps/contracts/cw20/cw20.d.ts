// 0.1.0-beta.15
//
// General CW20 contract messages.
// This is used by perps on testnet, not in production.

import type { Binary, Uint128 } from "../../../cosmwasm.d.ts";
import type { Addr } from "../../prelude.d.ts";

// ———————————————Structs———————————————

export interface Cw20Coin {
	address: string;
	amount: Uint128;
}

export interface Cw20CoinVerified {
	address: Addr;
	amount: Uint128;
}

export interface Cw20ReceiveMsg {
	sender: string;
	amount: Uint128;
	msg: Binary;
}

// ———————————————Enums———————————————

/** so that receivers of send messgage get the required encapsulation */
export type ReceiverExecuteMsg = {
	receive: Cw20ReceiveMsg;
};
