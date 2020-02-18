const fs = require('fs')

const addChar = (name) => {

  const data = JSON.stringify({ name: name, concept: '', stock: '' }, null, 2)
  fs.writeFileSync(name + '.json', data)
  console.log(name + ' added!')
}

module.exports = {
  addChar: addChar
};
