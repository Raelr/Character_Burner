const yargs = require('yargs')
const char = require('./util/char')
const lp = require('./util/lifepath.js')

// Command for creating a new character.
yargs.command({
    command: 'nc',
    describe: 'Creates a new character',
    builder: {
        n: {
            describe: 'Character Name',
            demandOption: true,
            type: 'string'
        },
        c: {
            describe: 'Character concept',
            demandOption: false,
            type: 'string'
        },
        s: {
            describe: 'What stock do you belong to? [Human/Dwarf/Elf/Orc]',
            demandOption: true,
            type: 'string'
        },
        o: {
            describe: 'Override saved character',
            demandOption: false,
            type: 'bool'
        },
    },
    handler(argv) {
        if (argv.s.toLowerCase() === 'dwarf' || argv.s.toLowerCase() === 'human'
        || argv.s.toLowerCase() === 'orc' || argv.s.toLowerCase() === 'elf') {

            char.addChar(argv.n, argv.c, argv.s, argv.o)
        } else {
            console.log("Please select a valid Stock [Human/Dwarf/Elf/Orc]");
        }
    }
})

// Command foir adding new lifepaths
yargs.command({
    command: 'al',
    describe: 'Allows new lifepaths to be added to the game.',
    builder: {
        n: {
            describe: 'LifePath name.',
            demandOption: true,
            type: 'string'
        },
        se: {
            describe: 'Setting lifepath belongs to.',
            demandOption: true,
            type: 'string'
        },
        st: {
            describe: 'Stock lifepath belongs to.',
            demandOption: true,
            type: 'string'
        },
        ti: {
            describe: 'Time within certain lifepath (used for age)',
            demandOption: true,
        },
        l: {
            describe: 'Other settings this lifepath leads into.',
            demandOption: true,
            type: 'array'
        },
        sp: {
            describe: 'Number of skill points.',
            demandOption: true,
        },
        tp: {
            describe: 'Number of trait points',
            demandOption: true,
        }
    },
    handler(argv) {
        lp.addLifePath(argv.n, argv.se, argv.st, argv.ti, argv.l, argv.sp, argv.tp)
    }
})

yargs.command({
    command: 'rl',
    describe: 'Removes a lifepath from the lifepaths file.',
    builder: {
        st: {
            describe: 'What stock does the lifepath belong to?',
            demandOption: true,
            type: 'string'
        },
        se: {
            describe: 'What setting does the lifepath belong to?',
            type: 'string'
        },
        lp: {
            describe: 'What is the lifepath\'s name?',
            type: 'string'
        },
        o: {
            describe: 'Tells program to override data stored in the lifepaths storage.',
            type: 'bool'
        }
    },
    handler(argv) {
        if (argv.se && !argv.lp) {
            lp.removeSetting(argv.st, argv.se)
        } else if (argv.lp && argv.se) {
            lp.removeLifePath(argv.lp, argv.se, argv.st)
        } else {
            if (argv.o) {
                lp.removeStock(argv.st)
            } else {
                console.log('WARNING: attempt to delete stock ' + argv.st + ' may delete all settings below it.')
                console.log('Override command required. Please use --o flag to force deletion.')
            }
        }
    }
})

// Command for adding lifepaths TO a character.
yargs.command({
    command: 'alt',
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
        },
        st: {
            describe: 'Character stock',
            demandOption: true,
            type: 'String'
        }
    },
    handler(argv) {
        var path = lp.getLifePath(argv.st, argv.s, argv.lp)

        if (path) {
            char.addPathToChar(argv.c, path, argv.st, argv.s)
        }
    }
})

yargs.parse();
