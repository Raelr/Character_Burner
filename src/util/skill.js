const fs = require('fs')

// TODO:
// 4. Create command for listing skills.
// 5. Create command for returning skills.
// 6. Integrate skills with lifepaths.
// 7. Integrate skills with characters.
// 8. Allow characters to allocate points to skills.

const addSkill = (name, stat, stock) => {

    const skills = loadSkills()

    var data = {
        name: name,
        stat: stat,
        stock: stock
    }

    if (!getSkill(name)) {
        skills.push(data)
        skills.sort((a, b) => a.name.localeCompare(b.name))
        saveSkills(skills)
    } else {
        return console.log(name + ' already exists!')
    }
}

const saveSkills = (skills) => {
    const dataJSON = JSON.stringify(skills, null, 2)
    fs.writeFileSync('./skills.json', dataJSON)
}

const loadSkills = () => {
    try {
        const buffer = fs.readFileSync('./skills.json')
        const dataJSON = JSON.parse(buffer)
        return dataJSON
    } catch(e) {
        return []
    }
}

const getSkill = (skillName) => {
    return loadSkills().find((skill) => skillName.toLowerCase() === skill.name.toLowerCase())
}

module.exports = {
    addSkill : addSkill
};
