use sha1::Sha1;
use sha2::{Digest, Sha256, Sha512};
use wasm_bindgen::prelude::wasm_bindgen;

fn hex_encode(bytes: &[u8]) -> String {
    let mut out = String::with_capacity(bytes.len() * 2);

    let num_to_hex_digit = |num| match num {
        0 => '0',
        1 => '1',
        2 => '2',
        3 => '3',
        4 => '4',
        5 => '5',
        6 => '6',
        7 => '7',
        8 => '8',
        9 => '9',
        10 => 'a',
        11 => 'b',
        12 => 'c',
        13 => 'd',
        14 => 'e',
        15 => 'f',
        _ => unreachable!(),
    };

    for byte in bytes {
        let first_digit = byte >> 4;
        let second_digit = byte & 0b1111;
        out.push(num_to_hex_digit(first_digit));
        out.push(num_to_hex_digit(second_digit));
    }

    out
}

#[wasm_bindgen(start)]
fn main() {
    console_log::init_with_level(log::Level::Debug).unwrap();
}

#[wasm_bindgen]
pub fn sha1(input: &str) -> String {
    hex_encode(&Sha1::digest(input))
}

#[wasm_bindgen]
pub fn sha512(input: &str) -> String {
    hex_encode(&Sha512::digest(input))
}

#[wasm_bindgen]
pub fn sha256(input: &str) -> String {
    hex_encode(&Sha256::digest(input))
}
