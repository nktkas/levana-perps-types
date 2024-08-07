import { CosmWasmClient } from "npm:@cosmjs/cosmwasm-stargate@0.32.4";
import type { LevanaCosmWasmClient } from "../index.d.ts";
import { resolve } from "jsr:@std/path@0.225.2";
import * as tsj from "npm:ts-json-schema-generator@2.3.0";
import { Ajv } from "npm:ajv@8.16.0";
import { assertTSJSchema } from "./utils.ts";

// ———————————————Config———————————————

const RPC_ENDPOINT = "https://rpc.osmosis.zone";
const CONTRACT_ADDRESS = "osmo127aqy4697zqn27z0vqr3x2n8lraf27t7udvl6ef5hcwmwhjadegq9vytdj";
const TYPES_PATH = resolve("./src/types/LevanaPerps/contracts/market/entry.d.ts");

const LIMIT_ORDER_ID = "1000";
const OPEN_POSITION_ID = "1000";
const CLOSE_POSITION_ID = "1000";
const LIMIT_ORDER_OWNER = "osmo1djf6xt92yjhcg4qrddq2u3vag63g3u756h8fmr";
const CLOSED_POSITION_HISTORY_OWNER = "osmo1djf6xt92yjhcg4qrddq2u3vag63g3u756h8fmr";
const TRADE_HISTORY_SUMMARY_ADDR = "osmo1djf6xt92yjhcg4qrddq2u3vag63g3u756h8fmr";
const LP_ACTION_HISTORY_ADDR = "osmo1djf6xt92yjhcg4qrddq2u3vag63g3u756h8fmr";
const LIMIT_ORDER_HISTORY_ADDR = "osmo1djf6xt92yjhcg4qrddq2u3vag63g3u756h8fmr";
const LP_INFO_LIQUIDITY_PROVIDER = "osmo1sxrfeyn6ys4tf9g3vmvj9nsndk86rptw38622sav2xlc3jd8ce8qtafxmc";
const LIST_DEFERRED_EXECS_ADDR = "osmo1djf6xt92yjhcg4qrddq2u3vag63g3u756h8fmr";
const GET_DEFERRED_EXEC_ID = "1000";

// ———————————————Prepare———————————————

const client = await CosmWasmClient.connect(RPC_ENDPOINT) as LevanaCosmWasmClient;

const tsjSchemaGenerator = tsj.createGenerator({ path: TYPES_PATH });

const ajv = new Ajv({ allErrors: true, strict: true });

// ———————————————Tests———————————————

