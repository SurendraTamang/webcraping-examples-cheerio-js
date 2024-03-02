import cheerio from 'cheerio'

const $ = cheerio.load(`
<body>
<div>Hello World!</div>
</body>`);
console.log($("div").text())
// Loads the html
console.log($.html())