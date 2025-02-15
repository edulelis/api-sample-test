const {inspect} = require("util");
const disallowedValues = [
  '[not provided]',
  'placeholder',
  '[[unknown]]',
  'not set',
  'not provided',
  'unknown',
  'undefined',
  'n/a'
];

const filterNullValuesFromObject = object =>
  Object
    .fromEntries(
      Object
        .entries(object)
        .filter(([_, v]) =>
          v !== null &&
          v !== '' &&
          typeof v !== 'undefined' &&
          (typeof v !== 'string' || !disallowedValues.includes(v.toLowerCase()) || !v.toLowerCase().includes('!$record'))));

const normalizePropertyName = key => key.toLowerCase().replace(/__c$/, '').replace(/^_+|_+$/g, '').replace(/_+/g, '_');

const goal = actions => {
  // this is where the data will be written to the database
  // use JSON.stringify to output the full content
  // @see https://stackoverflow.com/questions/55463865/node-console-log-on-large-array-shows-86-more-items#answer-65987254
  console.log(JSON.stringify(actions, null, 4));
};

module.exports = {
  filterNullValuesFromObject,
  normalizePropertyName,
  goal
};
