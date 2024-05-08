export const round = (value: number, digits = 2): number => {
	const power = Math.pow(10, digits);
	return Math.round(value * power) / power;
};

export const formatBytes = (bytes: number): string => {
	const kilobytes = bytes / 1000;
	if (kilobytes < 1) return `${bytes} bytes`;

	const megabytes = kilobytes / 1000;
	if (megabytes < 1) return `${kilobytes.toFixed(2)} KB`;

	const gigabytes = megabytes / 1000;
	if (gigabytes < 1) return `${megabytes.toFixed(2)} MB`;

	const terabytes = gigabytes / 1000;
	if (terabytes < 1) return `${gigabytes.toFixed(2)} GB`;

	return `${terabytes.toFixed(2)} TB`;
};
