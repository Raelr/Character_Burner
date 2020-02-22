const fs = require('fs')

// TODO: Get skills from lifepath.
// TODO: Remove lifepaths
// TODO: Allow lifepaths to be overridden.
// TODO: Integrate lifepaths with char.
// TODO: Create associated skills.
// TODO: Create associated traits.

const addLifePath = (name, setting, stock, time, leads, skills, traits) => {

    var paths = loadLifePaths()

    if (!(paths.filter((lp) => lp.name === name && lp.setting === setting).find(
        (lp) => lp.name === name && lp.setting === setting))) {

        var data = {
            name: name,
            setting: setting,
            stock: stock,
            time: time,
            leads: leads,
            skills: skills,
            traits: traits
        }
        paths.push(data)
        saveLifePath(paths)
        console.log('Added new lifepath: ' + name)
    } else {
        console.log('Lifepath already exists!')
    }
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
