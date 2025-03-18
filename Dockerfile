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

# RUN npm install
# RUN npm run build-dev
# RUN cp public/style.css dist/

# Start HTTP server
# CMD ["npx", "http-server", "--port=8080", "dist/"]

# # Add Cargo bin directory to PATH
# ENV PATH="/usr/local/cargo/bin:${PATH}"

# # Install dependencies needed for building projects
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     curl \
#     && rm -rf /var/lib/apt/lists/*

# # Update rust toolchain
# RUN rustup default stable
    
# # Set default working directory
# WORKDIR /app

# # Copy the source code
# COPY . .

# # Install wasm-pack
# RUN cargo install wasm-pack

# # Install npm packages
# RUN npm install

# CMD ["bash"]

# # Build the project
# # RUN wasm-pack build --target web --no-typescript --no-pack -d public \
# #     && npm run build-dev \
# #     && cp public/style.css dist/