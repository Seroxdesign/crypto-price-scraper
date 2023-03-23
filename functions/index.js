const functions = require("firebase-functions");
const cors = require('cors')({origin: true})
const puppeteer = require('puppeteer');

const scrapeImages = async () => {
  const browser = await puppeteer.launch( {headless: false} );
  const page = await browser.newPage();

  await page.goto('https://coinmarketcap.com/currencies/bitcoin/historical-data/', { waitUntil: 'load' });

  await page.waitForSelector('td', {
    visible: true,
});

  const data = await page.evaluate( () => {

    const prices = document.querySelectorAll('td');
    const urls = Array.from(prices).map(v => v.innerText);
    return urls;
  })

  await browser.close();

  console.log(data)

  return data
}

exports.scraper = functions.https.onRequest((request, response) => {
  cors(request, response, async() => {

    const data = await scrapeImages();

    response.send(data)
  })
})
