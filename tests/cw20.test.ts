import { resolve } from "jsr:@std/path@^1.0.2";
import * as tsj from "npm:ts-json-schema-generator@^2.3.0";
import { Ajv } from "npm:ajv@^8.17.1";
import "jsr:@std/dotenv@^0.225.0/load";
import { assertNotEquals, assertObjectMatch } from "jsr:@std/assert@^1.0.2";
import type { LevanaSigningCosmWasmClient } from "../index.d.ts";
import { generatePrivateKey, getAddressFromPrivateKey, getSigningCosmWasmClientFromPrivateKey } from "./utils/cosmwasm.ts";
import { assertJsonSchema } from "./utils/assert.ts";

// ———————————————Config———————————————
// Everything must be testnet

const RPC_ENDPOINT = "https://rpc.testnet.osmosis.zone";
const CW20_ADDRESS = "osmo1g68w56vq9q0vr2mdlzp2l80j0lelnffkn7y3zhek5pavtxzznuks8wkv6k"; // ATOM
const MARKET_ADDRESS = "osmo1kus6tmx9ggmvgg5tf88ukgxcz0ynakx38hyjy0sjgahvp7d3ut2qqtfhf4"; // ATOM_USD

// ———————————————Initialization———————————————

const PRIVATE_KEY = Deno.env.get("PRIVATE_KEY");
if (!PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is required");
}

const tsjSchemaGenerator = tsj.createGenerator({ path: resolve("./src/types/LevanaPerps/contracts/cw20/entry.d.ts") });
const ajv = new Ajv({ strict: true });

const client = await getSigningCosmWasmClientFromPrivateKey(PRIVATE_KEY, RPC_ENDPOINT, "osmo", "0.025uosmo") as LevanaSigningCosmWasmClient;
const walletAddress = await getAddressFromPrivateKey(PRIVATE_KEY, "osmo");

// ———————————————Tests———————————————
// TODO: Add a test completeness check. Compare Cw20ExecuteMsg/Cw20QueryMsg with the schema saved here

