const fs = require('fs');
const path = require('path');

const pgexplain = require('node-pg-explain');

function readFile (filename) {
  try {
    return fs.readFileSync(path.join(__dirname, filename)).toString();
  } catch (e) {
    console.error(`Error reading file "${filename}": ${e}`);
    return '';
  }
}

const data = {
  name: 'test-explain',
  plan: readFile('plan.txt'),
  query: readFile('query.sql'),
  params: readFile('params.txt'),
  private: true, // true - do not display in public archive, false - display for all
};

pgexplain(JSON.stringify(data)).then(console.log).catch(console.error);
