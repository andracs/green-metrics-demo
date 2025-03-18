#!/usr/bin/env bash
docker buildx build -t wasm-hashing .
docker run --rm -it -p 8080:8080 wasm-hashing
