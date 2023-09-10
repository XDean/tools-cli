import {createCommand} from 'commander';
import {Parse} from '../../util/index.js';
import path from 'path';
import React from 'react';
import chalk from 'chalk';
import * as prompt from '@inquirer/prompts';
import {promises as fs} from 'fs';

type Options = {
	pattern: RegExp
	delta: number
}

export const cmdNumAdd = createCommand('num-add')
	.argument('<paths...>', 'path (glob) to be renamed')
	.option('-p, --pattern <regexp>', 'pattern to find number', Parse.regexp, /\d+/)
	.option('-d, --delta <number>', 'number to add', Parse.int)
	.action(async (paths: string[], opts: Options) => {
		console.log(`Found ${paths.length} files`);
		console.log('-'.repeat(process.stdout.columns));
		const pathMap: [string, string][] = [];
		paths.forEach((filePath) => {
			const dirName = path.dirname(filePath);
			const fileName = path.basename(filePath);
			const match = opts.pattern.exec(fileName);
			if (match === null) {
				console.log(chalk.red(filePath), `no match`);
			} else {
				const numStr = match.length === 1 ? match[0] : match[1];
				const num = Number(numStr);
				if (Number.isNaN(num)) {
					console.log(chalk.red(filePath), `Matched text '${numStr}' is not number`);
				} else {
					const newNum = num + opts.delta;
					const newName = fileName.substring(0, match.index)
						+ newNum
						+ fileName.substring(match.index + numStr.length);
					console.log(chalk.green(filePath), `new name: ${newName}`);
					pathMap.push([filePath, path.join(dirName, newName)]);
				}
			}
		});
		console.log('-'.repeat(process.stdout.columns));
		console.log(`Total ${pathMap.length} file will be renamed.`);
		const confirm = await prompt.confirm({
			message: 'Confirm to rename?',
			default: false,
		});
		if (confirm) {
			for (const [oldPath, newPath] of pathMap) {
				console.log(oldPath, chalk.cyan('->'), newPath);
				try {
					await fs.rename(oldPath, newPath);
				} catch (e) {
					console.log(chalk.red('ERROR:'), e);
				}
			}
		}
	});
