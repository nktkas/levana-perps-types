import { CosmWasmClient, ExecuteInstruction, ExecuteResult, SigningCosmWasmClient } from "https://esm.sh/@cosmjs/cosmwasm-stargate@0.32.3";
import { Coin, StdFee } from "https://esm.sh/@cosmjs/amino@0.32.3";
import { ContractVersion } from "./types/cw2.d.ts";
import { PricePoint } from "./types/LevanaPerps/prelude.d.ts";
import {
	AllAccountsResponse,
	AllAllowancesResponse,
	AllowanceResponse,
	AllSpenderAllowancesResponse,
	BalanceResponse,
	DownloadLogoResponse,
	ExecuteMsg as Cw20ExecuteMsg,
	MarketingInfoResponse,
	MinterResponse,
	QueryMsg as Cw20QueryMsg,
	TokenInfoResponse,
} from "./types/LevanaPerps/contracts/cw20/entry.d.ts";
import {
	AddrIsContractResp,
	CodeIds,
	ExecuteMsg as FactoryExecuteMsg,
	FactoryOwnerResp,
	MarketInfoResponse,
	MarketsResp,
	QueryMsg as FactoryQueryMsg,
	ShutdownStatus,
} from "./types/LevanaPerps/contracts/factory/entry.d.ts";
import {
	ExecuteMsg as LiquidityTokenExecuteMsg,
	QueryMsg as LiquidityTokenQueryMsg,
} from "./types/LevanaPerps/contracts/liquidity_token/entry.d.ts";
import { LiquidityTokenKind } from "./types/LevanaPerps/contracts/liquidity_token/liquidity_token.d.ts";
import { GetDeferredExecResp, ListDeferredExecsResp } from "./types/LevanaPerps/contracts/market/deferred_execution.d.ts";
import {
	ClosedPositionsResp,
	DeltaNeutralityFeeResp,
	ExecuteMsg as MarketExecuteMsg,
	LimitOrderHistoryResp,
	LimitOrderResp,
	LimitOrdersResp,
	LpActionHistoryResp,
	LpInfoResp,
	OraclePriceResp,
	PositionActionHistoryResp,
	PriceWouldTriggerResp,
	QueryMsg as MarketQueryMsg,
	SpotPriceHistoryResp,
	StatusResp,
	TradeHistorySummary,
	TraderActionHistoryResp,
} from "./types/LevanaPerps/contracts/market/entry.d.ts";
import { PositionsResp } from "./types/LevanaPerps/contracts/market/position.d.ts";
import {
	AllNftInfoResponse,
	ApprovalResponse,
	ApprovalsResponse,
	ExecuteMsg as PositionTokenExecuteMsg,
	NftContractInfo,
	NftInfoResponse,
	NumTokensResponse,
	OperatorsResponse,
	OwnerOfResponse,
	QueryMsg as PositionTokenQueryMsg,
	TokensResponse,
} from "./types/LevanaPerps/contracts/position_token/entry.d.ts";

// ———————————————Types———————————————

type UnionKeys<T> = T extends unknown ? keyof T : never;

export interface LevanaExecuteInstruction<
	T extends Cw20ExecuteMsg | FactoryExecuteMsg | LiquidityTokenExecuteMsg | MarketExecuteMsg | PositionTokenExecuteMsg,
> extends ExecuteInstruction {
	contractAddress: string;
	msg: T;
	/**
	 * TODO: Allow funds to be used only for the following messages:
	 * * open_position
	 * * update_position_add_collateral_impact_leverage
	 * * update_position_add_collateral_impact_size
	 * * update_position_remove_collateral_impact_leverage
	 * * update_position_remove_collateral_impact_size
	 * * update_position_leverage
	 * * update_position_max_gains
	 * * update_position_take_profit_price
	 * * update_position_stop_loss_price
	 * * set_trigger_order
	 * * place_limit_order
	 */
	funds?: readonly Coin[];
}

export type Cw20QueryResult<T extends Cw20QueryMsg> = UnionKeys<T> extends "balance" ? BalanceResponse
	: UnionKeys<T> extends "token_info" ? TokenInfoResponse
	: UnionKeys<T> extends "minter" ? MinterResponse
	: UnionKeys<T> extends "allowance" ? AllowanceResponse
	: UnionKeys<T> extends "all_allowances" ? AllAllowancesResponse
	: UnionKeys<T> extends "all_spender_allowances" ? AllSpenderAllowancesResponse
	: UnionKeys<T> extends "all_accounts" ? AllAccountsResponse
	: UnionKeys<T> extends "marketing_info" ? MarketingInfoResponse
	: UnionKeys<T> extends "download_logo" ? DownloadLogoResponse
	: UnionKeys<T> extends "version" ? ContractVersion
	: never;

export type FactoryQueryResult<T extends FactoryQueryMsg> = UnionKeys<T> extends "version" ? ContractVersion
	: UnionKeys<T> extends "markets" ? MarketsResp
	: UnionKeys<T> extends "market_info" ? MarketInfoResponse
	: UnionKeys<T> extends "addr_is_contract" ? AddrIsContractResp
	: UnionKeys<T> extends "factory_owner" ? FactoryOwnerResp
	: UnionKeys<T> extends "shutdown_status" ? ShutdownStatus
	: UnionKeys<T> extends "code_ids" ? CodeIds
	: never;

