import { DirectSecp256k1Wallet } from "npm:@cosmjs/proto-signing@^0.32.4";
import { SigningCosmWasmClient } from "npm:@cosmjs/cosmwasm-stargate@^0.32.4";
import { GasPrice } from "npm:@cosmjs/stargate@^0.32.4";
import { decodeHex } from "jsr:@std/encoding@^1.0.1";

/**
 * Generates a random private key
 * @returns A string containing a randomly generated private key
 */
export function generatePrivateKey(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Returns an address from a private key
 * @param privateKey - A string containing a private key
 * @param chainPrefix - A string containing the chain prefix
 * @returns A string containing an address
 */
export async function getAddressFromPrivateKey(privateKey: string, chainPrefix: string): Promise<string> {
    const signer = await DirectSecp256k1Wallet.fromKey(decodeHex(privateKey), chainPrefix);
    const [account] = await signer.getAccounts();
    return account.address;
}

/**
 * Returns a SigningCosmWasmClient instance from a private key
 * @param privateKey - A string containing a private key
 * @param rpcEndpoint - A string containing the RPC endpoint
 * @param chainPrefix - A string containing the chain prefix
 * @param gasPrice - A string containing the gas price. See {@link GasPrice.fromString}
 * @returns A SigningCosmWasmClient instance
 */
export async function getSigningCosmWasmClientFromPrivateKey(
    privateKey: string,
    rpcEndpoint: string,
    chainPrefix: string,
    gasPrice: string,
): Promise<SigningCosmWasmClient> {
    const signer = await DirectSecp256k1Wallet.fromKey(decodeHex(privateKey), chainPrefix);
    const client = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, signer, { gasPrice: GasPrice.fromString(gasPrice) });
    return client;
}
