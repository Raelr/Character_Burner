const fs = require('fs')

const addChar = (name, concept, stock) => {

    const data = JSON.stringify({ name: name, concept: concept, stock: stock, age: 0, mental: 0, physical: 0 }, null, 2)
    fs.writeFileSync('./characters/' + name + '.json', data)
    console.log(name + ' added!')
}

module.exports = {
    addChar: addChar
};

// TODO: CREATE METHOD FOR CHARACTER STATS
// TODO: DEFINE BASIC CHARACTER LIFEPATHS
// HOOK UP TO MONGODP SO THAT YOU CAN STORE AND QUERY
