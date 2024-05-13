export async function $fetch<T>(...params: Parameters<typeof fetch>): Promise<T> {
	const res = await fetch(...params);
	const json = (await res.json()) as T;
	return json;
}
