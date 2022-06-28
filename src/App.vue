<script setup>
import config from "./config"
import commands from "./commands"
import { Ghost } from "./classes/Ghost"

const ghost = new Ghost(config, commands)

const activate = () => {
	ghost.activate()
}
</script>

<template>
	<main class="min-h-screen bg-gray-800 text-white flex items-center justify-center">
		<button 
			v-if="!ghost.wakeListenerActive"
			@click="activate"
			class="bg-red-500 px-4 py-2 rounded-lg uppercase font-bold transition duration-200 hover:scale-110 active:scale-95 active:opacity-75">
			Activate Ghost
		</button>

		<p v-else>Ghost is listening...</p>
	</main>
</template>