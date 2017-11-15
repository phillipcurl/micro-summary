const { buffer, text, json } = require('micro');
const extractor = require('unfluff');
const SummaryTool = require('node-summary');
const summarize = require('summarize');

module.exports = async (req, res) => {
  const reqJson = await json(req);
  return reqJson;
};
