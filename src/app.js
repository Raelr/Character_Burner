const yargs = require('yargs')
const char = require('./util/char')
const lp = require('./util/lifepath.js')
const skill = require('./util/skill.js')

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
        s: {
            describe: 'The skills associated with the lifepath (just input their names)',
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
        },
        r: {
            describe: 'The number of resources granted by the skill',
            demandOption: true
        },
        sta: {
            describe: 'Stat bonuses conferred by lifepath (must be in form [Number + Stat]. I.e: 1M or 1P)',
            type: 'string'
        }
    },
    handler(argv) {
        var skills = []
        argv.s.forEach((item) => {
            var pathSkill = skill.getSkill(item)
            if (pathSkill) {
                skills.push(pathSkill)
            }
        })
        var stat = ''
        if (argv.sta) {
            stat = argv.sta
        }
        lp.addLifePath(argv.n, argv.se, argv.st, argv.ti, argv.l, skills, argv.sp, argv.tp, argv.r, stat)
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
        // Based on the number of arguments given, a different command will execute.
        // Option 1: All three options are given -> Delete a lifepath
        if (argv.lp && argv.se) {
            lp.removeLifePath(argv.lp, argv.se, argv.st)
        // Option 2: a setting is given by no lifepath is -> Delete Setting
        } else if (argv.se && !argv.lp) {
            lp.removeSetting(argv.st, argv.se)
        } else {
            // Option 3: Only a stock is given -> Will only delete the stock IF an override command is given.
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

// Command lists differnet things based on the input
// Option 1: Stock is provided but no setting is specified.
// Result: A list of all settings under the specified stock are listed
// Option 2: A stock and setting are listed.
// Result: All lifepaths under the setting are listed.
// Option 3: No options are given.
// Result: All stocks, settings, and lifepaths are listed.
yargs.command({
    command: 'ls',
    describe: 'Lists lifepaths. Can use stock and setting as filters.',
    builder: {
        st: {
            describe: 'The stock the lifepath is part of.',
            type: 'string'
        },
        se: {
            describe: 'The setting the lifepath resides in',
            type: 'string'
        },
        c: {
            describe: 'The character\'s name you want to find',
            type: 'string'
        }
    },
    handler(argv) {
        // Lists ALL available lifepaths based on the character's latest path.
        if (argv.c) {
            var leads = char.getLeadList(argv.c)
            console.log('Available Lifepaths for character: ' + argv.c)
            leads.forEach(setting => {
                lp.listPathsForSetting(char.getCharStock(argv.c), setting)
            })
        // List all lifepaths in a specified setting
        } else if (argv.st && argv.se) {
            lp.listPathsForSetting(argv.st, argv.se)
        // Lists all settings available in a stock
        } else if (argv.st) {
            lp.listSettingsForStock(argv.st)
        // Lists ALL paths available in general.
        } else {
            lp.listAllPaths()
        }
    }
})

// Command for adding new skills to the list of available skills.
yargs.command({
    command: 'as',
    describe: 'Adds a new skill to the game',
    builder: {
        n: {
            describe: 'The skill\'s name.',
            demandOption: true,
            type: 'string'
        },
        s: {
            describe: 'Stat the skill is associated with',
            demandOption: true,
            type: 'string'
        },
        st: {
            describe: 'The stock that can use this skill.',
            type: 'string'
        }
    },
    handler(argv) {
        var stock = ''
        if (argv.st) {
            stock = argv.st
        }
        skill.addSkill(argv.n, argv.s, stock)
    }
})

// Removes a skill from the skill list.
yargs.command({
    command: 'rs',
    describe: 'Removes a skill from the skill list',
    builder: {
        s: {
            describe: 'The name of the skill you want to remove',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        skill.removeSkill(argv.s)
    }
})

var string = '1P'

yargs.parse();
