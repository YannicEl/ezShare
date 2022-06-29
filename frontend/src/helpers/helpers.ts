export const round = (value: number, digits = 2): number => {
	const power = Math.pow(10, digits);
	return Math.round(value * power) / power;
};
