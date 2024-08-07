# LevanaPerpsTypes

Types from [Rust documentation of Levana Perps](https://apidocs.levana.finance/msg/doc/levana_perpswap_cosmos_msg/index.html) in TypeScript

## Install

### NPM

```
npm i @nktkas/levana-perps-types
```

### Deno, Yarn, pnpm, Bun from [JSR](https://jsr.io/)

Visit https://jsr.io/@nktkas/levana-perps-types to learn about all the ways to install a package in your package manager

## Usage

### Query to Levana

```typescript
import type { LevanaCosmWasmClient } from "@nktkas/levana-perps-types";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

// Testnet factory address
const FACTORY_ADDRESS = "osmo1ymuvx9nydujjghgxxug28w48ptzcu9ysvnynqdw78qgteafj0syq247w5u";

// Osmosis testnet RPC endpoint
const RPC_ENDPOINT = "https://rpc.osmotest5.osmosis.zone";

// TypeScript automatically recognizes a query, offers certain hints, and returns the appropriate response type for the query
const levanaCosmWasmClient = await CosmWasmClient.connect("https://rpc.osmotest5.osmosis.zone") as LevanaCosmWasmClient;

const marketsResp = await levanaCosmWasmClient.queryContractSmart(FACTORY_ADDRESS, {
    markets: {},
});
console.log("Markets maintained by this factory:", marketsResp);

const marketInfoResponse = await levanaCosmWasmClient.queryContractSmart(FACTORY_ADDRESS, {
    market_info: {
        market_id: marketsResp.markets[0],
    },
});
console.log("Information about a specific market:", marketInfoResponse);

const statusResp = await levanaCosmWasmClient.queryContractSmart(marketInfoResponse.market_addr, {
    status: {},
});
console.log("Overall market status information:", statusResp);

const nftContractInfo = await levanaCosmWasmClient.queryContractSmart(marketInfoResponse.market_addr, {
    nft_proxy: {
        nft_msg: {
            contract_info: {},
        },
    },
});
console.log("Top-level metadata about the position contract:", nftContractInfo);
```

## License

This project is licensed under the MIT License. Check the [License file](LICENSE) for more info.
