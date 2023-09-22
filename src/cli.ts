import {program} from 'commander';
import {cmdRename} from './cmd/rename/index.js';
import {cmdResolveLink} from './cmd/resolve-link.js';

program
	.name('XDean-tools')
	.version('1.0.0')
	.addCommand(cmdRename)
	.addCommand(cmdResolveLink);

await program.parseAsync();
