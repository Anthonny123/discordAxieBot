const puppeteer = require('puppeteer');

const similarAxies = (axie)=>{
    return new Promise(async(resolve, reject)=>{
        const browser = await puppeteer.launch();

        const page = await browser.newPage();
        await page.goto('https://axie.tech/axie-pricing', {
            waitUntil: "networkidle2",
            timeout: 0
        });    
        await page.type("#axieId", `${axie}`);
        await page.click('#calcButton');
        await page.waitForTimeout(3000);
        const e = await page.evaluate(()=>{
            const elements = document.getElementById('cheapestListedAxies').childNodes
            arr = [];
            elements.forEach(e=>{
                arr.push(e.textContent);
            })
            return arr;
        })
        const axiesList = []
        e.forEach(ele =>{
            const strg = ele.replace(/\t/g, ' ').split(/ +/)
            const axieId = strg[2].replace('#','');
            const axiePrice = strg[9]
            const axieBreedCount = strg[7];
            const axieData = [];
            axieData.push(axieId, axiePrice, axieBreedCount);
            axiesList.push(axieData)
        }) 
        await browser.close();
        resolve(axiesList);
    })
}

exports.similarAxies = similarAxies;