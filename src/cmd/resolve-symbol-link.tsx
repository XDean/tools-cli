import {createCommand} from 'commander';
import {Parse} from '../util/index.js';
import path from 'path';
import React from 'react';
import chalk from 'chalk';
import * as prompt from '@inquirer/prompts';
import {promises as fs} from 'fs';

type Options = {
	delete: boolean
}

export const cmdResolveSymbolLink = createCommand('resolve-symbol-link')
	.argument('<paths...>', 'path (glob) to be renamed')
	.option('--delete', 'delete origin file', false)
	.action(async (paths: string[], opts: Options) => {
		console.log(`Found ${paths.length} files`);
		console.log('-'.repeat(process.stdout.columns));
		const pathMap: [string, string][] = [];
		for (const filePath of paths) {
			const s = await fs.stat(filePath);
			if (s.isSymbolicLink()) {
				const real = await fs.realpath(filePath);
				pathMap.push([filePath, real]);
				console.log(chalk.green(filePath), '->', chalk.green(real));
			} else {
				console.log(chalk.gray(filePath), 'not a symbol link');
			}
		}
		console.log('-'.repeat(process.stdout.columns));
		console.log(`Total ${pathMap.length} file will be ${opts.delete ? 'replaced and removed' : 'copied'}.`);
		const confirm = await prompt.confirm({
			message: 'Confirm to process?',
			default: false,
		});
		if (confirm) {
			for (const [symbolPath, realPath] of pathMap) {
				console.log(symbolPath, chalk.cyan('<-'), realPath);
				try {
					await fs.unlink(symbolPath);
					if (opts.delete) {
						await fs.rename(realPath, symbolPath);
					} else {
						await fs.cp(realPath, symbolPath);
					}
				} catch (e) {
					console.log(chalk.red('ERROR:'), e);
				}
			}
		}
	});
