export class Ghost {
	constructor (config, commands) {
		this.WAKEWORD = config.wakeword || "ghost"
		this.lang = config.lang || "en-GB"
		this.commands = commands
		this.sr = window.SpeechRecognition || window.webkitSpeechRecognition
		this.speaker = window.speechSynthesis
		this.wakeListenerActive = true
	}

	activate () {
		this.wakeListener = this.listen()

		// Get wake listener results
		this.wakeListener.onresult = evt => {
			const result = evt.results[0][0].transcript.toLowerCase().trim()
			console.log("[EVENT] Wake Word Result: " + result)

			// Check if wakeword is in result
			if (result.includes(this.WAKEWORD)) {
				this.wakeListenerActive = false
				this.wakeListener.stop()
				
				// Check if it is a command as well and run it.
				const isCommand = this.runCommand(result)

				// If its not a command ask for one.
				if (!isCommand) {
					console.log("[INFO] No command found. Asking for one.")
					this.speak("What is your command, sir?")

					// Listen for command
					const cmdListener = this.listen({continuous: true})

					const interval = setInterval(() => {
						console.log("[ERROR] No command asked within time. Back into sleep mode.")
						clearInterval(interval)
						cmdListener.stop()
						this.wakeListenerActive = true
						this.wakeListener.start()
						this.speak("Sorry, I did not understand your command, sir.")
					}, 15000)
					
					// Get command listener results
					cmdListener.onresult = evt => {
						const result = evt.results[0][0].transcript.toLowerCase().trim()
						console.log("[EVENT] Command listener result: " + result)

						// Check if command exists and run it
						const isCMD = this.runCommand(result)

						// If command exists stop listening for more commands
						if (isCMD) {
							console.log("[EVENT] Command ran. Back into sleep mode.")
							cmdListener.stop()
							clearInterval(interval)
						}
					}

					cmdListener.onend = () => {
						console.log("[EVENT] CMD Listener ended. Back into sleep mode.")
						this.wakeListenerActive = true
						this.wakeListener.start()
					}
				} else {
					this.wakeListenerActive = true
					this.wakeListener.start()
				}
			}
		}

		// If wake listener is active and it stops, start it again.
		this.wakeListener.onend = () => {
			console.log("[EVENT] Wake listener ended.")
			if (this.wakeListenerActive) {
				console.log("[EVENT] Wake listener restarting.")
				this.wakeListener.start()
			}
		}
	}

	speak (text) {
		console.log("[EVENT] Speaking: " + text)
		let msg = new SpeechSynthesisUtterance(text)
		this.speaker.speak(msg)
	}

	listen (options = {}) {
		console.log("[EVENT] Listener created.")
		const listener = new this.sr()
		listener.lang = this.lang
		listener.maxAlternatives = options.maxAlternatives || 1
		listener.continuous = options.continuous || false
		listener.start()

		return listener
	}

	async runCommand (command) {
		const matches = []
		let directive = null

		for (let i = 0; i < this.commands.length; i++) {
			const c = this.commands[i]
			if (c.phrases.filter(p => command.toLowerCase().includes(p)).length > 0) {
				matches.push(c)
				if(!directive) directive = c.phrases.filter(p => command.toLowerCase().includes(p))[0]
			}
		}

		if (matches.length > 0) {
			const match = matches[0]
			const args = (match.args) ? match.args(command, directive) : null

			if (match.action) {
				match.action(args)
			}

			if (match.reply) {
				this.speak(await match.reply(args))
			}

			console.info("[EVENT] Running command.")
			
			return true
		} else {
			return false
		}
	}
}