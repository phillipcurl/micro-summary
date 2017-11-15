const { promisify } = require('util');
const { json } = require('micro');
const compress = require('micro-compress');
const got = require('got');
const extractor = require('unfluff');
const SummaryTool = require('node-summary');
const asyncSummary = promisify(SummaryTool.summarize);
const summarize = require('summarize');

module.exports = compress(async (req, res) => {
  const data = await json(req);
  const url = data.url || '';

  let resource = {
    title: '',
    url: url,
    softTitle: '',
    date: new Date(Date.now()),
    copyright: '',
    author: [], // string[]
    publisher: '',
    text: '',
    image: '',
    tags: [], //string[]
    canonicalLink: '',
    lang: '',
    description: '',
    favicon: '',
    links: [], // [{text: '', href: ''}]
    summary: {
      text: '',
      length: 0,
      ratio: 0
    },
    topics: [], // string[]
    sentiment: -1,
    words: -1,
    difficulty: -1,
    minutes: -1,
    createdAt: new Date(Date.now())
  };

  const response = await got(url);

  const unfluffData = extractor(response.body);

  resource.title = unfluffData.title;
  resource.softTitle = unfluffData.softTitle;
  resource.date = Date(unfluffData.date);
  resource.copyright = unfluffData.copyright;
  resource.author = unfluffData.author;
  resource.publisher = unfluffData.publisher;
  resource.text = unfluffData.text;
  resource.image = unfluffData.image;
  resource.tags = unfluffData.tags;
  resource.canonicalLink = unfluffData.canonicalLink;
  resource.lang = unfluffData.lang;
  resource.description = unfluffData.description;
  resource.favicon = unfluffData.favicon;
  resource.links = unfluffData.links;

  // Get summarize data and save all corresponding values to the new resource
  const summarizeData = summarize(response.body);
  resource.topics = summarizeData.tags;
  resource.sentiment = summarizeData.sentiment;
  resource.words = summarizeData.words;
  resource.difficulty = summarizeData.difficulty;
  resource.minutes = summarizeData.minutes;

  // console.log(analyzedData);
  const summaryData = await asyncSummary(unfluffData.title, unfluffData.text);
  resource.summary.text = summaryData || '';
  resource.summary.length = summaryData.length;
  resource.summary.ratio =
    100 -
    100 *
      (summaryData.length /
        (unfluffData.title.length + unfluffData.text.length));

  return resource;
});
