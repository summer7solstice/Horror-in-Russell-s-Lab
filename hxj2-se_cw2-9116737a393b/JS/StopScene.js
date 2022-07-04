class StopScene {
	constructor({ text, onComplete }) {
		this.text = text;
		this.onComplete = onComplete;
		this.element = null;
	}

	createElement() {
		//Create the element

		this.actionListener = new KeyPressListener("Enter", () => {		
			this.done();
		})

	}

	done() {
        this.onComplete();
	}

	init(container) {
		this.createElement();
		// container.appendChild(this.element);
		// this.revealingText.init();
	}

}