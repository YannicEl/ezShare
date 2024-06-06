export async function concurrencPromises<T>(
	promises: (() => Promise<T>)[],
	concurency: number
): Promise<T[]> {
	const results: T[] = [];
	await Promise.all(
		Array.from({ length: concurency }, async (_, i) => {
			while (promises.length) {
				const promise = promises.shift();
				if (!promise) break;
				results.push(await promise());
			}
		})
	);

	return results;
}
