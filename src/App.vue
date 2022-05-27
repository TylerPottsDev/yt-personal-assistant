<script setup>
const sr = window.SpeechRecognition || window.webkitSpeechRecognition;

// HOT KEY DETECTION
const hotkey_recog = new sr();
hotkey_recog.lang = 'en-GB';

hotkey_recog.onresult = evt => {
	for (let i = 0; i < evt.results.length; i++) {
		if (evt.results[i].isFinal) {
			const result = evt.results[i][0].transcript;
			
			console.log(result);
		}
	}
}

hotkey_recog.onend = () => {
	hotkey_recog.start();
}

// const recogniser = new sr();
// recogniser.lang = 'en-GB';
// recogniser.interimResults = false;
// recogniser.continuous = true;

// recogniser.onresult = (evt) => {
// 	for (let i = 0; i < evt.results.length; i++) {
// 		console.log(evt.results[i][0].transcript);

// 	}
// };

// recogniser.onend = () => {
// 	// recogniser.start();
// 	console.log("Ended");
// };

const activate = () => {
	hotkey_recog.start();
}

// const record = () => {
// 	recogniser.start();
// }
</script>

<template>
	<main class="min-h-screen bg-gray-800 text-white flex items-center justify-center">
		<button @click="activate" class="bg-red-500 px-4 py-2 rounded-lg uppercase font-bold transition duration-200 hover:scale-110 active:scale-95 active:opacity-75">Record</button>
	</main>
</template>