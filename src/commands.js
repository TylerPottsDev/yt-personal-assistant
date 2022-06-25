export default [
	// Open a website
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
	// Tell a joke
	// Todo: Add a joke database
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
	// Make me a sandwich
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
	},
	// Search wikipedia
	{
		name: "search",
		phrases: [
			"search for",
			"tell me about",
			"look up"
		],
		args: (command, directive) => {
			command = command.replace("ghost", "").replace(directive, "").trim()

			return {
				query: command
			}
		},
		reply: args => {
			return new Promise((resolve, reject) => {
				fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=1&srsearch=${args.query}`)
					.then(res => res.json())
					.then(data => {
						const summary = data.query.search[0].snippet.replace('<span class="searchmatch">', "").replace('</span>', "")
						resolve(`Here is what I found out about ${args.query}. ${summary}`)
					})
					.catch(err => {
						reject(err)
					})
			})
		}
	},
	// Play music
	// Todo: Actually play music, spotify or youtube? :thinking:
	{
		name: "play_music",
		phrases: [
			"play music",
			"play song",
			"play"
		],
		args: (command, directive) => {
			const song = command.replace("ghost", "").replace(directive, "").trim()

			return {
				song
			}
		},
		reply: args => {
			return `Playing ${args.song}`
		}
	}
]