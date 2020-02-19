const yargs = require('yargs')
const char = require('./util/char')

yargs.command({
    command: 'new_char',
    describe: 'Creates a new character',
    builder: {
    name: {
        describe: 'Character Name',
        demandOption: true,
        type: 'string'
        }
    },
    concept: {
        describe: 'Character concept',
        demandOption: false,
        type: 'string'
    },
    stock: {
        describe: 'What stock do you belong to? [Human/Dwarf/Elf/Orc]',
        demandOption: true,
        type: 'string'
    }, 
    handler(argv) {
    char.addChar(argv.name, argv.concept, argv.stock)
    }
})

yargs.parse();
