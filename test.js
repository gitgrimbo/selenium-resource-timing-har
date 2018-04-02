const {Builder, By, Key, until} = require('selenium-webdriver');
const dataFn = require("../performance-bookmarklet/dist/tempEs5/data-fn.js");

(async function example() {
  let driver = await new Builder().forBrowser('internet explorer').usingServer('http://localhost:4444/wd/hub').build();
  try {
    await driver.get('http://www.google.com/ncr');
    // Can't use toJSON() directly, as IE11 does not support it.
    const perfData = await driver.executeScript(`
      return (function() {
        function toJSON(it){ return JSON.parse(JSON.stringify(it)); }
        return {
          document: {
            domain: document.domain,
          },
          location: {
            host: location.host,
            href: location.href,
          },
          perfTiming: toJSON(window.performance.timing),
          resources: toJSON(window.performance.getEntriesByType("resource")),
          marks: toJSON(window.performance.getEntriesByType("mark")),
          measures: toJSON(window.performance.getEntriesByType("measure")),
        };
      }());
    `);
    console.log(JSON.stringify(perfData));
    const data = dataFn(perfData.document.domain, perfData.location.host, perfData.location.href, perfData.perfTiming, perfData.resources, perfData.marks, perfData.measures);
    data.isValid = data.isValid();
    console.log(JSON.stringify(data));
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } finally {
    await driver.quit();
  }
})();