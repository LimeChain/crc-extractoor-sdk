import { bufferToHex, keccak, setLengthLeft, toBuffer } from "ethereumjs-util";
import { EthereumProof } from "../../types/ethereum";
import { OutputData } from "../../types/optimism";
import { paramsToRequest } from "../../utils/JSONRPCUtils";
import { MPTProofVerifier } from "../../verifier/MPTProofVerifier";
import { EthereumRequester } from "../ethereum/EthereumRequester";

export class OptimismRequester {

    optimism: EthereumRequester
    ethereum: EthereumRequester

    constructor(optimismRpcUrl: string, ethereumRpcUrl) {
        this.optimism = new EthereumRequester(optimismRpcUrl);
        this.ethereum = new EthereumRequester(ethereumRpcUrl)
    }

    async requestEthereum(method: string, params: any[]): Promise<any> {
        return this.ethereum.request(method, params);
    }

    async requestOptimism(method: string, params: any[]): Promise<any> {
        return this.optimism.request(method, params);
    }

    // See spec: https://github.com/ethereum-optimism/optimism/blob/develop/specs/proposals.md#l2-output-root-proposals-specification
    async generateOutput(blockNum: number): Promise<OutputData> {

        const targetAccount = "0x4200000000000000000000000000000000000016"; // The withdrawal contract address

        const block = await this.optimism.getBlockByNumber(blockNum);
        const proof = await this.optimism.getProof(targetAccount, "0x0", blockNum); // Slot does not matter

        const account = await MPTProofVerifier.verifyAccountProof(block.stateRoot, targetAccount, proof.accountProof);

        const versionByte = setLengthLeft(toBuffer(0), 32);

        const payload = Buffer.concat([toBuffer(block.stateRoot), account.stateRoot, toBuffer(block.hash)])
        const outputRoot = keccak(Buffer.concat([versionByte, payload]));

        const result: OutputData = {
            version: bufferToHex(versionByte),
            stateRoot: bufferToHex(block.stateRoot),
            withdrawalStorageRoot: bufferToHex(account.stateRoot),
            blockHash: block.hash,
            outputRoot: bufferToHex(outputRoot)
        }

        return result;

    }

}