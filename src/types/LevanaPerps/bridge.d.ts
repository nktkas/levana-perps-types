// 0.1.0-beta.15

import { f64, i64, Option, u64, Vec } from "../rust.d.ts";
import { Addr, NumberGtZero, PerpError } from "./prelude.d.ts";
import { ExecuteMsg as MarketExecuteMsg, QueryMsg as MarketQueryMsg } from "./contracts/market/entry.d.ts";
import { Binary } from "../cosmwasm.d.ts";

// ———————————————Structs———————————————

export interface BridgeToClientWrapper {
	msg_id: u64;
	elapsed: f64;
	msg: BridgeToClientMsg;
}

export interface ClientToBridgeWrapper {
	msg_id: u64;
	user: Addr;
	msg: ClientToBridgeMsg;
}

// ———————————————Enums———————————————

export type BridgeToClientMsg =
	| {
		market_query_result: {
			result: Binary;
		};
	}
	| {
		market_exec_success: {
			events: Vec<Event>;
		};
	}
	| {
		market_exec_failure: ExecError;
	}
	| {
		time_jump_result: Record<string | number | symbol, never>;
	};

export type ClientToBridgeMsg =
	| {
		query_market: {
			query_msg: MarketQueryMsg;
		};
	}
	| {
		exec_market: {
			exec_msg: MarketExecuteMsg;
			funds: Option<NumberGtZero>;
		};
	}
	| "refresh_price"
	| "crank"
	| {
		mint_collateral: {
			amount: NumberGtZero;
		};
	}
	| {
		mint_and_deposit_lp: {
			amount: NumberGtZero;
		};
	}
	| {
		time_jump_seconds: {
			seconds: i64;
		};
	};

export type ExecError =
	| {
		perp_error: PerpError;
	}
	| {
		unknown: string;
	};
