wasm-pack build --target web --no-typescript --no-pack
rm pkg/.gitignore
cp pkg/* public/
