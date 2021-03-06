const fs = require('fs')

// TODO: Get skills from lifepath.
// TODO: Allow lifepaths to be overridden.
// TODO: Create associated skills.
// TODO: Create associated traits.
// TODO: Add more lifePaths.

// Adds a new lifepath to the paths file
const addLifePath = (name, setting, stock, time, leads, skills, skillP, traitP, res, stat = '') => {

    var paths = loadLifePaths()

    // create the lifePath object
    var newLifePath = {
        name: name,
        time: time,
        leads: leads,
        resources: res,
        skills: skills,
        skillP: skillP,
        traitP: traitP,
        stat: stat,
        restrictions: {
            age: 0,
            setting: '',
            position: 0,
            lifePaths: []
        }
    }

    var pathStock = getStock(paths, stock)

    // Step 1: Find the appropriate stock:
    if (pathStock) {
        // Step 2: Find the correct setting
        var pathSetting = getSetting(pathStock, setting)

        if (pathSetting) {
            var path = getPath(pathSetting, name)
            // If the lifepath already exists
            if (path) {
                return console.log('Lifepath: ' + name + ' from setting: ' + setting + 'from stock: ' + stock + ' already exists!')
            // Lifepath doesn't exist
            } else {
                pathSetting.lifePaths.push(newLifePath)
                console.log('Added lifepath: ' + name + ' to the ' + stock + ' stock and ' + setting + ' setting.')
            }
        // No setting exists
        } else {
            pathStock.settings.push( {setting: setting, lifePaths: [newLifePath]} )
            console.log('Added new setting to stock: ' + stock + ' with lifepath: ' + name)
        }
    // No stock exists:
    } else {
        var pathArray = [ newLifePath ]
        var settingArray = [{ setting: setting, lifePaths: pathArray }]
        var newStock = { stock: stock, settings : settingArray }
        paths.push(newStock)
        console.log('Added new stock: ' + stock + ' with setting: ' + setting + ' and lifePath: ' + name)
    }

    saveLifePath(paths)
}

// Adds a condition which must be met for the lifepath to be pickable for the player.
const addRestriction = (stockName, settingName, lpName, restrictedSetting, restrictedPosition, requiredAge, requiredLps) => {
    var lps = loadLifePaths()
    var lp = getLifePath(stockName, settingName, lpName, lps)

    if (lp) {
        // Enabling this restriction will add the requirement for the character to have at least one lifepath from
        // the specified setting.
        if (restrictedSetting && lp.restrictions.setting.toLowerCase() != restrictedSetting.toLowerCase()) {
            lp.restrictions.setting = restrictedSetting
        }
        // This ensures that the lifepath can only be chosen after if a number of lifepaths are chosen beforehand.
        // i.e: a position of 2 ensures that the lifepath CANNOT be chosen unless the character has taken two lifepaths already.
        if (restrictedPosition) {
            lp.restrictions.position = restrictedPosition
        }
        // Ensures that the character can only choose a lifepath once they've reached a specific age.
        if (requiredAge) {
            lp.restrictions.age = requiredAge
        }
        // Adds a requirement that the character MUST take at least one of the lifepaths in the inserted list.
        if (requiredLps) {
            requiredLps.forEach((path) => {
                if (lp.restrictions.lifePaths.indexOf(path) != 0) {
                    lp.restrictions.lifePaths.push(path)
                }
            })
        }
        saveLifePath(lps)
    }
}

const getLifePath = (stock, setting, pathName, lifePaths = null) => {

    if (!lifePaths) {
        lifePaths = loadLifePaths()
    }

    var searchedStock = getStock(lifePaths, stock)
    if (searchedStock) {
        var searchedSetting = getSetting(searchedStock, setting)
        if (searchedSetting) {
            var path = getPath(searchedSetting, pathName)
            console.log('Found lifepath ' + path.name + '!');
            return path
        } else {
            return console.log('No setting found with name: ' + searchedSetting.name)
        }
    } else {
        return console.log('No stock found with name: ' + searchedStock);
    }
}

const getPath = (setting, pathName) => {
    return setting.lifePaths.filter((lp) => lp.name.toLowerCase() === pathName.toLowerCase())
    .find((lp) => lp.name.toLowerCase() === pathName.toLowerCase())
}

const getSetting = (stock, setting) => {
    return stock.settings.filter((se) => se.setting.toLowerCase() === setting.toLowerCase())
    .find((se) => se.setting.toLowerCase() === setting.toLowerCase())
}

const getStock = (paths, stock) => {
    return paths.filter((st) => st.stock.toLowerCase() === stock.toLowerCase())
        .find((st) => st.stock.toLowerCase() === stock.toLowerCase())
}

const saveLifePath = (paths) => {
    const dataJSON = JSON.stringify(paths, null, 2)
    fs.writeFileSync('./lifepaths/lifepaths.json', dataJSON)
}

