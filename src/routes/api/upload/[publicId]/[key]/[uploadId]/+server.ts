export const DELETE = async ({ params, locals: { bucket } }) => {
	const { publicId, key, uploadId } = params;
	const multipartUpload = bucket.resumeMultipartUpload(`${publicId}/${key}`, uploadId);

	await multipartUpload.abort();

	return Response.json({ success: true });
};
