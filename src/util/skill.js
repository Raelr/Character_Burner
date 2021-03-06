const fs = require('fs')

// TODO:
// 1. Integrate skills with characters.
// 2. Allow characters to allocate points to skills.
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

const listAllSkills = () => {
    console.log("All available skills:")
    loadSkills().forEach((skill) => {
        console.log('   - ' + skill.name)
    })
}

const listSkillsFromStat = (statName) => {
    console.log('Listing all skills of stat: ' + statName)
    loadSkills().filter((stat) => stat.stat.toLowerCase() === statName.toLowerCase())
    .forEach((stat) => {
        console.log('   - ' + stat.name)
    })
}

const listWises = () => {
    const regex = /\bwise\b/
    console.log('Listing all registered wises:')
    loadSkills().filter((skill) => skill.name.search(regex) != -1)
    .forEach( (skill) =>  {
        console.log('   - ' + skill.name)
    })
}

const listSkillsFromStock = (stockName) => {
    console.log('Listing all skils restricted by stock: ' + stockName)
    loadSkills().filter((skill) => skill.stock.toLowerCase() === stockName)
    .forEach((skill) => {
        console.log('   * ' + skill.name)
    })
}

const removeSkill = (skillName) => {
    skills = loadSkills()
    skills.splice(indexOf(skills, skillName), 1)
    saveSkills(skills)
}

const indexOf = (list, skillName) => {
    var idx = 0
    var wantedIdx = -1
    list.forEach((item) => {
        if (item.name.toLowerCase().localeCompare(skillName.toLowerCase()) == 0) {
            wantedIdx = idx
        } else {
            idx+= 1
        }
    })
    return wantedIdx
}

module.exports = {
    addSkill : addSkill,
    getSkill : getSkill,
    listAllSkills : listAllSkills,
    listSkillsFromStat : listSkillsFromStat,
    listWises : listWises,
    listSkillsFromStock: listSkillsFromStock,
    removeSkill : removeSkill,
};
