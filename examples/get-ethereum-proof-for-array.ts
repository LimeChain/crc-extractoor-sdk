import { BN, keccak, setLengthLeft, toBuffer } from 'ethereumjs-util';
import { MPTProofsEncoder } from '../src/encoders/MPTProofsEncoder';
import { OptimismCRCClient } from '../src/networks/optimism/OptimismCRCClient'
const dotenv = require('dotenv');
dotenv.config()

async function run() {
    const fetcher = new OptimismCRCClient(process.env.OPTIMISM_GOERLI_RPC_URL, process.env.GOERLI_RPC_URL);

    const arrayDefinitionPosition = 0; // Definition position of the array inside the solidity contract
    const indexInTheArray = 0; // The index of the element you are looking for

    const arrayDefinitionHash = keccak(setLengthLeft(toBuffer(arrayDefinitionPosition), 32));
    const arrayDefinitionBN = new BN(arrayDefinitionHash);
    const indexBN = new BN(indexInTheArray);
    const slotBN = arrayDefinitionBN.add(indexBN);
    const slot = `0x${slotBN.toString("hex")}`


    const block = 5736868;
    const res = await fetcher.optimism.getProof("0xcA7B05255F52C700AE25C278DdB03C02459F7AE8", slot, `0x${block.toString(16)}`);

    console.log(res);

    const combinedProof = MPTProofsEncoder.rlpEncodeProofs([res.accountProof, res.storageProof[0].proof]);

    console.log("Combined Proof:\n", combinedProof);
}

run()
