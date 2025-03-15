use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn blake3(input: &str) -> String {
    blake3::hash(input.as_bytes()).to_hex().to_string()
}
