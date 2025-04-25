# hashing

Installer med Docker:

```bash
git clone https://github.com/sofush/hashing
cd hashing
docker buildx build -t wasm-hashing .
docker run --rm -it -p 8080:8080 wasm-hashing
```

Todo:

We'll need a Pupeteer script, which does the following with the index.html:

- It sets the iterations to 1000000
- It sets the text to "Lorem ipsum Rustsum"
- It waits for the values sha512-elapsed and sha256-digest and displays both
- It repeats this 3 times

