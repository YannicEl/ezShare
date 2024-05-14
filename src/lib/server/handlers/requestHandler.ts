import { error, type RequestHandler } from '@sveltejs/kit';
import type { Schema } from 'zod';

type DefineRequestHandlerParams<T> = {
	schema?: Schema<T>;
};

type CustomRequestHandlerParams<T> = Parameters<RequestHandler>[0] & { data: T };
type CustomeRequestHandler<T> = (
	params: CustomRequestHandlerParams<T>
) => ReturnType<RequestHandler>;

export function defineRequestHandler<Data = undefined>(
	{ schema }: DefineRequestHandlerParams<Data>,
	handler: CustomeRequestHandler<Data>
): RequestHandler {
	return async (params) => {
		const { request } = params;

		let data = undefined as Data;
		if (schema) {
			try {
				const json = await request.json();
				data = schema.parse(json);
			} catch (err) {
				console.error(err);
				error(422);
			}
		}

		return handler({ ...params, data });
	};
}
