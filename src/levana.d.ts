import type { CosmWasmClient, ExecuteInstruction, ExecuteResult, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import type { Coin, StdFee } from "@cosmjs/stargate";
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
import type { ExecuteMsg as LiquidityTokenExecuteMsg, QueryMsg as LiquidityTokenQueryMsg } from "./types/LevanaPerps/contracts/liquidity_token/entry.d.ts";
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

type ExtractMarketNftProxyQueryMsg<
	K extends UnionKeys<PositionTokenQueryMsg>,
> = ExtractValueByKey<MarketQueryMsg, "nft_proxy"> & {
	nft_proxy: {
		nft_msg: ExtractValueByKey<PositionTokenQueryMsg, K>;
	};
};
type ExtractMarketLiquidityTokenProxyQueryMsg<
	K extends UnionKeys<LiquidityTokenQueryMsg>,
> = ExtractValueByKey<MarketQueryMsg, "liquidity_token_proxy"> & {
	liquidity_token_proxy: {
		msg: ExtractValueByKey<LiquidityTokenQueryMsg, K>;
	};
};

interface LevanaExecuteInstruction<
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

export declare class LevanaCosmWasmClient extends CosmWasmClient {
	// Cw20
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "balance">): Promise<BalanceResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "token_info">): Promise<TokenInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "minter">): Promise<MinterResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "allowance">): Promise<AllowanceResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "all_allowances">): Promise<AllAllowancesResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "all_spender_allowances">): Promise<AllSpenderAllowancesResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "all_accounts">): Promise<AllAccountsResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "marketing_info">): Promise<MarketingInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "download_logo">): Promise<DownloadLogoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "version">): Promise<ContractVersion>;

	// Factory
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<FactoryQueryMsg, "version">): Promise<ContractVersion>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<FactoryQueryMsg, "markets">): Promise<MarketsResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<FactoryQueryMsg, "market_info">): Promise<MarketInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<FactoryQueryMsg, "addr_is_contract">): Promise<AddrIsContractResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<FactoryQueryMsg, "factory_owner">): Promise<FactoryOwnerResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<FactoryQueryMsg, "shutdown_status">): Promise<ShutdownStatus>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<FactoryQueryMsg, "code_ids">): Promise<CodeIds>;

	// LiquidityToken
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "balance">): Promise<BalanceResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "token_info">): Promise<TokenInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "allowance">): Promise<AllowanceResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "all_allowances">): Promise<AllAllowancesResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "all_spender_allowances">): Promise<AllSpenderAllowancesResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "all_accounts">): Promise<AllAccountsResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "marketing_info">): Promise<MarketingInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "version">): Promise<ContractVersion>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "kind">): Promise<LiquidityTokenKind>;

	// Market
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "version">): Promise<ContractVersion>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "status">): Promise<StatusResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "spot_price">): Promise<PricePoint>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "spot_price_history">): Promise<SpotPriceHistoryResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "oracle_price">): Promise<OraclePriceResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "positions">): Promise<PositionsResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "limit_order">): Promise<LimitOrderResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "limit_orders">): Promise<LimitOrdersResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "closed_position_history">): Promise<ClosedPositionsResp>;

	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"owner_of">): Promise<OwnerOfResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"approval">): Promise<ApprovalResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"approvals">): Promise<ApprovalsResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"all_operators">): Promise<OperatorsResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"num_tokens">): Promise<NumTokensResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"contract_info">): Promise<NftContractInfo>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"nft_info">): Promise<NftInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"all_nft_info">): Promise<AllNftInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"tokens">): Promise<TokensResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"all_tokens">): Promise<TokensResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"version">): Promise<ContractVersion>;

	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"balance">): Promise<BalanceResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"token_info">): Promise<TokenInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"allowance">): Promise<AllowanceResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"all_allowances">): Promise<AllAllowancesResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"all_spender_allowances">): Promise<AllSpenderAllowancesResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"all_accounts">): Promise<AllAccountsResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"marketing_info">): Promise<MarketingInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"version">): Promise<ContractVersion>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"kind">): Promise<LiquidityTokenKind>;

	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "trade_history_summary">): Promise<TradeHistorySummary>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "position_action_history">): Promise<PositionActionHistoryResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "trader_action_history">): Promise<TraderActionHistoryResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "lp_action_history">): Promise<LpActionHistoryResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "limit_order_history">): Promise<LimitOrderHistoryResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "lp_info">): Promise<LpInfoResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "delta_neutrality_fee">): Promise<DeltaNeutralityFeeResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "price_would_trigger">): Promise<PriceWouldTriggerResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "list_deferred_execs">): Promise<ListDeferredExecsResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "get_deferred_exec">): Promise<GetDeferredExecResp>;

	// PositionToken
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "owner_of">): Promise<OwnerOfResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "approval">): Promise<ApprovalResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "approvals">): Promise<ApprovalsResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "all_operators">): Promise<OperatorsResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "num_tokens">): Promise<NumTokensResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "contract_info">): Promise<NftContractInfo>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "nft_info">): Promise<NftInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "all_nft_info">): Promise<AllNftInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "tokens">): Promise<TokensResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "all_tokens">): Promise<TokensResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "version">): Promise<ContractVersion>;
}

