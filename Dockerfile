FROM rust:latest AS rust-builder

# Copy project source code
WORKDIR /app
COPY . .

# Build WASM
RUN cargo install wasm-pack
RUN wasm-pack build --target web --no-typescript --no-pack -d public

FROM node:latest
COPY --from=rust-builder /app /app
WORKDIR /app

# Bundle npm dependencies
RUN npm install
RUN npm run build

# Run HTTP server
EXPOSE 8080
CMD ["npm", "run", "serve"]
