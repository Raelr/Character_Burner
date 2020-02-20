const fs = require('fs')

// TODO: Allow lifepaths to be queried and found. 
// TODO: Get skills from lifepath. 
// TODO: Remove lifepaths
// TODO: Allow lifepaths to be overridden.
// TODO: Integrate lifepaths with char. 
// TODO: Query specific lifepaths.
// TODO: Create associated skills.

const addLifePath = (name, setting, stock, time, leads, skills, traits) => {
    
    var paths = loadLifePath()

    if (!(paths.filter((lp) => lp.name === name && lp.setting === setting)
    .find((lp) => lp.name === name && lp.setting === setting))) {
        
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

const loadLifePath = () => {
    try {
        const dataBuffer = fs.readFileSync('./lifepaths/lifepaths.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch(e) {
        return [];
    }
}

module.exports = {
    addLifePath : addLifePath
}