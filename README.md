# hashing

Installer med Docker:

```bash
git clone https://github.com/sofush/hashing
cd hashing
docker buildx build -t wasm-hashing .
docker run --rm -it -p 8080:8080 wasm-hashing
```