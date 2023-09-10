import {InvalidArgumentError} from 'commander';

export const Parse = {
	int: (value: string) => {
		const parsedValue = parseInt(value, 10);
		if (isNaN(parsedValue)) {
			throw new InvalidArgumentError('Not a int.');
		}
		return parsedValue;
	},
	regexp: (value: string) => {
		try {
			return new RegExp(value);
		} catch (e) {
			throw new InvalidArgumentError(`Not valid regexp: ${String(e)}`);
		}
	}
} as const;
