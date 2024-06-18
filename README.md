Types from Rust documentation Levana Perps in TypeScript

Source: https://apidocs.levana.finance/msg/doc/levana_perpswap_cosmos_msg/index.html

## Usage (Deno)

```typescript
import { LevanaCosmWasmClient, LevanaSigningCosmWasmClient } from "./index.ts";
import { CosmWasmClient } from "https://esm.sh/@cosmjs/cosmwasm-stargate@0.32.3";

const RPC_ENDPOINT = "https://osmosis-rpc.publicnode.com:443";
const FACTORY_ADDRESS = "osmo1ssw6x553kzqher0earlkwlxasfm2stnl3ms3ma2zz4tnajxyyaaqlucd45";

const levanaCosmWasmClient = await CosmWasmClient.connect(RPC_ENDPOINT) as LevanaCosmWasmClient;

// TypeScript automatically recognizes a query and offers certain hints and returns the appropriate type for the query

const marketsResp = await levanaCosmWasmClient.queryContractSmart(FACTORY_ADDRESS, {
	markets: {},
});
console.log("All market ids:", marketsResp);

const marketInfoResponse = await levanaCosmWasmClient.queryContractSmart(FACTORY_ADDRESS, {
	market_info: {
		market_id: marketsResp.markets[0],
	},
});
console.log("Market info:", marketInfoResponse);

const statusResp = await levanaCosmWasmClient.queryContractSmart(marketInfoResponse.market_addr, {
	status: {},
});
console.log("Market status:", statusResp);

const tokensResponse = await levanaCosmWasmClient.queryContractSmart(marketInfoResponse.market_addr, {
	nft_proxy: {
		nft_msg: {
			tokens: {
				owner: "osmo13euuwxeg62w2xw3ul8pyk2s4fq6awnh8tqgs5y",
			},
		},
	},
});
console.log("Tokens:", tokensResponse);

// TypeScript will also notify you if you try to make a query that does not exist in the documentation

const marketLimitOrder = await levanaCosmWasmClient.queryContractSmart(marketInfoResponse.market_addr, {
	// TS Error: Property 'owner' is missing in type '{}' but required in type '{ owner: string; start_after?: Option<string> | undefined; limit?: Option<number> | undefined; order?: Option<OrderInMessage> | undefined; }'.
	limit_orders: {},
});

const marketOraclePrice = await levanaCosmWasmClient.queryContractSmart(marketInfoResponse.market_addr, {
	oracle_price: {
		// TS Error: Type 'number' is not assignable to type 'boolean'.
		validate_age: 0,
	},
});

const numTokensResponse = await levanaCosmWasmClient.queryContractSmart(marketInfoResponse.market_addr, {
	nft_proxy: {
		nft_msg: {
			num_tokens: {
				// TS Error: Type 'string' is not assignable to type 'never'.
				direction: "long",
			},
		},
	},
});
```

## Differences from the original documentation

1. Changed keys `_unused1`, `_unused2`, `_unused3`, `_unused4` in type [Config](https://apidocs.levana.finance/msg/doc/levana_perpswap_cosmos_msg/contracts/market/config/struct.Config.html#structfield._unused1) to actual keys from blockchain `price_update_too_old_seconds`, `unpend_limit`, `limit_order_fee`, `staleness_seconds`
2. Keys whose values are of type Option can now be omitted in the following types: ExecuteMsg, QueryMsg.

If you follow the original documentation:

```typescript
const marketsResp = await levanaCosmWasmClient.queryContractSmart(FACTORY_ADDRESS, {
	markets: {
		limit: null,
		start_after: null,
	},
});
```

Now you can shorten it like this:

```typescript
const marketsResp = await levanaCosmWasmClient.queryContractSmart(FACTORY_ADDRESS, {
	markets: {},
});
```
3. In `index.ts`, the `ExecuteMsg` `QueryMsg` and `InstantiateMsg` types have been renamed due to name overlap:

./src/types/LevanaPerps/contracts/cw20/entry.d.ts:

`ExecuteMsg` > `Cw20ExecuteMsg`

`QueryMsg` > `Cw20QueryMsg`

`InstantiateMsg` > `Cw20InstantiateMsg`

./src/types/LevanaPerps/contracts/factory/entry.d.ts:

`ExecuteMsg` > `FactoryExecuteMsg`

`QueryMsg` > `FactoryQueryMsg`

`InstantiateMsg` > `FactoryInstantiateMsg`

./src/types/LevanaPerps/contracts/faucet/entry.d.ts:

`ExecuteMsg` > `FaucetExecuteMsg`

`QueryMsg` > `FaucetQueryMsg`

`InstantiateMsg` > `FaucetInstantiateMsg`

./src/types/LevanaPerps/contracts/liquidity_token/entry.d.ts:

`ExecuteMsg` > `LiquidityTokenExecuteMsg`

`QueryMsg` > `LiquidityTokenQueryMsg`

`InstantiateMsg` > `LiquidityTokenInstantiateMsg`

./src/types/LevanaPerps/contracts/market/entry.d.ts:

`ExecuteMsg` > `MarketExecuteMsg`

`QueryMsg` > `MarketQueryMsg`

`InstantiateMsg` > `MarketInstantiateMsg`

./src/types/LevanaPerps/contracts/position_token/entry.d.ts:

`ExecuteMsg` > `PositionTokenExecuteMsg`

`QueryMsg` > `PositionTokenQueryMsg`

`InstantiateMsg` > `PositionTokenInstantiateMsg`

./src/types/LevanaPerps/contracts/tracker/entry.d.ts:

`ExecuteMsg` > `TrackerExecuteMsg`

`QueryMsg` > `TrackerQueryMsg`
