const fs = require('fs')

// TODO: HOOK UP TO MONGODB SO THAT YOU CAN STORE AND QUERY
// TODO: Add traits and skills so that they can interact with lifepaths.
// TODO: Add skills to lifepaths.
// TODO: build command for adding new lifepaths.

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
            traitPoints: 0,
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
    // Try and find our character
    var character = loadChar(charName)
    // Make sure character actually was returned
    if (character) {
        // Make sure character and lifepath stocks match.
        if (lp.stock.toLowerCase() === character.stock.toLowerCase()) {
            // If lifepath is a 'Born' lifepath.
            if (lp.name.toLowerCase().includes('born')) {
                // Character already has other lifepaths (i.e: they already selected a born lifepath)
                if (character.lifePaths.length > 0) {
                    return console.log("Character already has a 'Born' lifepath!")
                // Character has no other lifePaths
                } else {
                    character.general = lp.skills
                    addPath(character, lp)
                    return console.log(charName + ' was born into the ' + lp.setting + ' setting!')
                }
            // If the user tries to enter a lifepath that isn't a born lifepath as their first lifepath.
            } else if (character.lifePaths.length === 0 && !lp.name.toLowerCase().includes('born')) {
                return console.log("Cannot add lifepaths which aren't 'Born' as your first lifepath! (You were born at some point, weren't you?)")
            // Character has other lifepaths which need to be added.
            } else {
                // TODO: Test if lifepaths from other settings work properly.
                // Check if the lifepath chosen is a lead from the character's previous lifepath.
                var isLead = character.lifePaths[character.lifePaths.length - 1]
                    .leads.filter((path) => path.toLowerCase() == lp.setting.toLowerCase()).length > 0
                // If the lifepath chosen is within the same setting OR the lifepath is a lead...
                if ((character.lifePaths[character.lifePaths.length - 1]
                    .setting.toLowerCase() == lp.setting.toLowerCase()) || isLead) {
                        character.specialised += lp.skills
                        console.log(charName + ' became a ' + lp.name + ' at age: ' + character.age)
                        addPath(character, lp, isLead)
                } else {
                    return console.log('The lifepath chosen cannot be attached to this character! It either does not match their setting or is not a lead!')
                }
            }
        } else {
            return console.log('Error - Character and lifepath stocks do not match!')
        }
    } else {
        return console.log('Error - No characters with a matching name have been found!')
    }
}

const addPath = (char, lp, isLead = false) => {
    char.lifePaths.push(lp)
    char.age += isLead ? (lp.time + 1) : lp.time
    char.traitPoints += lp.traits
    saveChar(char)
    console.log('Age increased by ' + lp.time + ' years.')
    console.log('You now have ' + char.traitPoints + ' trait points to spend.')
}

module.exports = {
    addChar: addChar,
    addPathToChar: addPathToChar
};
