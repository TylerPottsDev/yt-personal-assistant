<script setup>
import config from "./config"
import { Ghost } from "./classes/Ghost" 

const ghost = new Ghost(config, [
	{
		name: "open_website",
		phrases: [
			"open website",
			"open a website",
			"navigate to",
			"go to website",
			"open the website"
		],
		args: command => {
			const regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
			const url = command.match(regex) && command.match(regex)[0]

			return {
				url
			}
		},
		action: args => {
			if (args.url) {
				window.open(`http://${args.url}`).focus()
			}
		},
		reply: args => {
			if (args.url) {
				return `Opening ${args.url}`
			} else {
				return "Please provide a url"
			}
		}
	},
	{
		name: "joke",
		phrases: [
			"tell me a joke",
			"tell a joke",
			"say a joke"
		],
		reply: () => {
			const jokes = [
				"What do you call a fake noodle? An impasta.",
				"How do you make a tissue dance? You put a little boogie in it.",
				"What do you call a pile of cats? A meow-pile!",
				"What happens if you eat a clock? It goes back to eleven.",
				"What do you call a cow with no legs? Ground beef."
			]

			return jokes[Math.floor(Math.random() * jokes.length)]
		}
	},
	{
		name: "sandwich",
		phrases: [
			"make me a sandwich",
			"get in the kitchen and make me a sandwich",
			"go get me a sandwich"
		],
		reply: () => {
			const responses = [
				"No, I'm not making you a sandwich you dumb bitch",
				"How about go fuck yourself?",
				"Sir, respectfully shut the fuck up"
			]

			return responses[Math.floor(Math.random() * responses.length)]
		}
	}
])

const activate = () => {
	ghost.activate()
}
</script>

<template>
	<main class="min-h-screen bg-gray-800 text-white flex items-center justify-center">
		<button @click="activate" class="bg-red-500 px-4 py-2 rounded-lg uppercase font-bold transition duration-200 hover:scale-110 active:scale-95 active:opacity-75">Activate Ghost</button>
	</main>
</template>