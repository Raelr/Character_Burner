const prompt = require('prompt')

const init = { 
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

const intro = () => {
    
    console.log('\n--------------------------------------')
    console.log('|####################################|')
    console.log('|######### CHARACTER BURNER #########|')
    console.log('|####################################|')
    console.log('--------------------------------------\n')

    prompt.start()

    return prompt.get(init, (err, result) => {

        console.log("\nYour Character so far: ")
        console.log("Name: " + result.name)
        console.log("Concept: " + result.concept)
        console.log("Stock: " + result.stock)
    
        return result
    })
}

module.exports = {
    intro: intro
}