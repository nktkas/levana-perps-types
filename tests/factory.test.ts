import { CosmWasmClient } from "npm:@cosmjs/cosmwasm-stargate@0.32.4";
import type { LevanaCosmWasmClient } from "../index.ts";
import { resolve } from "jsr:@std/path@0.225.2";
import * as tsj from "npm:ts-json-schema-generator@2.3.0";
import { Ajv } from "npm:ajv@8.16.0";
import { assertTSJSchema } from "./utils.ts";

// ———————————————Config———————————————

const RPC_ENDPOINT = "https://rpc.osmosis.zone";
const CONTRACT_ADDRESS = "osmo1ssw6x553kzqher0earlkwlxasfm2stnl3ms3ma2zz4tnajxyyaaqlucd45";
const TYPES_PATH = resolve("./src/types/LevanaPerps/contracts/factory/entry.d.ts");

// ———————————————Prepare———————————————

const client = await CosmWasmClient.connect(RPC_ENDPOINT) as LevanaCosmWasmClient;

const tsjSchemaGenerator = tsj.createGenerator({ path: TYPES_PATH });

const ajv = new Ajv({ strict: true });

const schema = tsjSchemaGenerator.createSchema("MarketInfoResponse");

const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
    market_info: {
        market_id: "BTC_USD",
    },
});

assertTSJSchema(ajv, schema, data);

// ———————————————Tests———————————————

Deno.test("FactoryQueryMsg", async (t) => {
    await t.step("version", async () => {
        const schema = tsjSchemaGenerator.createSchema("ContractVersion");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            version: {},
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("markets", async () => {
        const schema = tsjSchemaGenerator.createSchema("MarketsResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            markets: {},
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("market_info", async () => {
        const schema = tsjSchemaGenerator.createSchema("MarketInfoResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            market_info: {
                market_id: "BTC_USD",
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("addr_is_contract", async () => {
        const schema = tsjSchemaGenerator.createSchema("AddrIsContractResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            addr_is_contract: {
                addr: CONTRACT_ADDRESS,
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("factory_owner", async () => {
        const schema = tsjSchemaGenerator.createSchema("FactoryOwnerResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            factory_owner: {},
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("shutdown_status", async () => {
        const schema = tsjSchemaGenerator.createSchema("ShutdownStatus");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            shutdown_status: {
                market_id: "BTC_USD",
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("code_ids", async () => {
        const schema = tsjSchemaGenerator.createSchema("CodeIds");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            code_ids: {},
        });

        assertTSJSchema(ajv, schema, data);
    });
});