const loadLifePaths = () => {
    try {
        const dataBuffer = fs.readFileSync('./lifepaths/lifepaths.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch(e) {
        return [];
    }
}

// Remove Lifepath from the Lifepath List. Does NOT remove settings or stock information.
const removeLifePath = (lpName, lpSetting, lpStock) => {
    var paths = loadLifePaths()
    var setting = getSetting(getStock(paths, lpStock), lpSetting)

    if (setting) {
        lp = getPath(setting, lpName)
        if (lp) {
            index = setting.lifePaths.indexOf(lp)
            setting.lifePaths.splice(index, 1)
            saveLifePath(paths)
            console.log('Removed lifepath: ' + lpName + ' from setting: ' + lpSetting + ' from stock: ' + lpStock)
        } else {
            return console.log('Lifepath: ' + lp.name + ' does not exist!')
        }
    } else {
        return console.log('Setting: ' + lpSetting + ' does not exist!')
    }
}

// Find the stock and remove it completely (will delete ALL lifepaths and settings in it)
const removeStock = (stockName) => {
    var paths = loadLifePaths()
    var stock = getStock(paths, stockName)
    if (stock) {
        index = paths.indexOf(stock)
        paths.splice(index, 1)
        saveLifePath(paths)
        console.log('Removed stock: ' + stockName)
    } else {
        return console.log('Stock: ' + stockName + ' does not exist!')
    }
}

// Find the setting and remove it (will delete all lifepaths below it).
const removeSetting = (stockName, settingName) => {
    var paths = loadLifePaths()
    var stock = getStock(paths, stockName)

    if (stock) {
        setting = getSetting(stock, settingName)
        if (setting) {
            var index = stock.settings.indexOf(setting)
            stock.settings.splice(index, 1)
            saveLifePath(paths)
            console.log('Removed setting: ' + settingName + ' from stock: ' + stockName + '.')
        } else {
            return console.log('Setting: ' + settingName + ' does not exist!')
        }
    } else {
        return console.log('Stock: ' + stockName + ' does not exist!')
    }
}

// Lists every single lifepath in the game. Probably not fully recommended to use.
const listAllPaths = () => {

    var paths = loadLifePaths()

    paths.forEach(element => {
        console.log('Stock: ' + element.stock);
        element.settings.forEach(setting => {
            console.log('   - Setting: ' + setting.setting);
            setting.lifePaths.forEach(path => {
                console.log('       * ' + path.name)
            });
        });
    });
}

// Lists all the settings registered under and stock.
const listSettingsForStock = (stockName) => {

    var paths = loadLifePaths()

    var stock = getStock(paths, stockName)

    // Check if stock exists.
    if (stock) {
        console.log('Stock: ' + stockName + '\nRegistered Settings:')
        stock.settings.forEach(setting => {
            console.log('   -   ' + setting.setting)
        })
    } else {
        console.log('No stock with name: ' + stockName + ' exists!')
    }
}

// Lists all lifepaths within a specified setting.
const listPathsForSetting = (stockName, settingName) => {
    var paths = loadLifePaths()
    var setting = getSetting(getStock(paths, stockName), settingName)

    console.log('\nRetreiving Lifepaths from setting: ' + settingName + '...')

    if (setting) {
        setting.lifePaths.forEach(path => {
            console.log('   -   ' + path.name)
        })
    } else {
        console.log('No setting with name: ' + settingName + ' exists!')
    }
}

const listPathsForChar = (char, charLeads) => {
    var lifePaths = loadLifePaths()
    charLeads.forEach((settingName) => {
        setting = getSetting(getStock(lifePaths, char.stock), settingName)
        if (setting) {
            console.log('   * Lifepaths available from setting: ' + settingName)
            setting.lifePaths.forEach((path) => {
                if (isValid(char, path)) {
                    console.log('       - ' + path.name)
                }
            })
        }
    })
}

const isValidAge = (charAge, lifePathAge) => {
    return charAge >= lifePathAge
}

const isValidSetting = (charSettings, lifePathSetting) => {
    if (lifePathSetting === '') {
        return true
    }
    return charSettings.find((settingName) => settingName.toLowerCase() === lifePathSetting.toLowerCase())
}

const isValidPosition = (charPathLength, requiredPosition) => {
    return charPathLength >= requiredPosition
}

const hasValidLifePaths = (requiredLifePaths, characterLifePaths) => {
    var hasPath = false
    if (requiredLifePaths.length > 0) {
        requiredLifePaths.forEach((requiredLp, i) => {
            characterLifePaths.forEach((charLp, i) => {
                if (requiredLp.toLowerCase() === charLp.name.toLowerCase()) {
                    hasPath = true
                }
            });
        });
    } else {
        hasPath = true
    }
    return hasPath
}

const isValid = (char, lifePath) => {
    return isValidAge(char.age, lifePath.restrictions.age)
    && isValidSetting(char.settings, lifePath.restrictions.setting)
    && isValidPosition(char.lifePaths.length, lifePath.restrictions.position)
    && hasValidLifePaths(lifePath.restrictions.lifePaths, char.lifePaths)
}

module.exports = {
    addLifePath : addLifePath,
    getLifePath : getLifePath,
    removeLifePath : removeLifePath,
    removeSetting : removeSetting,
    removeStock : removeStock,
    listAllPaths : listAllPaths,
    listSettingsForStock : listSettingsForStock,
    listPathsForSetting : listPathsForSetting,
    addRestriction : addRestriction,
    isValid: isValid,
    listPathsForChar: listPathsForChar
}
