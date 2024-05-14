import type { Action, Actions } from '@sveltejs/kit';
import { Schema } from 'zod';

type DefineFormActionParams<T> = {
	schema?: Schema<T>;
};

type CustomActionParams<T> = Parameters<Action>[0] & { data: T };
type CustomAction<T> = (params: CustomActionParams<T>) => ReturnType<Action>;

export function defineFormAction<Data = undefined>(
	{ schema }: DefineFormActionParams<Data>,
	action: CustomAction<Data>
): Actions {
	return {
		default: async (params) => {
			const { request } = params;

			const formData = await request.formData();
			const parsedFormData = formDataToObject(formData);

			const data = schema?.parse(parsedFormData) as Data;

			return action({ ...params, data });
		},
	};
}

function formDataToObject(
	formData: FormData
): Record<string, FormDataEntryValue | FormDataEntryValue[]> {
	const ret: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};

	for (const key of new Set(formData.keys())) {
		const values = formData.getAll(key);
		if (values.length > 1) {
			ret[key] = values;
		} else {
			ret[key] = values[0];
		}
	}

	return ret;
}