Deno.test("Cw20ExecuteMsg", async (t) => {
    const tempPrivateKey1 = generatePrivateKey();
    const tempClient1 = await getSigningCosmWasmClientFromPrivateKey(tempPrivateKey1, RPC_ENDPOINT, "osmo", "0.025uosmo") as LevanaSigningCosmWasmClient;
    const tempWalletAddress1 = await getAddressFromPrivateKey(tempPrivateKey1, "osmo");
    await client.sendTokens(walletAddress, tempWalletAddress1, [{ denom: "uosmo", amount: "40000" }], "auto");
    await client.execute(walletAddress, CW20_ADDRESS, { transfer: { recipient: tempWalletAddress1, amount: "100000" } }, "auto");

    const tempPrivateKey2 = generatePrivateKey();
    const tempClient2 = await getSigningCosmWasmClientFromPrivateKey(tempPrivateKey2, RPC_ENDPOINT, "osmo", "0.025uosmo") as LevanaSigningCosmWasmClient;
    const tempWalletAddress2 = await getAddressFromPrivateKey(tempPrivateKey2, "osmo");
    await client.sendTokens(walletAddress, tempWalletAddress2, [{ denom: "uosmo", amount: "20000" }], "auto");

    await t.step("transfer", async () => {
        await tempClient1.execute(
            tempWalletAddress1,
            CW20_ADDRESS,
            { transfer: { recipient: tempWalletAddress2, amount: "100" } },
            "auto",
        );
    });

    await t.step("burn", async () => {
        await tempClient1.execute(
            tempWalletAddress1,
            CW20_ADDRESS,
            { burn: { amount: "100" } },
            "auto",
        );
    });

    await t.step("send", async () => {
        await tempClient1.execute(
            tempWalletAddress1,
            CW20_ADDRESS,
            {
                send: {
                    contract: MARKET_ADDRESS,
                    amount: "100",
                    msg: "eyJwcm92aWRlX2NyYW5rX2Z1bmRzIjp7fX0", // {"provide_crank_funds":{}}
                },
            },
            "auto",
        );
    });

    const increase_allowance_test = await t.step("increase_allowance", async (t) => {
        await t.step("increase_allowance.expires == undefined", async () => {
            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                { increase_allowance: { spender: tempWalletAddress2, amount: "1000" } },
                "auto",
            );
        });

        await t.step("increase_allowance.expires.at_height", async () => {
            const blockHeight = await tempClient1.getHeight();
            const at_height = blockHeight + 1000;

            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                {
                    increase_allowance: {
                        spender: tempWalletAddress2,
                        amount: "1000",
                        expires: { at_height },
                    },
                },
                "auto",
            );
        });

        await t.step("increase_allowance.expires.at_time", async () => {
            const at_time = (Date.now() + 3600_000).toString();

            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                {
                    increase_allowance: {
                        spender: tempWalletAddress2,
                        amount: "1000",
                        expires: { at_time },
                    },
                },
                "auto",
            );
        });

        await t.step("increase_allowance.expires.never", async () => {
            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                {
                    increase_allowance: {
                        spender: tempWalletAddress2,
                        amount: "1000",
                        expires: { never: {} },
                    },
                },
                "auto",
            );
        });
    });

    await t.step({
        name: "transfer_from",
        fn: async () => {
            await tempClient2.execute(
                tempWalletAddress2,
                CW20_ADDRESS,
                { transfer_from: { owner: tempWalletAddress1, recipient: tempWalletAddress2, amount: "100" } },
                "auto",
            );
        },
        ignore: !increase_allowance_test,
    });

    await t.step({
        name: "send_from",
        fn: async () => {
            await tempClient2.execute(
                tempWalletAddress2,
                CW20_ADDRESS,
                {
                    send_from: {
                        owner: tempWalletAddress1,
                        contract: MARKET_ADDRESS,
                        amount: "100",
                        msg: "eyJwcm92aWRlX2NyYW5rX2Z1bmRzIjp7fX0", // {"provide_crank_funds":{}}
                    },
                },
                "auto",
            );
        },
        ignore: !increase_allowance_test,
    });

    await t.step({
        name: "burn_from",
        fn: async () => {
            await tempClient2.execute(
                tempWalletAddress2,
                CW20_ADDRESS,
                { burn_from: { owner: tempWalletAddress1, amount: "100" } },
                "auto",
            );
        },
        ignore: !increase_allowance_test,
    });

    await t.step({
        name: "decrease_allowance",
        fn: async (t) => {
            await t.step("decrease_allowance.expires == undefined", async () => {
                await tempClient1.execute(
                    tempWalletAddress1,
                    CW20_ADDRESS,
                    { decrease_allowance: { spender: tempWalletAddress2, amount: "100" } },
                    "auto",
                );
            });

            await t.step("decrease_allowance.expires.at_height", async () => {
                const blockHeight = await tempClient1.getHeight();
                const at_height = blockHeight + 100;

                await tempClient1.execute(
                    tempWalletAddress1,
                    CW20_ADDRESS,
                    {
                        decrease_allowance: {
                            spender: tempWalletAddress2,
                            amount: "100",
                            expires: { at_height },
                        },
                    },
                    "auto",
                );
            });

            await t.step("decrease_allowance.expires.at_time", async () => {
                const at_time = (Date.now() + 3600_000).toString();

                await tempClient1.execute(
                    tempWalletAddress1,
                    CW20_ADDRESS,
                    {
                        decrease_allowance: {
                            spender: tempWalletAddress2,
                            amount: "100",
                            expires: { at_time },
                        },
                    },
                    "auto",
                );
            });

            await t.step("decrease_allowance.expires.never", async () => {
                await tempClient1.execute(
                    tempWalletAddress1,
                    CW20_ADDRESS,
                    {
                        decrease_allowance: {
                            spender: tempWalletAddress2,
                            amount: "100",
                            expires: { never: {} },
                        },
                    },
                    "auto",
                );
            });
        },
        ignore: !increase_allowance_test,
    });

    // Owner-only executions
    await t.step({ name: "mint", fn: () => {}, ignore: true });
    await t.step({ name: "update_minter", fn: () => {}, ignore: true });
    await t.step({ name: "update_marketing", fn: () => {}, ignore: true });
    await t.step({ name: "upload_logo", fn: () => {}, ignore: true });
    await t.step({ name: "set_market", fn: () => {}, ignore: true });
});

