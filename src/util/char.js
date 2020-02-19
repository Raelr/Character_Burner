const fs = require('fs')

const addChar = (name, concept, stock, override) => {

    if (override || !loadChar(name)) {
        const char = { 
            name: name, 
            concept: concept, 
            stock: stock, 
            age: 0, 
            mental: 0, 
            physical: 0,
            stats: {
                will: {
                    value: 0, 
                    shade: 0 
                },
                perception: {
                    value: 0, 
                    shade: 0 
                },
                agility: {
                    value: 0, 
                    shade: 0 
                },
                speed:  {
                    value: 0, 
                    shade: 0 
                },
                power: {
                    value: 0, 
                    shade: 0 
                },
                forte: {
                    value: 0, 
                    shade: 0 
                },
            },
            lifePaths: [],
            general: 0,
            specialised: 0,
            res: 0
        }
        saveChar(char)
    } else {
        console.log('Character already exists!')
    }
}

const loadChar = (charName) => {
    try {
        const dataBuffer = fs.readFileSync('./characters/' + charName + '.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch(e) {
        console.log(e)
        return null;
    }
}

const saveChar = (char) => {
    var data = JSON.stringify(char, null, 2)
    fs.writeFileSync('./characters/' + char.name + '.json', data)
    console.log(char.name + ' saved!')
}

module.exports = {
    addChar: addChar,
};

// TODO: CREATE METHOD FOR CHARACTER STATS
// TODO: DEFINE BASIC CHARACTER LIFEPATHS
// HOOK UP TO MONGODP SO THAT YOU CAN STORE AND QUERY
