const fs = require('fs')

// TODO: Get skills from lifepath.
// TODO: Remove lifepaths
// TODO: Allow lifepaths to be overridden.
// TODO: Integrate lifepaths with char.
// TODO: Create associated skills.
// TODO: Create associated traits.
// TODO: Sort lifepaths into Stocks and Settings

const addLifePath = (name, setting, stock, time, leads, skills, traits) => {

    var paths = loadLifePaths()

    // TODO: Check if setting actually exists.
    // TODO: If Setting does not exist - create new setting field and insert it with the correct name.
    // TODO: If setting does exist - simply insert new lifepath into the setting array.
    // TODO: Reconfigure all dependecies on the new structure.

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

const getPathsFromSetting = (setting) => {
    const paths = loadLifePaths();
    return paths.filter((path) => path.setting.toLowerCase() === setting.toLowerCase())
}

const getLifePath = (lifePath, setting) => {
    var val = getPathsFromSetting(setting).filter((lp) => lp.name.toLowerCase() === lifePath.toLowerCase())
    if (val.length > 0) {
        return val[0]
    } else {
        console.log("No lifepath with name: " + lifePath + " exists!")
        return null
    }
}

module.exports = {
    addLifePath : addLifePath,
    getPathsFromSetting : getPathsFromSetting,
    getLifePath : getLifePath
}