export type LiquidityTokenQueryResult<T extends LiquidityTokenQueryMsg> = UnionKeys<T> extends "balance" ? BalanceResponse
	: UnionKeys<T> extends "token_info" ? TokenInfoResponse
	: UnionKeys<T> extends "allowance" ? AllowanceResponse
	: UnionKeys<T> extends "all_allowances" ? AllAllowancesResponse
	: UnionKeys<T> extends "all_spender_allowances" ? AllSpenderAllowancesResponse
	: UnionKeys<T> extends "all_accounts" ? AllAccountsResponse
	: UnionKeys<T> extends "marketing_info" ? MarketingInfoResponse
	: UnionKeys<T> extends "version" ? ContractVersion
	: UnionKeys<T> extends "kind" ? LiquidityTokenKind
	: never;

export type MarketQueryResult<T extends MarketQueryMsg> = UnionKeys<T> extends "version" ? ContractVersion
	: UnionKeys<T> extends "status" ? StatusResp
	: UnionKeys<T> extends "spot_price" ? PricePoint
	: UnionKeys<T> extends "spot_price_history" ? SpotPriceHistoryResp
	: UnionKeys<T> extends "oracle_price" ? OraclePriceResp
	: UnionKeys<T> extends "positions" ? PositionsResp
	: UnionKeys<T> extends "limit_order" ? LimitOrderResp
	: UnionKeys<T> extends "limit_orders" ? LimitOrdersResp
	: UnionKeys<T> extends "closed_position_history" ? ClosedPositionsResp
	: UnionKeys<T> extends "nft_proxy" ? PositionTokenQueryResult<Extract<T, { nft_proxy: unknown }>["nft_proxy"]["nft_msg"]>
	: UnionKeys<T> extends "liquidity_token_proxy"
		? LiquidityTokenQueryResult<Extract<T, { liquidity_token_proxy: unknown }>["liquidity_token_proxy"]["msg"]>
	: UnionKeys<T> extends "trade_history_summary" ? TradeHistorySummary
	: UnionKeys<T> extends "position_action_history" ? PositionActionHistoryResp
	: UnionKeys<T> extends "trader_action_history" ? TraderActionHistoryResp
	: UnionKeys<T> extends "lp_action_history" ? LpActionHistoryResp
	: UnionKeys<T> extends "limit_order_history" ? LimitOrderHistoryResp
	: UnionKeys<T> extends "lp_info" ? LpInfoResp
	: UnionKeys<T> extends "delta_neutrality_fee" ? DeltaNeutralityFeeResp
	: UnionKeys<T> extends "price_would_trigger" ? PriceWouldTriggerResp
	: UnionKeys<T> extends "list_deferred_execs" ? ListDeferredExecsResp
	: UnionKeys<T> extends "get_deferred_exec" ? GetDeferredExecResp
	: never;

export type PositionTokenQueryResult<T extends PositionTokenQueryMsg> = UnionKeys<T> extends "owner_of" ? OwnerOfResponse
	: UnionKeys<T> extends "approval" ? ApprovalResponse
	: UnionKeys<T> extends "approvals" ? ApprovalsResponse
	: UnionKeys<T> extends "all_operators" ? OperatorsResponse
	: UnionKeys<T> extends "num_tokens" ? NumTokensResponse
	: UnionKeys<T> extends "contract_info" ? NftContractInfo
	: UnionKeys<T> extends "nft_info" ? NftInfoResponse
	: UnionKeys<T> extends "all_nft_info" ? AllNftInfoResponse
	: UnionKeys<T> extends "tokens" ? TokensResponse
	: UnionKeys<T> extends "all_tokens" ? TokensResponse
	: UnionKeys<T> extends "version" ? ContractVersion
	: never;

// ———————————————Classes———————————————

export class LevanaPerpsExecute {
	protected readonly client: SigningCosmWasmClient;

	constructor(client: SigningCosmWasmClient) {
		this.client = client;
	}

	async execute(
		senderAddress: string,
		contractAddress: string,
		msg: Cw20ExecuteMsg | FactoryExecuteMsg | LiquidityTokenExecuteMsg | MarketExecuteMsg | PositionTokenExecuteMsg,
		fee: number | StdFee | "auto",
		memo?: string,
		funds?: readonly Coin[],
	): Promise<ExecuteResult> {
		return await this.client.execute(senderAddress, contractAddress, msg, fee, memo, funds);
	}

	async executeMultiple(
		senderAddress: string,
		instructions: readonly LevanaExecuteInstruction<
			Cw20ExecuteMsg | FactoryExecuteMsg | LiquidityTokenExecuteMsg | MarketExecuteMsg | PositionTokenExecuteMsg
		>[],
		fee: number | StdFee | "auto",
		memo?: string,
	): Promise<ExecuteResult> {
		return await this.client.executeMultiple(senderAddress, instructions, fee, memo);
	}
}

export class LevanaPerpsQuery {
	protected readonly client: CosmWasmClient;

	constructor(client: CosmWasmClient) {
		this.client = client;
	}

	async query<T extends Cw20QueryMsg | FactoryQueryMsg | LiquidityTokenQueryMsg | MarketQueryMsg | PositionTokenQueryMsg>(
		address: string,
		queryMsg: T,
	): Promise<
		T extends Cw20QueryMsg ? Cw20QueryResult<T>
			: T extends FactoryQueryMsg ? FactoryQueryResult<T>
			: T extends LiquidityTokenQueryMsg ? LiquidityTokenQueryResult<T>
			: T extends MarketQueryMsg ? MarketQueryResult<T>
			: T extends PositionTokenQueryMsg ? PositionTokenQueryResult<T>
			: never
	> {
		return await this.client.queryContractSmart(address, queryMsg);
	}
}
