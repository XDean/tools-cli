import {program} from 'commander';
import {cmdRename} from './cmd/rename/index.js';
import {cmdResolveSymbolLink} from './cmd/resolve-symbol-link.js';

program
	.name('XDean-tools')
	.version('1.0.0')
	.addCommand(cmdRename)
	.addCommand(cmdResolveSymbolLink);

await program.parseAsync();