Deno.test("Cw20QueryMsg", async (t) => {
    const tempPrivateKey1 = generatePrivateKey();
    const tempClient1 = await getSigningCosmWasmClientFromPrivateKey(tempPrivateKey1, RPC_ENDPOINT, "osmo", "0.025uosmo") as LevanaSigningCosmWasmClient;
    const tempWalletAddress1 = await getAddressFromPrivateKey(tempPrivateKey1, "osmo");
    await client.sendTokens(walletAddress, tempWalletAddress1, [{ denom: "uosmo", amount: "50000" }], "auto");
    await client.execute(walletAddress, CW20_ADDRESS, { transfer: { recipient: tempWalletAddress1, amount: "100000" } }, "auto");

    const tempPrivateKey2 = generatePrivateKey();
    const tempClient2 = await getSigningCosmWasmClientFromPrivateKey(tempPrivateKey2, RPC_ENDPOINT, "osmo", "0.025uosmo") as LevanaSigningCosmWasmClient;
    const tempWalletAddress2 = await getAddressFromPrivateKey(tempPrivateKey2, "osmo");
    await client.sendTokens(walletAddress, tempWalletAddress2, [{ denom: "uosmo", amount: "5000" }], "auto");
    await client.execute(walletAddress, CW20_ADDRESS, { transfer: { recipient: tempWalletAddress2, amount: "1000" } }, "auto");

    await t.step("balance", async () => {
        const data = await tempClient1.queryContractSmart(CW20_ADDRESS, { balance: { address: tempWalletAddress1 } });

        const schema = tsjSchemaGenerator.createSchema("BalanceResponse");
        assertJsonSchema(ajv, schema, data);
    });

    await t.step("token_info", async () => {
        const data = await tempClient1.queryContractSmart(CW20_ADDRESS, { token_info: {} });

        const schema = tsjSchemaGenerator.createSchema("TokenInfoResponse");
        assertJsonSchema(ajv, schema, data);
    });

    await t.step("minter", async (t) => {
        await t.step("MinterResponse", async () => {
            const data = await tempClient1.queryContractSmart(CW20_ADDRESS, { minter: {} });

            const schema = tsjSchemaGenerator.createSchema("MinterResponse");
            assertJsonSchema(ajv, schema, data);
        });

        // Could not find a cw20 contract with MinterResponse.cap != null
        await t.step({ name: "MinterResponse.cap", fn: () => {}, ignore: true });
    });

    await t.step("allowance", async (t) => {
        await t.step("AllowanceResponse", async () => {
            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                { increase_allowance: { spender: tempWalletAddress2, amount: "100" } },
                "auto",
            );

            const data = await tempClient1.queryContractSmart(CW20_ADDRESS, {
                allowance: {
                    owner: tempWalletAddress1,
                    spender: tempWalletAddress2,
                },
            });

            const schema = tsjSchemaGenerator.createSchema("AllowanceResponse");
            assertJsonSchema(ajv, schema, data);
        });

        await t.step("AllowanceResponse.expires.at_height", async () => {
            const blockHeight = await tempClient1.getHeight();
            const at_height = blockHeight + 1000;
            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                { increase_allowance: { spender: tempWalletAddress2, amount: "100", expires: { at_height } } },
                "auto",
            );

            const data = await tempClient1.queryContractSmart(CW20_ADDRESS, {
                allowance: {
                    owner: tempWalletAddress1,
                    spender: tempWalletAddress2,
                },
            });

            const schema = tsjSchemaGenerator.createSchema("AllowanceResponse");
            assertJsonSchema(ajv, schema, data);
            assertObjectMatch(data.expires, { at_height });
        });

        await t.step("AllowanceResponse.expires.at_time", async () => {
            const at_time = (Date.now() + 3600_000).toString();
            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                { increase_allowance: { spender: tempWalletAddress2, amount: "1000", expires: { at_time } } },
                "auto",
            );

            const data = await tempClient1.queryContractSmart(CW20_ADDRESS, {
                allowance: {
                    owner: tempWalletAddress1,
                    spender: tempWalletAddress2,
                },
            });

            const schema = tsjSchemaGenerator.createSchema("AllowanceResponse");
            assertJsonSchema(ajv, schema, data);
            assertObjectMatch(data.expires, { at_time });
        });

        await t.step("AllowanceResponse.expires.never", async () => {
            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                { increase_allowance: { spender: tempWalletAddress2, amount: "1000", expires: { never: {} } } },
                "auto",
            );

            const data = await tempClient1.queryContractSmart(CW20_ADDRESS, {
                allowance: {
                    owner: tempWalletAddress1,
                    spender: tempWalletAddress2,
                },
            });

            const schema = tsjSchemaGenerator.createSchema("AllowanceResponse");
            assertJsonSchema(ajv, schema, data);
            assertObjectMatch(data.expires, { never: {} });
        });
    });

    await t.step("all_allowances", async (t) => {
        await t.step("AllAllowancesResponse", async () => {
            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                { increase_allowance: { spender: tempWalletAddress2, amount: "100" } },
                "auto",
            );
            const data = await tempClient1.queryContractSmart(CW20_ADDRESS, { all_allowances: { owner: tempWalletAddress1 } });

            const schema = tsjSchemaGenerator.createSchema("AllAllowancesResponse");
            assertJsonSchema(ajv, schema, data);
        });

        await t.step("AllAllowancesResponse.allowances[0].expires.at_height", async () => {
            const blockHeight = await tempClient1.getHeight();
            const at_height = blockHeight + 1000;
            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                { increase_allowance: { spender: tempWalletAddress2, amount: "100", expires: { at_height } } },
                "auto",
            );

            const data = await tempClient1.queryContractSmart(CW20_ADDRESS, { all_allowances: { owner: tempWalletAddress1 } });

            const schema = tsjSchemaGenerator.createSchema("AllAllowancesResponse");
            assertJsonSchema(ajv, schema, data);
            assertObjectMatch(data.allowances[0]?.expires, { at_height });
        });

        await t.step("AllAllowancesResponse.allowances[0].expires.at_time", async () => {
            const at_time = (Date.now() + 3600_000).toString();
            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                { increase_allowance: { spender: tempWalletAddress2, amount: "100", expires: { at_time } } },
                "auto",
            );

            const data = await tempClient1.queryContractSmart(CW20_ADDRESS, { all_allowances: { owner: tempWalletAddress1 } });

            const schema = tsjSchemaGenerator.createSchema("AllAllowancesResponse");
            assertJsonSchema(ajv, schema, data);
            assertObjectMatch(data.allowances[0]?.expires, { at_time });
        });

        await t.step("AllAllowancesResponse.allowances[0].expires.never", async () => {
            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                { increase_allowance: { spender: tempWalletAddress2, amount: "100", expires: { never: {} } } },
                "auto",
            );

            const data = await tempClient1.queryContractSmart(CW20_ADDRESS, { all_allowances: { owner: tempWalletAddress1 } });

            const schema = tsjSchemaGenerator.createSchema("AllAllowancesResponse");
            assertJsonSchema(ajv, schema, data);
            assertObjectMatch(data.allowances[0]?.expires, { never: {} });
        });

        const tempPrivateKey3 = generatePrivateKey();
        const tempWalletAddress3 = await getAddressFromPrivateKey(tempPrivateKey3, "osmo");
        await tempClient1.executeMultiple(tempWalletAddress1, [
            { contractAddress: CW20_ADDRESS, msg: { increase_allowance: { spender: tempWalletAddress2, amount: "100" } } },
            { contractAddress: CW20_ADDRESS, msg: { increase_allowance: { spender: tempWalletAddress3, amount: "100" } } },
        ], "auto");

        await t.step("all_allowances.limit", async () => {
            const data1 = await tempClient1.queryContractSmart(CW20_ADDRESS, {
                all_allowances: {
                    owner: tempWalletAddress1,
                },
            });
            const data2 = await tempClient1.queryContractSmart(CW20_ADDRESS, {
                all_allowances: {
                    owner: tempWalletAddress1,
                    limit: 1,
                },
            });

            const schema = tsjSchemaGenerator.createSchema("AllAllowancesResponse");
            assertJsonSchema(ajv, schema, data2);
            assertNotEquals(data1.allowances.length, data2.allowances.length);
        });

        await t.step("all_allowances.start_after", async () => {
            const data1 = await tempClient1.queryContractSmart(CW20_ADDRESS, {
                all_allowances: {
                    owner: tempWalletAddress1,
                    limit: 1,
                },
            });
            const data2 = await tempClient1.queryContractSmart(CW20_ADDRESS, {
                all_allowances: {
                    owner: tempWalletAddress1,
                    limit: 1,
                    start_after: data1.allowances[0].spender,
                },
            });

            const schema = tsjSchemaGenerator.createSchema("AllAllowancesResponse");
            assertJsonSchema(ajv, schema, data2);
            assertNotEquals(JSON.stringify(data1), JSON.stringify(data2));
        });
    });

    await t.step("all_spender_allowances", async (t) => {
        await t.step("AllSpenderAllowancesResponse", async () => {
            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                { increase_allowance: { spender: tempWalletAddress2, amount: "100" } },
                "auto",
            );

            const data = await tempClient1.queryContractSmart(CW20_ADDRESS, { all_spender_allowances: { spender: tempWalletAddress2 } });

            const schema = tsjSchemaGenerator.createSchema("AllSpenderAllowancesResponse");
            assertJsonSchema(ajv, schema, data);
        });

        await t.step("AllSpenderAllowancesResponse.allowances[0].expires.at_height", async () => {
            const blockHeight = await tempClient1.getHeight();
            const at_height = blockHeight + 1000;
            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                { increase_allowance: { spender: tempWalletAddress2, amount: "100", expires: { at_height } } },
                "auto",
            );

            const data = await tempClient1.queryContractSmart(CW20_ADDRESS, { all_spender_allowances: { spender: tempWalletAddress2 } });

            const schema = tsjSchemaGenerator.createSchema("AllSpenderAllowancesResponse");
            assertJsonSchema(ajv, schema, data);
            assertObjectMatch(data.allowances[0]?.expires, { at_height });
        });

        await t.step("AllSpenderAllowancesResponse.allowances[0].expires.at_time", async () => {
            const at_time = (Date.now() + 3600_000).toString();
            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                { increase_allowance: { spender: tempWalletAddress2, amount: "100", expires: { at_time } } },
                "auto",
            );

            const data = await tempClient1.queryContractSmart(CW20_ADDRESS, { all_spender_allowances: { spender: tempWalletAddress2 } });

            const schema = tsjSchemaGenerator.createSchema("AllSpenderAllowancesResponse");
            assertJsonSchema(ajv, schema, data);
            assertObjectMatch(data.allowances[0]?.expires, { at_time });
        });

        await t.step("AllSpenderAllowancesResponse.allowances[0].expires.never", async () => {
            await tempClient1.execute(
                tempWalletAddress1,
                CW20_ADDRESS,
                { increase_allowance: { spender: tempWalletAddress2, amount: "100", expires: { never: {} } } },
                "auto",
            );

            const data = await tempClient1.queryContractSmart(CW20_ADDRESS, { all_spender_allowances: { spender: tempWalletAddress2 } });

            const schema = tsjSchemaGenerator.createSchema("AllSpenderAllowancesResponse");
            assertJsonSchema(ajv, schema, data);
            assertObjectMatch(data.allowances[0]?.expires, { never: {} });
        });

        const tempPrivateKey3 = generatePrivateKey();
        const tempWalletAddress3 = await getAddressFromPrivateKey(tempPrivateKey3, "osmo");
        await Promise.all([
            tempClient1.execute(tempWalletAddress1, CW20_ADDRESS, { increase_allowance: { spender: tempWalletAddress3, amount: "100" } }, "auto"),
            tempClient2.execute(tempWalletAddress2, CW20_ADDRESS, { increase_allowance: { spender: tempWalletAddress3, amount: "100" } }, "auto"),
        ]);

        await t.step("all_spender_allowances.limit", async () => {
            const data1 = await tempClient1.queryContractSmart(CW20_ADDRESS, {
                all_spender_allowances: {
                    spender: tempWalletAddress3,
                },
            });
            const data2 = await tempClient1.queryContractSmart(CW20_ADDRESS, {
                all_spender_allowances: {
                    spender: tempWalletAddress3,
                    limit: 1,
                },
            });

            const schema = tsjSchemaGenerator.createSchema("AllSpenderAllowancesResponse");
            assertJsonSchema(ajv, schema, data2);
            assertNotEquals(data1.allowances.length, data2.allowances.length);
        });

        await t.step("all_spender_allowances.start_after", async () => {
            const data1 = await tempClient1.queryContractSmart(CW20_ADDRESS, {
                all_spender_allowances: {
                    spender: tempWalletAddress2,
                    limit: 1,
                },
            });
            const data2 = await tempClient1.queryContractSmart(CW20_ADDRESS, {
                all_spender_allowances: {
                    spender: tempWalletAddress2,
                    limit: 1,
                    start_after: data1.allowances[0].owner,
                },
            });

            const schema = tsjSchemaGenerator.createSchema("AllSpenderAllowancesResponse");
            assertJsonSchema(ajv, schema, data2);
            assertNotEquals(JSON.stringify(data1), JSON.stringify(data2));
        });
    });

    await t.step("all_accounts", async (t) => {
        await t.step("AllAccountsResponse", async () => {
            const data = await tempClient1.queryContractSmart(CW20_ADDRESS, { all_accounts: {} });

            const schema = tsjSchemaGenerator.createSchema("AllAccountsResponse");
            assertJsonSchema(ajv, schema, data);
        });

        await t.step("all_accounts.limit", async () => {
            const data1 = await tempClient1.queryContractSmart(CW20_ADDRESS, { all_accounts: {} });
            const data2 = await tempClient1.queryContractSmart(CW20_ADDRESS, { all_accounts: { limit: 2 } });

            const schema = tsjSchemaGenerator.createSchema("AllAccountsResponse");
            assertJsonSchema(ajv, schema, data2);
            assertNotEquals(data1.accounts.length, data2.accounts.length);
        });

        await t.step("all_accounts.start_after", async () => {
            const data1 = await tempClient1.queryContractSmart(CW20_ADDRESS, {
                all_accounts: {
                    limit: 7,
                },
            });
            const data2 = await tempClient1.queryContractSmart(CW20_ADDRESS, {
                all_accounts: {
                    limit: 7,
                    start_after: data1.accounts[data1.accounts.length - 1],
                },
            });

            const schema = tsjSchemaGenerator.createSchema("AllAccountsResponse");
            assertJsonSchema(ajv, schema, data2);
            assertNotEquals(JSON.stringify(data1), JSON.stringify(data2));
        });
    });

    await t.step("marketing_info", async (t) => {
        await t.step("MarketingInfoResponse", async () => {
            const data = await tempClient1.queryContractSmart(CW20_ADDRESS, { marketing_info: {} });

            const schema = tsjSchemaGenerator.createSchema("MarketingInfoResponse");
            assertJsonSchema(ajv, schema, data);
        });

        // Unable to check all fields individually
        await t.step({ name: "MarketingInfoResponse.project", fn: () => {}, ignore: true });
        await t.step({ name: "MarketingInfoResponse.description", fn: () => {}, ignore: true });
        await t.step({ name: "MarketingInfoResponse.logo", fn: () => {}, ignore: true });
        await t.step({ name: "MarketingInfoResponse.marketing", fn: () => {}, ignore: true });
    });

    // Could not find a cw20 contract with DownloadLogoResponse
    await t.step({ name: "download_logo", fn: () => {}, ignore: true });

    await t.step("version", async () => {
        const data = await tempClient1.queryContractSmart(CW20_ADDRESS, { version: {} });

        const schema = tsjSchemaGenerator.createSchema("ContractVersion");
        assertJsonSchema(ajv, schema, data);
    });
});
