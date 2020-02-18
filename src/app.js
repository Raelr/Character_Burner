const fs = require('fs')
const cmd = require('./util/consoleCmds')

const init = () => {
    
    var result = cmd.intro()

    var json_char = JSON.stringify({name: result.name, concept: result.concept, stock: result.stock}, null, 2)

    fs.writeFileSync('./characters/' + result.name + '.json', json_char, (err) => {
        if (err) {
            return console.log('An error has occurred parsing to json!')
        } 
        console.log('Data saved to file.')
    })
}

init()