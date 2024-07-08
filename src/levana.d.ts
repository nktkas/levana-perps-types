import type {
	CosmWasmClient,
	ExecuteInstruction,
	ExecuteResult,
	SigningCosmWasmClient,
} from "npm:@cosmjs/cosmwasm-stargate@0.32.4";
import type { Coin, StdFee } from "npm:@cosmjs/amino@0.32.4";
import type { ContractVersion } from "./types/cw2.d.ts";
import type { PricePoint } from "./types/LevanaPerps/prelude.d.ts";
import type {
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
import type {
	AddrIsContractResp,
	CodeIds,
	ExecuteMsg as FactoryExecuteMsg,
	FactoryOwnerResp,
	MarketInfoResponse,
	MarketsResp,
	QueryMsg as FactoryQueryMsg,
	ShutdownStatus,
} from "./types/LevanaPerps/contracts/factory/entry.d.ts";
import type {
	ExecuteMsg as LiquidityTokenExecuteMsg,
	QueryMsg as LiquidityTokenQueryMsg,
} from "./types/LevanaPerps/contracts/liquidity_token/entry.d.ts";
import type { LiquidityTokenKind } from "./types/LevanaPerps/contracts/liquidity_token/liquidity_token.d.ts";
import type { GetDeferredExecResp, ListDeferredExecsResp } from "./types/LevanaPerps/contracts/market/deferred_execution.d.ts";
import type {
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
import type { PositionsResp } from "./types/LevanaPerps/contracts/market/position.d.ts";
import type {
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

type UnionKeys<T> = T extends unknown ? keyof T : never;

type ExtractValueByKey<T, K extends UnionKeys<T>> = T extends Record<K, unknown> ? T : never;

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

export type Cw20QueryResult<
	T extends Cw20QueryMsg,
> = T extends ExtractValueByKey<Cw20QueryMsg, "balance"> ? BalanceResponse
	: T extends ExtractValueByKey<Cw20QueryMsg, "token_info"> ? TokenInfoResponse
	: T extends ExtractValueByKey<Cw20QueryMsg, "minter"> ? MinterResponse
	: T extends ExtractValueByKey<Cw20QueryMsg, "allowance"> ? AllowanceResponse
	: T extends ExtractValueByKey<Cw20QueryMsg, "all_allowances"> ? AllAllowancesResponse
	: T extends ExtractValueByKey<Cw20QueryMsg, "all_spender_allowances"> ? AllSpenderAllowancesResponse
	: T extends ExtractValueByKey<Cw20QueryMsg, "all_accounts"> ? AllAccountsResponse
	: T extends ExtractValueByKey<Cw20QueryMsg, "marketing_info"> ? MarketingInfoResponse
	: T extends ExtractValueByKey<Cw20QueryMsg, "download_logo"> ? DownloadLogoResponse
	: T extends ExtractValueByKey<Cw20QueryMsg, "version"> ? ContractVersion
	: never;

export type FactoryQueryResult<
	T extends FactoryQueryMsg,
> = T extends ExtractValueByKey<FactoryQueryMsg, "version"> ? ContractVersion
	: T extends ExtractValueByKey<FactoryQueryMsg, "markets"> ? MarketsResp
	: T extends ExtractValueByKey<FactoryQueryMsg, "market_info"> ? MarketInfoResponse
	: T extends ExtractValueByKey<FactoryQueryMsg, "addr_is_contract"> ? AddrIsContractResp
	: T extends ExtractValueByKey<FactoryQueryMsg, "factory_owner"> ? FactoryOwnerResp
	: T extends ExtractValueByKey<FactoryQueryMsg, "shutdown_status"> ? ShutdownStatus
	: T extends ExtractValueByKey<FactoryQueryMsg, "code_ids"> ? CodeIds
	: never;

export type LiquidityTokenQueryResult<
	T extends LiquidityTokenQueryMsg,
> = T extends ExtractValueByKey<LiquidityTokenQueryMsg, "balance"> ? BalanceResponse
	: T extends ExtractValueByKey<LiquidityTokenQueryMsg, "token_info"> ? TokenInfoResponse
	: T extends ExtractValueByKey<LiquidityTokenQueryMsg, "allowance"> ? AllowanceResponse
	: T extends ExtractValueByKey<LiquidityTokenQueryMsg, "all_allowances"> ? AllAllowancesResponse
	: T extends ExtractValueByKey<LiquidityTokenQueryMsg, "all_spender_allowances"> ? AllSpenderAllowancesResponse
	: T extends ExtractValueByKey<LiquidityTokenQueryMsg, "all_accounts"> ? AllAccountsResponse
	: T extends ExtractValueByKey<LiquidityTokenQueryMsg, "marketing_info"> ? MarketingInfoResponse
	: T extends ExtractValueByKey<LiquidityTokenQueryMsg, "version"> ? ContractVersion
	: T extends ExtractValueByKey<LiquidityTokenQueryMsg, "kind"> ? LiquidityTokenKind
	: never;

export type MarketQueryResult<
	T extends MarketQueryMsg,
> = T extends ExtractValueByKey<MarketQueryMsg, "version"> ? ContractVersion
	: T extends ExtractValueByKey<MarketQueryMsg, "status"> ? StatusResp
	: T extends ExtractValueByKey<MarketQueryMsg, "spot_price"> ? PricePoint
	: T extends ExtractValueByKey<MarketQueryMsg, "spot_price_history"> ? SpotPriceHistoryResp
	: T extends ExtractValueByKey<MarketQueryMsg, "oracle_price"> ? OraclePriceResp
	: T extends ExtractValueByKey<MarketQueryMsg, "positions"> ? PositionsResp
	: T extends ExtractValueByKey<MarketQueryMsg, "limit_order"> ? LimitOrderResp
	: T extends ExtractValueByKey<MarketQueryMsg, "limit_orders"> ? LimitOrdersResp
	: T extends ExtractValueByKey<MarketQueryMsg, "closed_position_history"> ? ClosedPositionsResp
	: T extends ExtractValueByKey<MarketQueryMsg, "nft_proxy">
		? PositionTokenQueryResult<Extract<T, { nft_proxy: unknown }>["nft_proxy"]["nft_msg"]>
	: T extends ExtractValueByKey<MarketQueryMsg, "liquidity_token_proxy">
		? LiquidityTokenQueryResult<Extract<T, { liquidity_token_proxy: unknown }>["liquidity_token_proxy"]["msg"]>
	: T extends ExtractValueByKey<MarketQueryMsg, "trade_history_summary"> ? TradeHistorySummary
	: T extends ExtractValueByKey<MarketQueryMsg, "position_action_history"> ? PositionActionHistoryResp
	: T extends ExtractValueByKey<MarketQueryMsg, "trader_action_history"> ? TraderActionHistoryResp
	: T extends ExtractValueByKey<MarketQueryMsg, "lp_action_history"> ? LpActionHistoryResp
	: T extends ExtractValueByKey<MarketQueryMsg, "limit_order_history"> ? LimitOrderHistoryResp
	: T extends ExtractValueByKey<MarketQueryMsg, "lp_info"> ? LpInfoResp
	: T extends ExtractValueByKey<MarketQueryMsg, "delta_neutrality_fee"> ? DeltaNeutralityFeeResp
	: T extends ExtractValueByKey<MarketQueryMsg, "price_would_trigger"> ? PriceWouldTriggerResp
	: T extends ExtractValueByKey<MarketQueryMsg, "list_deferred_execs"> ? ListDeferredExecsResp
	: T extends ExtractValueByKey<MarketQueryMsg, "get_deferred_exec"> ? GetDeferredExecResp
	: never;

export type PositionTokenQueryResult<
	T extends PositionTokenQueryMsg,
> = T extends ExtractValueByKey<PositionTokenQueryMsg, "owner_of"> ? OwnerOfResponse
	: T extends ExtractValueByKey<PositionTokenQueryMsg, "approval"> ? ApprovalResponse
	: T extends ExtractValueByKey<PositionTokenQueryMsg, "approvals"> ? ApprovalsResponse
	: T extends ExtractValueByKey<PositionTokenQueryMsg, "all_operators"> ? OperatorsResponse
	: T extends ExtractValueByKey<PositionTokenQueryMsg, "num_tokens"> ? NumTokensResponse
	: T extends ExtractValueByKey<PositionTokenQueryMsg, "contract_info"> ? NftContractInfo
	: T extends ExtractValueByKey<PositionTokenQueryMsg, "nft_info"> ? NftInfoResponse
	: T extends ExtractValueByKey<PositionTokenQueryMsg, "all_nft_info"> ? AllNftInfoResponse
	: T extends ExtractValueByKey<PositionTokenQueryMsg, "tokens"> ? TokensResponse
	: T extends ExtractValueByKey<PositionTokenQueryMsg, "all_tokens"> ? TokensResponse
	: T extends ExtractValueByKey<PositionTokenQueryMsg, "version"> ? ContractVersion
	: never;

// ———————————————Classes———————————————

export declare class LevanaCosmWasmClient extends CosmWasmClient {
	queryContractSmart<
		T extends Cw20QueryMsg | FactoryQueryMsg | LiquidityTokenQueryMsg | MarketQueryMsg | PositionTokenQueryMsg,
	>(
		address: string,
		queryMsg: T,
	): Promise<
		T extends Cw20QueryMsg ? Cw20QueryResult<T>
			: T extends FactoryQueryMsg ? FactoryQueryResult<T>
			: T extends LiquidityTokenQueryMsg ? LiquidityTokenQueryResult<T>
			: T extends MarketQueryMsg ? MarketQueryResult<T>
			: T extends PositionTokenQueryMsg ? PositionTokenQueryResult<T>
			: never
	>;
}

export declare class LevanaSigningCosmWasmClient extends SigningCosmWasmClient {
	queryContractSmart<
		T extends Cw20QueryMsg | FactoryQueryMsg | LiquidityTokenQueryMsg | MarketQueryMsg | PositionTokenQueryMsg,
	>(
		address: string,
		queryMsg: T,
	): Promise<
		T extends Cw20QueryMsg ? Cw20QueryResult<T>
			: T extends FactoryQueryMsg ? FactoryQueryResult<T>
			: T extends LiquidityTokenQueryMsg ? LiquidityTokenQueryResult<T>
			: T extends MarketQueryMsg ? MarketQueryResult<T>
			: T extends PositionTokenQueryMsg ? PositionTokenQueryResult<T>
			: never
	>;

	execute(
		senderAddress: string,
		contractAddress: string,
		msg: Cw20ExecuteMsg | FactoryExecuteMsg | LiquidityTokenExecuteMsg | MarketExecuteMsg | PositionTokenExecuteMsg,
		fee: number | StdFee | "auto",
		memo?: string,
		funds?: readonly Coin[],
	): Promise<ExecuteResult>;

	executeMultiple(
		senderAddress: string,
		instructions: readonly LevanaExecuteInstruction<
			Cw20ExecuteMsg | FactoryExecuteMsg | LiquidityTokenExecuteMsg | MarketExecuteMsg | PositionTokenExecuteMsg
		>[],
		fee: number | StdFee | "auto",
		memo?: string,
	): Promise<ExecuteResult>;
}
