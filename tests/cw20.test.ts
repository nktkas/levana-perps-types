import { CosmWasmClient } from "npm:@cosmjs/cosmwasm-stargate@0.32.4";
import type { LevanaCosmWasmClient } from "../index.d.ts";
import { resolve } from "jsr:@std/path@0.225.2";
import * as tsj from "npm:ts-json-schema-generator@2.3.0";
import { Ajv } from "npm:ajv@8.16.0";
import { assertTSJSchema } from "./utils.ts";

// ———————————————Config———————————————

const RPC_ENDPOINT = "https://rpc.testnet.osmosis.zone";
const CONTRACT_ADDRESS = "osmo1g68w56vq9q0vr2mdlzp2l80j0lelnffkn7y3zhek5pavtxzznuks8wkv6k";
const TYPES_PATH = resolve("./src/types/LevanaPerps/contracts/cw20/entry.d.ts");

// ———————————————Prepare———————————————

const client = await CosmWasmClient.connect(RPC_ENDPOINT) as LevanaCosmWasmClient;

const tsjSchemaGenerator = tsj.createGenerator({ path: TYPES_PATH });

const ajv = new Ajv({ strict: true });

// ———————————————Tests———————————————

Deno.test("Cw20QueryMsg", async (t) => {
    await t.step("balance", async () => {
        const schema = tsjSchemaGenerator.createSchema("BalanceResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            balance: {
                address: "osmo1djf6xt92yjhcg4qrddq2u3vag63g3u756h8fmr",
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("token_info", async () => {
        const schema = tsjSchemaGenerator.createSchema("TokenInfoResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            token_info: {},
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("minter", async () => {
        const schema = tsjSchemaGenerator.createSchema("MinterResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            minter: {},
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("allowance", async () => {
        const schema = tsjSchemaGenerator.createSchema("AllowanceResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            allowance: {
                owner: "osmo1djf6xt92yjhcg4qrddq2u3vag63g3u756h8fmr",
                spender: "osmo1djf6xt92yjhcg4qrddq2u3vag63g3u756h8fmr",
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("all_allowances", async () => {
        const schema = tsjSchemaGenerator.createSchema("AllAllowancesResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            all_allowances: {
                owner: "osmo1djf6xt92yjhcg4qrddq2u3vag63g3u756h8fmr",
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("all_spender_allowances", async () => {
        const schema = tsjSchemaGenerator.createSchema("AllSpenderAllowancesResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            all_spender_allowances: {
                spender: "osmo1djf6xt92yjhcg4qrddq2u3vag63g3u756h8fmr",
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("all_accounts", async () => {
        const schema = tsjSchemaGenerator.createSchema("AllAccountsResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            all_accounts: {},
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("marketing_info", async () => {
        const schema = tsjSchemaGenerator.createSchema("MarketingInfoResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            marketing_info: {},
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("download_logo", async () => {
        const schema = tsjSchemaGenerator.createSchema("DownloadLogoResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            download_logo: {},
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("version", async () => {
        const schema = tsjSchemaGenerator.createSchema("ContractVersion");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            version: {},
        });

        assertTSJSchema(ajv, schema, data);
    });
});
