const yargs = require('yargs')
const char = require('./util/char')
const lp = require('./util/lifepath.js')

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
    override: {
        describe: 'Override saved character',
        demandOption: false,
        type: 'bool'
    },
    handler(argv) {

        if (argv.stock.toLowerCase() === 'dwarf' || argv.stock.toLowerCase() === 'human'
        || argv.stock.toLowerCase() === 'orc' || argv.stock.toLowerCase() === 'elf') {

            char.addChar(argv.name, argv.concept, argv.stock, argv.override)
        } else {

            console.log("Please select a valid Stock [Human/Dwarf/Elf/Orc]");
        }
    }
})

yargs.parse();