Deno.test("MarketQueryMsg", async (t) => {
    await t.step("version", async () => {
        const schema = tsjSchemaGenerator.createSchema("ContractVersion");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            version: {},
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("status", async () => {
        const schema = tsjSchemaGenerator.createSchema("StatusResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            status: {},
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("spot_price", async () => {
        const schema = tsjSchemaGenerator.createSchema("PricePoint");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            spot_price: {},
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("spot_price_history", async () => {
        const schema = tsjSchemaGenerator.createSchema("SpotPriceHistoryResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            spot_price_history: {},
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("oracle_price", async () => {
        const schema = tsjSchemaGenerator.createSchema("OraclePriceResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            oracle_price: {
                validate_age: false,
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("positions", async () => {
        const schema = tsjSchemaGenerator.createSchema("PositionsResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            positions: {
                position_ids: [OPEN_POSITION_ID, CLOSE_POSITION_ID],
            },
        });

        if (data.closed.length == 0 && data.pending_close.length == 0 && data.positions.length == 0) {
            throw new Error("The list of positions is empty. It is not possible to check all types.");
        }
        if (data.closed.length == 0 && data.pending_close.length == 0) {
            throw new Error("There is no closed position in the list of positions. It is not possible to check all types.");
        }
        if (data.positions.length == 0) {
            throw new Error("There is no open position in the list of positions. It is not possible to check all types.");
        }

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("limit_order", async () => {
        const schema = tsjSchemaGenerator.createSchema("LimitOrderResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            limit_order: {
                order_id: LIMIT_ORDER_ID,
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("limit_orders", async () => {
        const schema = tsjSchemaGenerator.createSchema("LimitOrdersResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            limit_orders: {
                owner: LIMIT_ORDER_OWNER,
            },
        });

        if (data.orders.length == 0) {
            throw new Error("The list of limit orders is empty. It is not possible to check all types.");
        }

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("closed_position_history", async () => {
        const schema = tsjSchemaGenerator.createSchema("ClosedPositionsResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            closed_position_history: {
                owner: CLOSED_POSITION_HISTORY_OWNER,
            },
        });

        if (data.positions.length == 0) {
            throw new Error("The list of closed positions is empty. It is not possible to check all types.");
        }

        assertTSJSchema(ajv, schema, data);
    });

    // TODO: It's not done
    // await t.step("nft_proxy", async () => {
    //     const schema = tsjSchemaGenerator.createSchema("QueryResponse");

    //     const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
    //         nft_proxy: {},
    //     });

    //     assertTSJSchema(ajv, schema, data);
    // });

    // TODO: It's not done
    // await t.step("liquidity_token_proxy", async () => {
    //     const schema = tsjSchemaGenerator.createSchema("QueryResponse");

    //     const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
    //         liquidity_token_proxy: {},
    //     });

    //     assertTSJSchema(ajv, schema, data);
    // });

    await t.step("trade_history_summary", async () => {
        const schema = tsjSchemaGenerator.createSchema("TradeHistorySummary");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            trade_history_summary: {
                addr: TRADE_HISTORY_SUMMARY_ADDR,
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("position_action_history", async () => {
        const schema = tsjSchemaGenerator.createSchema("PositionActionHistoryResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            position_action_history: {
                id: OPEN_POSITION_ID,
            },
        });

        if (data.actions.length == 0) {
            throw new Error("The list of position actions is empty. It is not possible to check all types.");
        }

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("trader_action_history", async () => {
        const schema = tsjSchemaGenerator.createSchema("TraderActionHistoryResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            trader_action_history: {
                owner: TRADE_HISTORY_SUMMARY_ADDR,
            },
        });

        if (data.actions.length == 0) {
            throw new Error("The list of trader actions is empty. It is not possible to check all types.");
        }

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("lp_action_history", async () => {
        const schema = tsjSchemaGenerator.createSchema("LpActionHistoryResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            lp_action_history: {
                addr: LP_ACTION_HISTORY_ADDR,
            },
        });

        if (data.actions.length == 0) {
            throw new Error("The list of lp actions is empty. It is not possible to check all types.");
        }

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("limit_order_history", async () => {
        const schema = tsjSchemaGenerator.createSchema("LimitOrderHistoryResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            limit_order_history: {
                addr: LIMIT_ORDER_HISTORY_ADDR,
            },
        });

        if (data.orders.length == 0) {
            throw new Error("The list of limit order history is empty. It is not possible to check all types.");
        }

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("lp_info", async () => {
        const schema = tsjSchemaGenerator.createSchema("LpInfoResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            lp_info: {
                liquidity_provider: LP_INFO_LIQUIDITY_PROVIDER,
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("delta_neutrality_fee", async () => {
        const schema = tsjSchemaGenerator.createSchema("DeltaNeutralityFeeResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            delta_neutrality_fee: {
                notional_delta: "100",
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("price_would_trigger", async () => {
        const schema = tsjSchemaGenerator.createSchema("PriceWouldTriggerResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            price_would_trigger: {
                price: "100",
            },
        });

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("list_deferred_execs", async () => {
        const schema = tsjSchemaGenerator.createSchema("ListDeferredExecsResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            list_deferred_execs: {
                addr: LIST_DEFERRED_EXECS_ADDR,
            },
        });

        if (data.items.length == 0) {
            throw new Error("The list of deferred execs is empty. It is not possible to check all types.");
        }

        assertTSJSchema(ajv, schema, data);
    });

    await t.step("get_deferred_exec", async () => {
        const schema = tsjSchemaGenerator.createSchema("GetDeferredExecResp");

        const data = await client.queryContractSmart(CONTRACT_ADDRESS, {
            get_deferred_exec: {
                id: GET_DEFERRED_EXEC_ID,
            },
        });

        if ("not_found" in data) {
            throw new Error("The deferred exec is not found. It is not possible to check all types.");
        }

        assertTSJSchema(ajv, schema, data);
    });
});
