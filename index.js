const puppeteer = require('puppeteer');
const fs = require('fs')


const parsePlaces = async (page) => {
    let placesList = [];
    const elements = await page.$$('.fontHeadlineSmall');
    const elementsStars = await page.$$('.e4rVHe.fontBodyMedium');
    // const schoolType = await page.$$('div.UaQhfb.fontBodyMedium:last-child')

    if (elements && elements.length) {

        for (const el of elements) {

            const schoolName = await el.evaluate(text => text.innerHTML);
            placesList.push({ schoolName });
        }


        for (const el of elementsStars) {

            const reviews = await el.evaluate(text => text.children[0].ariaLabel);
            placesList.forEach(data => {
                data.reviews = reviews
            })

        }
        // for (const el of schoolType) {

        //     const type = await el.evaluate(text => text.lastChild.firstElementChild.firstChild.innerText);
        //     const address = await el.evaluate(text => text.lastChild.firstElementChild.lastChild.innerText);

        //     placesList.forEach(data => {
        //         data.schoolType = type
        //         data.address = address
        //     })

        // }
    }

    return placesList;

}


async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 300;
            var timer = setInterval(() => {
                var scrolledLastElement = document.querySelectorAll('.ecceSd')[1]
                var scrollHeight = scrolledLastElement.scrollHeight
                scrolledLastElement.scrollBy(0, distance)
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

const printJson = async (json) => {
    fs.writeFileSync('./schoolsList.json', JSON.stringify(json), err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully File has been created!')
        }
    })
}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setViewport({
        width: 1300,
        height: 900
    });

    await page.goto('https://www.google.com/maps/search/delhi+schools/@28.6021872,77.1795369,13z');


    let places = [];

    places = await parsePlaces(page)
    console.log(places)

    // do {
    //     await autoScroll(page)

    //     places = places.concat(await parsePlaces(page))

    //     console.log('Parsed' + places.length + ' places')
    //     console.log(places)

    //     await printJson(places)
    // } while (true)


})()
