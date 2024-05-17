export async function _fetch<T>(...params: Parameters<typeof fetch>): Promise<T> {
	const res = await fetch(...params);
	const json = await res.json<T>();
	return json;
}
