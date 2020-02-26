const fs = require('fs')

// TODO: Get skills from lifepath.
// TODO: Allow lifepaths to be overridden.
// TODO: Create associated skills.
// TODO: Create associated traits.

// Adds a new lifepath to the paths file
const addLifePath = (name, setting, stock, time, leads, skills, traits) => {

    var paths = loadLifePaths()

    // create the lifePath object
    var newLifePath = {
        name: name,
        time: time,
        leads: leads,
        skills: skills,
        traits: traits,
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

const getLifePath = (stock, setting, pathName) => {

    lifePaths = loadLifePaths()

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
        } else {
            return console.log('Setting: ' + settingName + ' does not exist!')
        }
    } else {
        return console.log('Stock: ' + stockName + ' does not exist!')
    }
}

module.exports = {
    addLifePath : addLifePath,
    getLifePath : getLifePath,
    removeLifePath : removeLifePath,
    removeSetting : removeSetting,
    removeStock : removeStock
}
