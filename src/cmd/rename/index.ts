import {createCommand} from 'commander';
import {cmdNumAdd} from './num-add.js';

export const cmdRename = createCommand('rename')
	.addCommand(cmdNumAdd)
	.action(() => {
		cmdRename.outputHelp();
	});

