const fs = require('fs')

const addChar = (name, concept, stock) => {
    
    if (stock.toLowerCase() == 'dwarf' || stock.toLowerCase() == 'human' 
    || stock.toLowerCase() == 'orc' || stock.toLowerCase() == 'elf') {
        const data = JSON.stringify({ name: name, concept: concept, stock: stock }, null, 2)
        fs.writeFileSync('./characters/' + name + '.json', data)
        console.log(name + ' added!')
    }
}

module.exports = {
    addChar: addChar
};
