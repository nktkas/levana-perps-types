import { CosmWasmClient } from "npm:@cosmjs/cosmwasm-stargate@0.32.4";
import type { LevanaCosmWasmClient } from "../index.d.ts";
import { resolve } from "jsr:@std/path@0.225.2";
import * as tsj from "npm:ts-json-schema-generator@2.3.0";
import { Ajv } from "npm:ajv@8.16.0";
import { assertTSJSchema } from "./utils.ts";

// ———————————————Config———————————————

const RPC_ENDPOINT = "https://rpc.osmosis.zone";
const CONTRACT_ADDRESS = "osmo1asnl3lfxvec0mv50jnzc2rswkzng9ngt99lx6dz55grslmcmcljsm3j8cm";
const TYPES_PATH = resolve("./src/types/LevanaPerps/contracts/position_token/entry.d.ts");

const POSITION_ID = "1000";
const POSITION_ID_OWNER = "osmo1djf6xt92yjhcg4qrddq2u3vag63g3u756h8fmr";

// ———————————————Prepare———————————————

const client = await CosmWasmClient.connect(RPC_ENDPOINT) as LevanaCosmWasmClient;

const tsjSchemaGenerator = tsj.createGenerator({ path: TYPES_PATH });

const ajv = new Ajv({ strict: true });

// ———————————————Tests———————————————

Deno.test("Cw20QueryMsg", async (t) => {
    await t.step("owner_of", async () => {
        const schema = tsjSchemaGenerator.createSchema("OwnerOfResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            owner_of: {
                token_id: POSITION_ID,
                include_expired: true,
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("approval", async () => {
        const schema = tsjSchemaGenerator.createSchema("ApprovalResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            approval: {
                token_id: POSITION_ID,
                spender: POSITION_ID_OWNER,
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("approvals", async () => {
        const schema = tsjSchemaGenerator.createSchema("ApprovalsResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            approvals: {
                token_id: POSITION_ID,
                include_expired: true,
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("all_operators", async () => {
        const schema = tsjSchemaGenerator.createSchema("OperatorsResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            all_operators: {
                owner: POSITION_ID_OWNER,
                include_expired: true,
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("num_tokens", async () => {
        const schema = tsjSchemaGenerator.createSchema("NumTokensResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            num_tokens: {},
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("contract_info", async () => {
        const schema = tsjSchemaGenerator.createSchema("NftContractInfo");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            contract_info: {},
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("nft_info", async () => {
        const schema = tsjSchemaGenerator.createSchema("NftInfoResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            nft_info: {
                token_id: POSITION_ID,
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("all_nft_info", async () => {
        const schema = tsjSchemaGenerator.createSchema("AllNftInfoResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            all_nft_info: {
                token_id: POSITION_ID,
                include_expired: true,
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("tokens", async () => {
        const schema = tsjSchemaGenerator.createSchema("TokensResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            tokens: {
                owner: POSITION_ID_OWNER,
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("all_tokens", async () => {
        const schema = tsjSchemaGenerator.createSchema("TokensResponse");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            all_tokens: {},
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
