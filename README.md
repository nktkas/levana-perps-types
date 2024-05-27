TypeScript LevanaPerps with minimal executable code and maximum type coverage from the Rust version of the contract documentation.

Source: https://apidocs.levana.finance/msg/doc/levana_perpswap_cosmos_msg/index.html

## Usage (Deno)

```typescript
import { LevanaPerpsExecute, LevanaPerpsQuery } from "https://raw.githubusercontent.com/nktkas/LevanaPerps/master/index.ts";
import { CosmWasmClient } from "https://esm.sh/@cosmjs/cosmwasm-stargate@0.32.3";

const RPC_ENDPOINT = "https://osmosis-rpc.publicnode.com:443";
const FACTORY_ADDRESS = "osmo1ssw6x553kzqher0earlkwlxasfm2stnl3ms3ma2zz4tnajxyyaaqlucd45";

const cosmWasmClient = await CosmWasmClient.connect(RPC_ENDPOINT);
const levanaPerpsQuery = new LevanaPerpsQuery(cosmWasmClient);

// TypeScript automatically recognizes a query and offers certain hints and returns the appropriate type for the query

const marketsResp = await levanaPerpsQuery.query(FACTORY_ADDRESS, {
	markets: {
		limit: null,
		start_after: null,
	},
});
console.log("All market ids:", marketsResp);

const marketInfoResponse = await levanaPerpsQuery.query(FACTORY_ADDRESS, {
	market_info: {
		market_id: marketsResp.markets[0],
	},
});
console.log("Market info:", marketInfoResponse);

const statusResp = await levanaPerpsQuery.query(marketInfoResponse.market_addr, {
	status: {
		price: null,
	},
});
console.log("Market status:", statusResp);

const tokensResponse = await levanaPerpsQuery.query(marketInfoResponse.market_addr, {
	nft_proxy: {
		nft_msg: {
			tokens: {
				owner: "osmo13euuwxeg62w2xw3ul8pyk2s4fq6awnh8tqgs5y",
				start_after: null,
				limit: null,
			},
		},
	},
});
console.log("Tokens:", tokensResponse);

// TypeScript will also notify you if you try to make a query that does not exist in the documentation

const marketLimitOrder = await levanaPerpsQuery.query(marketInfoResponse.market_addr, {
	// TS Error: Type '{}' is missing the following properties from type '{ owner: string; start_after: Option<string>; limit: Option<number>; order: Option<OrderInMessage>; }': owner, start_after, limit, order
	limit_orders: {},
});

const marketOraclePrice = await levanaPerpsQuery.query(marketInfoResponse.market_addr, {
	oracle_price: {
		// TS Error: Type 'number' is not assignable to type 'boolean'.
		validate_age: 0,
	},
});

const numTokensResponse = await levanaPerpsQuery.query(marketInfoResponse.market_addr, {
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
