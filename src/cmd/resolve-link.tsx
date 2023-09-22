import {createCommand} from 'commander';
import path from 'path';
import React from 'react';
import chalk from 'chalk';
import * as prompt from '@inquirer/prompts';
import {promises as fs} from 'fs';

type Options = {
	delete: boolean
}

export const cmdResolveLink = createCommand('resolve-link')
	.argument('<paths...>', 'path (glob) to be renamed')
	.option('--delete', 'delete origin file', false)
	.action(async (paths: string[], opts: Options) => {
		if (paths.length === 0) {
			cmdResolveLink.outputHelp();
			return;
		}
		console.log(`Found ${paths.length} files`);
		console.log('-'.repeat(process.stdout.columns));
		const pathMap: [string, string][] = [];
		for (const filePath of paths) {
			const nominalPath = path.resolve(filePath);
			const realPath = await fs.realpath(nominalPath);
			if (nominalPath !== realPath) {
				pathMap.push([nominalPath, realPath]);
				console.log(chalk.green(nominalPath), '->', chalk.green(realPath));
			} else {
				console.log(chalk.gray(nominalPath), 'not a link');
			}
		}
		console.log('-'.repeat(process.stdout.columns));
		console.log(`Total ${pathMap.length} file will be ${opts.delete ? 'replaced and removed' : 'copied'}.`);
		const confirm = await prompt.confirm({
			message: 'Confirm to process?',
			default: false,
		});
		if (confirm) {
			for (const [p, realPath] of pathMap) {
				console.log(p, chalk.cyan('<-'), realPath);
				try {
					await fs.unlink(p);
					if (opts.delete) {
						await fs.rename(realPath, p);
					} else {
						await fs.cp(realPath, p);
					}
				} catch (e) {
					console.log(chalk.red('ERROR:'), e);
				}
			}
		}
	});
