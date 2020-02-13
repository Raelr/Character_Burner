const prompt = require('prompt')

const character = { 
    properties: { 
        name: {
            message: "Please Enter your character's name.",
            required: true
        },
        concept: {
            message: "Please enter your character concept."
        }
    }
}

const intro = () => {
    console.log('##################################')
    console.log('#########CHARACTER BURNER#########')
    console.log('##################################')
}

intro()

prompt.start()

prompt.get(character, (err, result) => {
    console.log("You said: ")
    console.log("Name: " + result.name)
    console.log("Concept: " + result.concept)
})