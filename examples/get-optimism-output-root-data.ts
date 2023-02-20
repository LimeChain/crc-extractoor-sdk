import rlp, { decode } from 'rlp'
import { BN, bufferToHex, keccak, setLengthLeft, toBuffer } from 'ethereumjs-util'
import { SecureTrie as Trie } from 'merkle-patricia-tree'
import Account from 'ethereumjs-account'
import { MPTProofVerifier } from '../src/verifier/MPTProofVerifier'
import { MPTProofsEncoder } from '../src/encoders/MPTProofsEncoder'
import { EthereumCRCClient } from '../src/networks/ethereum/EthereumCRCClient'
import { OptimismCRCClient } from '../src/networks/optimism/OptimismCRCClient'
import { OptimismOutputEncoder } from '../src/encoders/OptimismOutputEncoder'
const dotenv = require('dotenv');
dotenv.config()

async function run() {
    const blockNum = 5736868;
    const fetcher = new OptimismCRCClient(process.env.OPTIMISM_GOERLI_RPC_URL, process.env.GOERLI_RPC_URL);

    const output = await fetcher.generateLatestOutputData(`0x${blockNum.toString(16)}`);

    console.log(output);

    const l1Block = await fetcher.ethereum.getBlockByNumber(output.l1BlockNumber);
    console.log(l1Block)

    const account = await MPTProofVerifier.verifyAccountProof(l1Block.stateRoot, output.l1OutputOracleAddress, output.accountProof);
    console.log("Account", bufferToHex(account.nonce), bufferToHex(account.balance), bufferToHex(account.stateRoot), bufferToHex(account.codeHash));

    const AS = keccak(setLengthLeft(toBuffer(3 /* The array position */), 32));
    const ASBN = new BN(AS);
    const indexBN = new BN(toBuffer(output.outputIndex));
    const slotOffset = new BN(indexBN.mul(new BN(2)));
    const SBN = ASBN.add(slotOffset);
    const S = `0x${SBN.toString("hex")}`
    console.log("calculated slot", S);
    console.log("given slot", output.outputStorageSlot);

    const storageValue = await MPTProofVerifier.verifyStorageProof(bufferToHex(account.stateRoot), output.outputStorageSlot, output.storageProof);
    console.log("Storage Value", bufferToHex(Buffer.from(storageValue)))
    console.log("Calculated value", OptimismOutputEncoder.generateOutputRoot(output.version, output.optimismStateRoot, output.withdrawalStorageRoot, output.blockHash));
    console.log("Combined Proof", output.outputRootRLPProof)

}

run()