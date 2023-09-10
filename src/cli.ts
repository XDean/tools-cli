import {program} from 'commander';
import {cmdRename} from "./cmd/rename/index.js";

program
	.name('XDean-tools')
	.version('1.0.0')
	.addCommand(cmdRename);

await program.parseAsync();
