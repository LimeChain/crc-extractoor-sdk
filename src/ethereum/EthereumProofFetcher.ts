import { EthereumProof } from "../types/ethereum";
import { paramsToRequest } from "../utils/JSONRPCUtils";

export class EthereumProofFetcher {

    rpcUrl: string

    constructor(rpcUrl: string) {
        this.rpcUrl = rpcUrl;
    }

    async getProof(targetAccount: string, targetSlot: string, block: number): Promise<EthereumProof> {
        const params = paramsToRequest("eth_getProof", [targetAccount, [targetSlot], `0x${block.toString(16)}`])
        console.log(params);
        const response = await fetch(this.rpcUrl, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(params) // body data type must match "Content-Type" header
        });
        const r = await response.json();
        if (r.error) {
            throw new Error(r.error.message);
        }
        return r.result;
    }

}