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
    const blockNum = 8525295;
    const fetcher = new OptimismCRCClient(process.env.OPTIMISM_GOERLI_RPC_URL, process.env.GOERLI_RPC_URL);

    const output = await fetcher.generateLatestOutputData(`0x${blockNum.toString(16)}`);

    const l1Block = await fetcher.ethereum.getBlockByNumber(output.l1BlockNumber);

    const account = await MPTProofVerifier.verifyAccountProof(l1Block.stateRoot, output.l1OutputOracleAddress, output.accountProof);
    console.log("Account", bufferToHex(account.nonce), bufferToHex(account.balance), bufferToHex(account.stateRoot), bufferToHex(account.codeHash));

    const storageValue = await MPTProofVerifier.verifyStorageProof(bufferToHex(account.stateRoot), output.outputStorageSlot, output.storageProof);
    console.log("Storage Value", bufferToHex(Buffer.from(storageValue)))
}

run()