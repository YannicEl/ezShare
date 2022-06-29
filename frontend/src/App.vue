<template>
	<h1 class="font-sans">Hi</h1>
</template>

<script setup lang="ts">
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString } from 'firebase/storage';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
};

const app = initializeApp(firebaseConfig);

console.log(app);

const storage = getStorage(app);

const file = ref(storage, 'test.txt');

uploadString(file, 'test').then((snapshot) => {
	console.log('Uploaded a base64url string!');
});
</script>

<style></style>
