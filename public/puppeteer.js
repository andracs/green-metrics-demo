const puppeteer = require('puppeteer');

(async () => {
  const iterations = 1000000;
  const text = "Lorem ipsum Rustsum";
  const url = "http://127.0.0.1:8080"; 

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navigate to the URL
  await page.goto(url);

  for (let i = 0; i < 3; i++) {
    console.log(`Iteration: ${i + 1}`);

    // Set the iterations value
    await page.evaluate((iterations) => {
      const iterationsInput = document.querySelector('#iterations'); 
      if (iterationsInput) iterationsInput.value = iterations;
    }, iterations);

    // Set the text value
    await page.evaluate((text) => {
      const textInput = document.querySelector('#input'); 
      if (textInput) textInput.value = text;
    }, text);

    // Trigger the process (e.g., click a button)
    // await page.click('#start-button'); // Adjust the selector according to the button element in index.html

    // Wait for the results to appear
    const sha512Elapsed = await page.waitForSelector('#sha512-elapsed', { visible: true });
    const sha256Digest = await page.waitForSelector('#sha256-digest', { visible: true });

    // Extract the values
    const sha512ElapsedValue = await page.evaluate(el => el.innerText, sha512Elapsed);
    const sha256DigestValue = await page.evaluate(el => el.innerText, sha256Digest);

    console.log(`SHA512 Elapsed: ${sha512ElapsedValue}`);
    console.log(`SHA256 Digest: ${sha256DigestValue}`);
  }

  await browser.close();
})();
