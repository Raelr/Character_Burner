const prompt = require('prompt')
const fs = require('fs')

const character = { 
    properties: { 
        name: {
            pattern: /^[a-zA-Z\s\-]+$/,
            message: "Please Enter your character's name.",
            required: true
        },
        concept: {
            pattern: /^[a-zA-Z\s\-]+$/,
            message: "Please enter your character concept.",
            required: true
        },
        stock: {
            pattern: /^[a-zA-Z\s\-]+$/,
            message: "What stock do you originate from?",
            required: true
        }
    }
}

const stocks = {
    HUMAN: 0,
    ELF: 1,
    DWARF: 2,
    ORC: 3
}

var stocks2 = stocks

const intro = () => {
    console.log('####################################')
    console.log('######### CHARACTER BURNER #########')
    console.log('####################################\n')
}

intro()

prompt.start()

prompt.get(character, (err, result) => {
    console.log("\nYour Character so far: ")
    console.log("Name: " + result.name)
    console.log("Concept: " + result.concept)
    console.log("Stock: " + result.stock)

    var json_char = JSON.stringify({name: result.name, concept: result.concept, stock: result.stock}, null, 2)
    fs.writeFileSync('char.json', json_char, (err) => {
        if (err) {
            return console.log('An error has occurred parsing to json!')
        } 
        console.log('Data saved to file.')
    })
})