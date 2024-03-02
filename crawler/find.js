import cheerio from 'cheerio';
const $ = cheerio.load(`
  <div class="parent">
    <p>Hello, world!</p>
    <span>How are you?</span>
    <p class="day">Have a nice day!</p>
  </div>
`);
const welcome = $('.parent').find('p.day');
console.log(welcome.text()) //Output : Have a nice day!