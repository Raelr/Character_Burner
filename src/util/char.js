const fs = require('fs')

// TODO: Add the age-based stat allocation.
// TODO: Add point costs for skills.
// TODO: Add ability to 'finalise' character lifepaths.
// TODO: Add ability to purchase skills.
// TODO: HOOK UP TO MONGODB SO THAT YOU CAN STORE AND QUERY
// TODO: Add traits so that they can interact with lifepaths.
const addChar = (name, concept, stock, sex, override) => {

    if (override || !loadChar(name)) {
        const char = {
            name: name,
            concept: concept,
            stock: stock,
            sex: sex,
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
            skills: [],
            settings: [],
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

// Adds a specified lifepath to the character's list.
const addPathToChar = (character, lp, stock, setting) => {
    // Make sure character actually was returned
    if (character) {
        // Make sure character and lifepath stocks match.
        if (stock.toLowerCase() === stock.toLowerCase()) {
            // If lifepath is a 'Born' lifepath.
            if (lp.name.toLowerCase().includes('born')) {
                // Character already has other lifepaths (i.e: they already selected a born lifepath)
                if (character.lifePaths.length > 0) {
                    return console.log("Character already has a 'Born' lifepath!")
                // Character has no other lifePaths
                } else {
                    character.general = lp.skillP
                    addPath(character, lp, setting)
                    return console.log(character.name + ' was born into the ' + setting + ' setting!')
                }
            // If the user tries to enter a lifepath that isn't a born lifepath as their first lifepath.
            } else if (character.lifePaths.length === 0 && !lp.name.toLowerCase().includes('born')) {
                return console.log("Cannot add lifepaths which aren't 'Born' as your first lifepath! (You were born at some point, weren't you?)")
            // Character has other lifepaths which need to be added.
            } else {
                // Check if the lifepath chosen is a lead from the character's previous lifepath.
                var isLead = character.lifePaths[character.lifePaths.length - 1]
                    .leads.filter((path) => path.toLowerCase() === setting.toLowerCase()).length > 0
                // If the lifepath chosen is within the same setting OR the lifepath is a lead...
                if ((character.settings[character.settings.length - 1]
                    .toLowerCase() === setting.toLowerCase()) || isLead) {
                        character.specialised += lp.skillP
                        console.log(character.name + ' became a ' + lp.name + ' at age: ' + character.age)
                        addPath(character, lp, setting, isLead)
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

// Add the path to the character lifepaths.
const addPath = (char, lp, setting, isLead = false) => {
    // Add generak stats.
    char.lifePaths.push(lp)
    char.age += isLead ? (lp.time + 1) : lp.time
    char.traitPoints += lp.traitP
    char.res += lp.resources

    // Check if the character gets a stat bonus for having this lifepath.
    if (lp.stat != '') {
        var value = parseInt(lp.stat)
        if (lp.stat.includes('P/M')) {
            console.log('You have one point that you can allocate to either your Physical or Mental stats!')
        } else if (lp.stat.includes('P')) {
            char.physical += value
        } else {
            char.mental += value
        }
    }

    // Add the skills to the character (first one of every lifepath)
    var skillIdx = 0

    while (skillIdx < lp.skills.length) {
        if (hasSkill(char, lp.skills[skillIdx].name)) {
            skillIdx++
        } else {
            addSkill(char, lp.skills[skillIdx])
            break
        }
    }

    // Check if the character already has the setting logged and whether it was his latest setting.
    if (!((char.settings.filter((currSetting) => currSetting.toLowerCase() === setting.toLowerCase()).length > 0)
    && char.settings[char.settings.length - 1].toLowerCase() === setting.toLowerCase())) {
        char.settings.push(setting)
    }

    saveChar(char)
    console.log('Age increased by ' + lp.time + ' years.')
    console.log('You now have ' + char.traitPoints + ' trait points to spend.')
}

const addSkill = (char, skill, general = false) => {
    var charSkill = {
        name: skill.name,
        points : 0,
        shade: 0,
        stat: skill.stat
    }

    if (char.skills.find((s) => s.name.toLowerCase() === charSkill.name.toLowerCase())) {
        return console.log('Character already has the skill: ' + s.name)
    } else {
        char.skills.push(charSkill)
        if (general) {
            char.general -= 1
        } else {
            char.specialised -= 1
        }
    }
    console.log('Added skill: ' + skill.name + ' to character: ' + char.name)
}

const hasSkill = (char, skillName) => {
    return char.skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase())
}

// Returns the list of lifepaths that the character can lead into (based on their most recent lifepath)
const getLeadList = (charName) => {

    var character = loadChar(charName)

    if (character.lifePaths.length > 0) {
        var settings = character.lifePaths[character.lifePaths.length - 1].leads
        settings.push(character.settings[character.settings.length - 1])
        return settings
    } else {
        console.log(charName + ' has no lifepaths set!')
    }
}

// Returns the character's stock.
const getCharStock = (charName) => {
    return loadChar(charName).stock
}

const getChar = (charName) => {
    return loadChar(charName)
}

module.exports = {
    addChar: addChar,
    addPathToChar: addPathToChar,
    getLeadList: getLeadList,
    getCharStock: getCharStock,
    getChar: getChar
};
