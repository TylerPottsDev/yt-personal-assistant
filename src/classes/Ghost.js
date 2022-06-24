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

			// Check if wakeword is in result
			if (result.includes(this.WAKEWORD)) {
				this.wakeListenerActive = false
				this.wakeListener.stop()
				
				// Check if it is a command as well and run it.
				const isCommand = this.RunCommand(result)

				// If its not a command ask for one.
				if (!isCommand) {
					this.speak("What is your command, sir?")

					// Listen for command
					const cmdListener = this.listen({continuous: true})

					const timeout = setTimeout(() => {
						cmdListener.stop()
						this.wakeListenerActive = true
						this.wakeListener.start()
						this.speak("Sorry, I did not understand your command, sir.")
					}, 15000)
					
					// Get command listener results
					cmdListener.onresult = evt => {
						const result = evt.results[0][0].transcript.toLowerCase().trim()

						console.log(result);

						// Check if command exists and run it
						const isCMD = this.RunCommand(result)

						// If command exists stop listening for more commands
						if (isCMD) {
							cmdListener.stop()
							this.wakeListenerActive = true
							this.wakeListener.start()
							clearTimeout(timeout)
						}
					}
				}
			}
		}

		// If wake listener is active and it stops, start it again.
		this.wakeListener.onend = () => {
			if (this.wakeListenerActive) {
				this.wakeListener.start()
			}
		}
	}

	speak (text) {
		let msg = new SpeechSynthesisUtterance(text)
		this.speaker.speak(msg)
	}

	listen (options = {}) {
		const listener = new this.sr()
		listener.lang = this.lang
		listener.maxAlternatives = options.maxAlternatives || 1
		listener.continuous = options.continuous || false
		listener.start()

		return listener
	}

	RunCommand (command) {
		const matches = []

		for (let i = 0; i < this.commands.length; i++) {
			const c = this.commands[i];
			if (c.phrases.filter(p => command.toLowerCase().includes(p)).length > 0) {
				matches.push(c)
			}
		}

		if (matches.length > 0) {
			const match = matches[0]
			const args = match.args(command)

			if (match.action) {
				match.action(args)
			}

			if (match.reply) {
				this.speak(match.reply(args))
			}
			
			return true
		} else {
			return false
		}
	}
}