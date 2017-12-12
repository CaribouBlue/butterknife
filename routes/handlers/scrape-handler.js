const axios = require('axios');
const crawler = require('../../lib/crawler');
const cheerio = require('cheerio');

function scrapeHandler (req, res, comData, currentCount = 0, maxCount = null) {
  axios.get(`https://newyork.craigslist.org/search/mnh/art?s=${currentCount}&hasPic=1`)
    .then(result => {
      const html = result.data;
      const $ = cheerio.load(html);
      if (maxCount === null) 
        maxCount = Number($('.totalcount').slice(0, 1).text());
      newCurrentCount = Number($('.rangeTo').slice(0, 1).text()); 
      if (currentCount === newCurrentCount) 
        currentCount = maxCount;
      else
        currentCount = newCurrentCount;
      curData = crawler($, [
        {
          selector: '.result-image',
          props: ['href'],
          data: ['ids'],
        },
        {
          selector: '.result-meta',
          child: {
            selector: '.result-price',
          },
          text: true,
          textAltLabel: 'price',
        },
        {
          selector: '.result-info',
          child: {
            selector: 'a',
            nth: 0,
          },
          text: true,
          textAltLabel: 'title',
        },
      ]);
      console.log(currentCount, maxCount);
      if (currentCount < maxCount) 
        scrapeHandler(req, res, combineData(comData, curData), currentCount, maxCount)
      else {
        res.send(combineData(comData, curData));
      }
    })
    .catch(err => console.error(err));
};

function combineData(obj1, obj2) {
  if (!obj1) return obj2;
  obj1.meta.targets = obj1.meta.targets.map((target, i) => {
    target.results = target.results + obj2.meta.targets[i].results;
    return target;
  });
  return {
    meta: obj1.meta,
    error: obj1.error || obj2.error,
    data: obj1.data.concat(obj2.data),
  };
};

module.exports = scrapeHandler;