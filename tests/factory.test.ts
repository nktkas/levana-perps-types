import { CosmWasmClient } from "npm:@cosmjs/cosmwasm-stargate@^0.32.4";
import type { LevanaCosmWasmClient } from "../index.d.ts";
import { resolve } from "jsr:@std/path@^1.0.2";
import * as tsj from "npm:ts-json-schema-generator@^2.3.0";
import { Ajv } from "npm:ajv@^8.17.1";
import { assertEquals, assertNotEquals } from "jsr:@std/assert@^1.0.2";
import { assertJsonSchema } from "./utils/assert.ts";

// ———————————————Config———————————————
// Everything must be testnet

const RPC_ENDPOINT = "https://rpc.testnet.osmosis.zone";
const FACTORY_ADDRESS = "osmo1ymuvx9nydujjghgxxug28w48ptzcu9ysvnynqdw78qgteafj0syq247w5u";
const MARKET_ADDRESS = "osmo1kus6tmx9ggmvgg5tf88ukgxcz0ynakx38hyjy0sjgahvp7d3ut2qqtfhf4"; // ATOM_USD

// ———————————————Prepare———————————————

const tsjSchemaGenerator = tsj.createGenerator({ path: resolve("./src/types/LevanaPerps/contracts/factory/entry.d.ts") });
const ajv = new Ajv({ strict: true });

const client = await CosmWasmClient.connect(RPC_ENDPOINT) as LevanaCosmWasmClient;

// ———————————————Tests———————————————

// Owner-only executions
Deno.test.ignore("FactoryExecuteMsg", () => {});

Deno.test("FactoryQueryMsg", async (t) => {
    await t.step("version", async () => {
        const data = await client.queryContractSmart(FACTORY_ADDRESS, { version: {} });

        const schema = tsjSchemaGenerator.createSchema("ContractVersion");
        assertJsonSchema(ajv, schema, data);
    });

    await t.step("markets", async (t) => {
        await t.step("MarketsResp", async () => {
            const data = await client.queryContractSmart(FACTORY_ADDRESS, { markets: {} });

            const schema = tsjSchemaGenerator.createSchema("MarketsResp");
            assertJsonSchema(ajv, schema, data);
        });

        await t.step("markets.limit", async () => {
            const data = await client.queryContractSmart(FACTORY_ADDRESS, { markets: { limit: 2 } });

            const schema = tsjSchemaGenerator.createSchema("MarketsResp");
            assertJsonSchema(ajv, schema, data);
            assertEquals(data.markets.length, 2);
        });

        await t.step("markets.start_after", async () => {
            const data1 = await client.queryContractSmart(FACTORY_ADDRESS, { markets: { limit: 2 } });
            const data2 = await client.queryContractSmart(FACTORY_ADDRESS, {
                markets: { limit: 2, start_after: data1.markets[data1.markets.length - 1] },
            });

            const schema = tsjSchemaGenerator.createSchema("MarketsResp");
            assertJsonSchema(ajv, schema, data2);
            assertNotEquals(JSON.stringify(data1), JSON.stringify(data2));
        });
    });

    await t.step("market_info", async () => {
        const data = await client.queryContractSmart(FACTORY_ADDRESS, { market_info: { market_id: "ATOM_USD" } });

        const schema = tsjSchemaGenerator.createSchema("MarketInfoResponse");
        assertJsonSchema(ajv, schema, data);
    });

    await t.step("addr_is_contract", async () => {
        const data = await client.queryContractSmart(FACTORY_ADDRESS, { addr_is_contract: { addr: MARKET_ADDRESS } });

        const schema = tsjSchemaGenerator.createSchema("AddrIsContractResp");
        assertJsonSchema(ajv, schema, data);
    });

    await t.step("factory_owner", async () => {
        const data = await client.queryContractSmart(FACTORY_ADDRESS, { factory_owner: {} });

        const schema = tsjSchemaGenerator.createSchema("FactoryOwnerResp");
        assertJsonSchema(ajv, schema, data);
    });

    await t.step("shutdown_status", async () => {
        const data = await client.queryContractSmart(FACTORY_ADDRESS, { shutdown_status: { market_id: "ATOM_USD" } });

        const schema = tsjSchemaGenerator.createSchema("ShutdownStatus");
        assertJsonSchema(ajv, schema, data);
    });

    await t.step("code_ids", async () => {
        const data = await client.queryContractSmart(FACTORY_ADDRESS, { code_ids: {} });

        const schema = tsjSchemaGenerator.createSchema("CodeIds");
        assertJsonSchema(ajv, schema, data);
    });
});
