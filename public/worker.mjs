import init, {
    sha1 as sha1rs,
    sha256 as sha256rs,
    sha512 as sha512rs,
    md5 as md5rs,
    crc32 as crc32rs,
    ripemd160 as ripemd160rs,
    blake3 as blake3rs,
} from './hashing.js';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { blake3 } from '@noble/hashes/blake3';
import { bytesToHex as toHex } from '@noble/hashes/utils';
import CryptoJS from 'crypto-js';
import { Crc32 } from '@aws-crypto/crc32';

const algorithms = {
    'ripemd160': {
        'javascript': async (input) => {
            return toHex(ripemd160(input));
        },
        'rust-wasm': async (input) => { return ripemd160rs(input); },
    },
    'blake3': {
        'javascript': async (input) => {
            return toHex(blake3(input));
        },
        'rust-wasm': async (input) => { return blake3rs(input); },
    },
    'crc32': {
        'javascript': async (input) => {
            const bytes = (new TextEncoder()).encode(input);
            const digest = (new Crc32()).update(bytes).digest();
            return digest.toString(16).padStart(8, '0');
        },
        'rust-wasm': async (input) => { return crc32rs(input); },
    },
    'md5': {
        'javascript': async (input) => {
            return CryptoJS.enc.Hex.stringify(CryptoJS.MD5(input));
        },
        'rust-wasm': async (input) => { return md5rs(input); },
    },
    'sha1': {
        'javascript': async (input) => {
            return CryptoJS.enc.Hex.stringify(CryptoJS.SHA1(input));
        },
        'rust-wasm': async (input) => { return sha1rs(input); },
    },
    'sha256': {
        'javascript': async (input) => {
            return CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(input));
        },
        'rust-wasm': async (input) => { return sha256rs(input); },
    },
    'sha512': {
        'javascript': async (input) => {
            return CryptoJS.enc.Hex.stringify(CryptoJS.SHA512(input));
        },
        'rust-wasm': async (input) => { return sha512rs(input); },
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
        out = await hashFunc(out);
    }

    const after = performance.now();

    self.postMessage({
        id,
        digest: out,
        elapsed: after - before,
    });
};