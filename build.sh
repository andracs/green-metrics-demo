wasm-pack build --target web --no-typescript --no-pack -d public
rm public/.gitignore
npm run build-dev
cp public/style.css dist/
