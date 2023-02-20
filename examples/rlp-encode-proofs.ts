import rlp, { decode } from 'rlp'
import { BN, bufferToHex, keccak, setLengthLeft, toBuffer } from 'ethereumjs-util'
import { SecureTrie as Trie } from 'merkle-patricia-tree'
import Account from 'ethereumjs-account'
import { MPTProofVerifier } from '../src/verifier/MPTProofVerifier'
import { MPTProofsEncoder } from '../src/encoders/MPTProofsEncoder'


async function run() {
    const stateRoot = '0x4ea9dfcaf7a2ac26d769bba781e7652dac955876b5918ee4d02c815ed01a7369';
    const target = '0xcA7B05255F52C700AE25C278DdB03C02459F7AE8';
    const accountProof = ["0xf90211a0a5c51943cfcd0f44d5b6a83bf728bb9aa88d62cfd5477631fac53a4c8b0d84a5a0f2f4e3013f55f7a767f2aed345efdeec716bc073892bdce6fb8bda5b9a39c88ba0047d393861c7f1a3008b0d05373312b4c5e3e328ebd066434adc641b4cc6cc83a048728cf36075d7cbe142a5b00cfb47e0c64e1f3f77b6a6f1d93b7881c5ea430ba071e638f1000103b3448690d927e306000fa263fb518e49a6086a9215e627503fa07bd66a535359d59a197971fc2f15634d4af4c1654f92308f11b8d5e6abf0662aa0c7b3481d756b8ca747f31280d7a1a267505d5956f430190a962344ec9704b3eba02f8ff5ddc7fe40c96b02c2a64161b9bbfdbee8e07febb8e969077b7f314fcad9a0f6088de19696770421759688602514554b1319e92b1b9f3cfa966227037c07bca0d0cc4e3d4d93aecbc6c2b5a1806aa9b5319c91dc4b31185c06339b26bfb17fe8a0b8ad021365bf568d250092af7c920f94ea335cffe44829e58a548411bffa6a32a083a0b7d9f78cc19be26965739a026f5eb468596d86aea3a50fcf25eeb3028182a02aaa98934f76476b34235a58973c681b5359a85c8cec30bba4497468f68ef776a009539f6cd63dc130e01fb316d16f5715e80e727c6e5cf63b68c2e1dc60c678dfa0e1e33e5de7b841958ba792ecc2893e6d51b314a605a0564719b86d79eac36907a07be236b1ddc76c95db65d77260e7e81b43d19438d0c2055be8b23b2ff54d931380", "0xf90211a07aca2b878afa783c97498a58809cb87cc9e55433f47161970f5599ca6cd050f2a0dd5d8cefa5ba3f061e35395948e542a6757f0e1c787173fce6870aab6247e500a0f5fddc06469948deeb9bab6cf9daf1080325b28964608d61492fc9c695709d02a090cd0c4a21df79181f8fbf52161575a3e31a097c6eb8bba71a86ead9d95cd7bba040dc7ec00d899a912340ab416fb4f2981b17a588746d772b82e037d11166d376a0ae3989114ac37e18cda383b3664796889604bacdf6c8c36e38b8be5001de820aa01984f308d4bfae762cafb97b55b0a512501d04668eaa1a259ed758e0b71148daa0105bfde1ee582379714ae2941dd75059958995eda599d34e0ac33fc984376a16a0d33b78bf18722e066c3a874e34713bd8386db976063f43f9d3ce7967d5024a21a062dc1e433856bf2539fcfef7b8ee19bc6d18d3cec8253eadc2fdac550de54d96a09614c536f205ad9dfa61da617ba71fb2e370db4e07a281781183949430aeec40a0b41d7a84ed310156b76730b878bf91bb769f75f89d2ededfd47c310eb998e8c4a06827b6cef93a05e5edf540c0738e49322337278469273cef55461a78ecf41e37a0f75f00e49e4f0cc56d0fdd81741f6f4fc85ab5b951cc21cadf49fcfb77156261a04fd6136093b3d0a2f71c21992cfc542f86536174f570bc38f0e62ee7b52be0e5a0a8b1cb5ad445e7d69a6270ae4b94fb788c856b46c62ae128e00f563f2c68484780", "0xf90211a0153b57f1b6cb17b7354e1c45a3e33d5d04fbdcd9f52fe8dd94e70cd3978dfb08a0487f6fa611716e858037ec1fbc0e6eb8d7a9ebe02b965ff5d68ed6054df985d3a03d440f05eddc05ec05c17faf0f8f897b36de42e677a9f1a542ee63993bf1c37ea0c9c3810b0a2361b858a06a697d5ffadf4f1efd7cbd57dd2912c8f9a9110cec8aa0aca14a3938f2836c1eacedce5a1d8d1348751936f111bff1c0a1e0a8fe70c39ba063db4d52295178c4d4c7e15ecb78e99da44eb5e654eff735562b5a9099eb4be9a02fa6f8354999017eb35c3849fd2ae3de9d58e32cb76dbd03dde988f8dc11ca7aa097a7fda600ccfd07d1704700abcb868bf251526771ece8d2fca1f81b489a130ca073cdd098dd9e2569991859dc864b937b190549e8db48374ffaf92dcc3834ae9aa0994b592993f4bc7eebf64cedcfe25ad519bc0d5d47847bcc4a90cc9d2f19411ca0b73d3b06a1bfcf44be1632329f9d3fbccc117aaefdf598ee791b013f8a91d849a08e0ae3e7eaad8d6f55d2f076a575beea590b5f0d91e7eafefb54ff5b71c9eb9aa00d51c3f0247d9136b6eed4e901bbcf3bb5af7e6bde1994b83f93eccddad38c49a02b8bd4b9fa97c78a0e95b969d3c0688e0eb8c2189b0a708d858017b6ec2a7587a0cef7f32fe370cb89b8b9bfbdd038d6b7b65470ba8a341d788935184c7d9fab65a0dc8c6809684ec0664e5c973d2dbc4c8b5da8a001e26019ae180b6dea1f8cb43780", "0xf90211a0a0b118d0f6367bcb84a5660c462614eea9618dc4d0b82ca3e5172187baef1a25a0354d8d902d882825d98e576ed6441606a82bf18040803c9e3c0759a71244cc53a0886c4804a05446ef44ccd0750b5a7060a217d2e22414ae0c43f6309d180db9e6a065a12f078b78f5c1d841a21d03c22ff3ad1a816915c8fcc591515369fc789a3ca0377e2e4d731424efdef4a3649837db570d4ee6fe8c30a4ded0e65194d5c0b050a0ba759c481a3e9d9878d6d143e7662fc56038b75ccbfb15144137390bf616f8bda0f36fbd19f76a6665082aea200043eaf31d628055ed0109ce88cf68615e583174a00b2fffdd841ae9fc97f0092448d3935646a34ee32cd44358d3a7e8e89289e038a03f54c599b86365eb935613a968adc5ad23bb3f5d6bff4706fb6b00d2b0e067e6a0823b559fad1809cc7f0db7cabfe54943f201a0b69523ab010611c968c579b31fa044bf5f3b16bae07817ae6c2469db7ed703755f673de85927a08ad4d4814fcb2ca0606f3b8f9032f9024c9c91a87dfad89a5e64d89e2d96b95a07ce76c9ec265a47a09854256fd981ae13f4552b0fef40db7f61e8e6a3480b25ed81d709fd52ef2139a0796b77f85baa276920ea16eb5ce9f82771744bb9735a942fd9e9e41d6b47732da0a4a6672421e9b55ecf3c91bfcdd690089ac4a6181246062c886e95e6a9828578a027ef786678093a83ccf97ae9c14460cf896a5e243aa844b800cfddf4c6a2239580", "0xf8b1a0fb3e47a5e14be5f041c1ded9f6d4aabf87110658eb3bd9bb72f5e7a7b4e1ef6a80a05b120570f7f4ae08cf3d90f6c739f16c1ee7f864e2d70f77dc801dd6ee5bc7f7a0df53a63bbae3e70c7fb9a3f4353f750536c9958bb79ed68d93bc50b7e27ccc77808080a0ad2854d9bb7485c587cbb332afacfc4f5c58d05706b2dbf2331b65958b8691e280808080a0a0d3dfc979907ee56ed6556dc66ff8693f71feeda61e32324630c75db098418b80808080", "0xf8518080808080808080808080a0c0cee6392fd4349608e271061ce24445d72879705248fe1e5aea25ea7c38b99e80a0adba1ddad1e8e56ba4e17885c0f8d5a347ee23b55aee6bd8123bee5421a73fc7808080", "0xf8679e207b92894d70fca5f58dc3b808510dc16d5d83a3c25aff7e5943b35ccdd2b846f8440180a01a7816da46032b6ddd0e55177119f9f584f78a1122cc149d8a6ac0d1c97c3c3ba0f9072b9b62ca5c39e950622d6b0615c32d6f91905807ed93fe40df9f2df832b8"];
    const storageSlot = '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563';
    const storageProof = ["0xf8718080a04fc5f13ab2f9ba0c2da88b0151ab0e7cf4d85d08cca45ccd923c6ab76323eb288080a0dfa55a167f624ed9f8a78e7b54acb7dadc38c41438a877ee892b6f9ac16bdb64808080a0d8fd272d6bacf4f3ad877ddfef1f6bbf8159c2c9b17d249f9f6032d7ca62571780808080808080", "0xf843a0310e4e770828ddbf7f7b00ab00a9f6adaf81c0dc9cc85f1f8249c256942d61d9a1a06ebd3e280a2c6ca99ff4e944fb4f9dc671f997a3b3ca0dc13aaa9717468188ec"];

    const account = await MPTProofVerifier.verifyAccountProof(stateRoot, target, accountProof);
    console.log("Account:\n", bufferToHex(account.nonce), bufferToHex(account.balance), bufferToHex(account.stateRoot), bufferToHex(account.codeHash));

    const storageValue = await MPTProofVerifier.verifyStorageProof(bufferToHex(account.stateRoot), storageSlot, storageProof);
    console.log("Storage Value:\n", bufferToHex(Buffer.from(storageValue)))

    const rlpAccountProof = MPTProofsEncoder.rlpEncodeProof(accountProof);
    console.log("RLP Encoded Account Proof:\n", rlpAccountProof);

    const rlpStorageProof = MPTProofsEncoder.rlpEncodeProof(storageProof);
    console.log("RLP Encoded Storage Proof:\n", rlpStorageProof);

    const combinedProof = MPTProofsEncoder.rlpEncodeProofs([accountProof, storageProof]);

    console.log("Combined Proof:\n", combinedProof);
}

run()