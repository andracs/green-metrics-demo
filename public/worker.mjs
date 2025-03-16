import init, { sha256 as sha256rs, sha512 as sha512rs } from './hashing.js';
import CryptoJS from 'crypto-js';

const algorithms = {
    'sha256': {
        'javascript': (input) => {
            return CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(input));
        },
        'rust-wasm': sha256rs,
    },
    'sha512': {
        'javascript': (input) => {
            return CryptoJS.enc.Hex.stringify(CryptoJS.SHA512(input));
        },
        'rust-wasm': sha512rs,
    },
};

self.onmessage = async ({ data: { id, algorithm, lang, input, iterations } }) => {
    await init();

    const obj = algorithms[algorithm];
    const hashFunc = obj[lang];
    const before = performance.now();

    let out = input;
    iterations ??= 1;

    for (let i = 0; i < iterations; i++) {
        out = hashFunc(out);
    }

    const after = performance.now();

    self.postMessage({
        id,
        digest: out,
        elapsed: after - before,
    });
};