const yargs = require('yargs')
const char = require('./util/char')
const lp = require('./util/lifepath.js')

yargs.command({
    command: 'nc',
    describe: 'Creates a new character',
    builder: {
        name: {
            describe: 'Character Name',
            demandOption: true,
            type: 'string'
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

yargs.command({
    command: 'add_lp',
    describe: 'Allows new lifepaths to be added to the game.',
    builder: {

    }
})

yargs.command({
    command: 'add_lp_to',
    describe: 'Adds a lifepath to a specified character.',
    builder: {
        c: {
            decribe: "Character name.",
            demandOption: true,
            type: 'string'
        },
        lp: {
            describe: 'LifePath name',
            demandOption: true,
            type: 'string'
        },
        s: {
            describe: 'Setting',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        var path = lp.getLifePath(argv.lp, argv.s)
        if (path) {
            char.addPathToChar(argv.c, path)
        }
    }
})

yargs.parse();
