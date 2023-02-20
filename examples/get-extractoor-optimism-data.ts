import { BN, bufferToHex, keccak, setLengthLeft, toBuffer, unpadBuffer } from 'ethereumjs-util'
import { MPTProofsEncoder } from '../src/encoders/MPTProofsEncoder'
import { OptimismCRCClient } from '../src/networks/optimism/OptimismCRCClient'
const dotenv = require('dotenv');
dotenv.config()

async function run() {

    // Inputs
    const blockNum = 8525849; // The L1 block number we will be proving contains the Optimism state
    const targetAccount = "0xcA7B05255F52C700AE25C278DdB03C02459F7AE8"; // The account inside Optimism we are proving for
    const arrayDefinitionPosition = 0; // Definition position of the array inside the solidity contract
    const indexInTheArray = 0; // The index of the element you are looking for

    const arrayDefinitionHash = keccak(setLengthLeft(toBuffer(arrayDefinitionPosition), 32));
    const arrayDefinitionBN = new BN(arrayDefinitionHash);
    const indexBN = new BN(indexInTheArray);
    const slotBN = arrayDefinitionBN.add(indexBN);
    const slot = `0x${slotBN.toString("hex")}`

    const fetcher = new OptimismCRCClient(process.env.OPTIMISM_GOERLI_RPC_URL, process.env.GOERLI_RPC_URL);

    const l1Block = await fetcher.ethereum.getBlockByNumber(`0x${blockNum.toString(16)}`);

    const output = await fetcher.generateLatestOutputData(`0x${blockNum.toString(16)}`);

    const getProofRes = await fetcher.optimism.getProof(targetAccount, slot, bufferToHex(unpadBuffer(toBuffer(output.blockNum))));

    const inclusionProof = MPTProofsEncoder.rlpEncodeProofs([getProofRes.accountProof, getProofRes.storageProof[0].proof]);


    console.log("L1 BlockNumber:");
    console.log(blockNum);

    console.log("L1 State Root for this block:");
    console.log(l1Block.stateRoot);

    console.log("Output index:");
    console.log(output.outputIndex);

    console.log("Optimism State Root:");
    console.log(output.optimismStateRoot);

    console.log("Optimism Withdrawal Storage Root:");
    console.log(output.withdrawalStorageRoot);

    console.log("Optimism Latest Block Hash:");
    console.log(output.blockHash);

    console.log("Combined Optimism Output Root Proof RLP:");
    console.log(output.outputRootRLPProof);

    console.log("Targeted Storage Slot:");
    console.log(slot);

    console.log("Combined Inclusion Proof RLP:");
    console.log(inclusionProof);
}

run()