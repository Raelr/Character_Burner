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

const addPathToChar = (charName, lp) => {
    var character = loadChar(charName)

    if (character) {
        // If lifepath is a 'Born' lifepath.
        if (lp.name.toLowerCase().includes('born')) {
            // Character already has other lifepaths (i.e: they already selected a born lifepath)
            if (character.lifePaths.length > 0) {
                return console.log("Character already has a 'Born' lifepath!")
            // Character has no other lifePaths
            } else {
                character.general = lp.skills
                addPath(character, lp)
                console.log(charName + ' was born into the ' + lp.setting + ' setting!')
            }
        // If the user tries to enter a lifepath that isn't a born lifepath as their first lifepath.
        } else if (character.lifePaths.length === 0 && !lp.name.toLowerCase().includes('born')) {
            console.log("Cannot add lifepaths which aren't 'Born' as your first lifepath! (You were born at some point, weren't you?)")
        } else {

        }
    }
}

const addPath = (char, lp) => {
    char.lifePaths.push(lp)
    char.age += lp.time
    saveChar(char)
}

module.exports = {
    addChar: addChar,
    addPathToChar: addPathToChar
};

// TODO: CREATE METHOD FOR CHARACTER STATS
// TODO: DEFINE BASIC CHARACTER LIFEPATHS
// HOOK UP TO MONGODP SO THAT YOU CAN STORE AND QUERY