export declare class LevanaSigningCosmWasmClient extends SigningCosmWasmClient {
	// Cw20
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "balance">): Promise<BalanceResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "token_info">): Promise<TokenInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "minter">): Promise<MinterResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "allowance">): Promise<AllowanceResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "all_allowances">): Promise<AllAllowancesResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "all_spender_allowances">): Promise<AllSpenderAllowancesResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "all_accounts">): Promise<AllAccountsResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "marketing_info">): Promise<MarketingInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "download_logo">): Promise<DownloadLogoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<Cw20QueryMsg, "version">): Promise<ContractVersion>;

	// Factory
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<FactoryQueryMsg, "version">): Promise<ContractVersion>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<FactoryQueryMsg, "markets">): Promise<MarketsResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<FactoryQueryMsg, "market_info">): Promise<MarketInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<FactoryQueryMsg, "addr_is_contract">): Promise<AddrIsContractResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<FactoryQueryMsg, "factory_owner">): Promise<FactoryOwnerResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<FactoryQueryMsg, "shutdown_status">): Promise<ShutdownStatus>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<FactoryQueryMsg, "code_ids">): Promise<CodeIds>;

	// LiquidityToken
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "balance">): Promise<BalanceResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "token_info">): Promise<TokenInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "allowance">): Promise<AllowanceResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "all_allowances">): Promise<AllAllowancesResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "all_spender_allowances">): Promise<AllSpenderAllowancesResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "all_accounts">): Promise<AllAccountsResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "marketing_info">): Promise<MarketingInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "version">): Promise<ContractVersion>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<LiquidityTokenQueryMsg, "kind">): Promise<LiquidityTokenKind>;

	// Market
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "version">): Promise<ContractVersion>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "status">): Promise<StatusResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "spot_price">): Promise<PricePoint>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "spot_price_history">): Promise<SpotPriceHistoryResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "oracle_price">): Promise<OraclePriceResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "positions">): Promise<PositionsResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "limit_order">): Promise<LimitOrderResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "limit_orders">): Promise<LimitOrdersResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "closed_position_history">): Promise<ClosedPositionsResp>;

	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"owner_of">): Promise<OwnerOfResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"approval">): Promise<ApprovalResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"approvals">): Promise<ApprovalsResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"all_operators">): Promise<OperatorsResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"num_tokens">): Promise<NumTokensResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"contract_info">): Promise<NftContractInfo>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"nft_info">): Promise<NftInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"all_nft_info">): Promise<AllNftInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"tokens">): Promise<TokensResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"all_tokens">): Promise<TokensResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketNftProxyQueryMsg<"version">): Promise<ContractVersion>;

	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"balance">): Promise<BalanceResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"token_info">): Promise<TokenInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"allowance">): Promise<AllowanceResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"all_allowances">): Promise<AllAllowancesResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"all_spender_allowances">): Promise<AllSpenderAllowancesResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"all_accounts">): Promise<AllAccountsResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"marketing_info">): Promise<MarketingInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"version">): Promise<ContractVersion>;
	queryContractSmart(address: string, queryMsg: ExtractMarketLiquidityTokenProxyQueryMsg<"kind">): Promise<LiquidityTokenKind>;

	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "trade_history_summary">): Promise<TradeHistorySummary>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "position_action_history">): Promise<PositionActionHistoryResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "trader_action_history">): Promise<TraderActionHistoryResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "lp_action_history">): Promise<LpActionHistoryResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "limit_order_history">): Promise<LimitOrderHistoryResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "lp_info">): Promise<LpInfoResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "delta_neutrality_fee">): Promise<DeltaNeutralityFeeResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "price_would_trigger">): Promise<PriceWouldTriggerResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "list_deferred_execs">): Promise<ListDeferredExecsResp>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<MarketQueryMsg, "get_deferred_exec">): Promise<GetDeferredExecResp>;

	// PositionToken
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "owner_of">): Promise<OwnerOfResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "approval">): Promise<ApprovalResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "approvals">): Promise<ApprovalsResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "all_operators">): Promise<OperatorsResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "num_tokens">): Promise<NumTokensResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "contract_info">): Promise<NftContractInfo>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "nft_info">): Promise<NftInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "all_nft_info">): Promise<AllNftInfoResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "tokens">): Promise<TokensResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "all_tokens">): Promise<TokensResponse>;
	queryContractSmart(address: string, queryMsg: ExtractValueByKey<PositionTokenQueryMsg, "version">): Promise<ContractVersion>;

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
