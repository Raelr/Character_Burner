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
  handler(argv) {
    char.addChar(argv.name)
  }
})

yargs.parse();
