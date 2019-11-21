import cheerio from 'cheerio';
import fetch from 'node-fetch';
import * as fs from 'fs';
const autoplay = async () => {
  const websiteData = await fetch(
    'https://www.youtube.com/watch?v=g4cSpnGbHPE'
  );
  const website = await websiteData.text();
  const $ = cheerio.load(website);
  const result = $('body')
    .find('#content')
    .find('.related-list-item')
    .find('a')
    .attr('href');
  fs.writeFile('ytd.html', result, () => console.log('hello'));
};
autoplay();
