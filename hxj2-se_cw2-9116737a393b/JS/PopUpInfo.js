class PopUpInfo {
	constructor() {
		this.text= " ";
		this.element = null;
		this.map = {
			"KeyG": "storage",

		  }
		this.popedUp = 0
	}

	createElement(storage) {
		//Create the element
		this.element = document.createElement("div");
		this.element.classList.add("PopUpInfo");

		var newText = "<div>Inventory:</div>   "
		storage.map(item => {
			newText = newText +"<div><h7>" + item + "</h7></div>"
		})
		this.text = newText

		var test = "<h7>dddd</h7>\
					<div></div>\
		<h7>abcd</h7>"

					// <h5>${this.text}</>
		this.element.innerHTML = (`
			<p class="PopUpInfo_p"></p>
			${this.text}
			<button class="PopUpInfo_button">Close</button>
    	`);

		//Iniciando o efeito da maquina de escrever
		// this.revealingText = new RevealingText({
		// 	element: this.element.querySelector(".PopUpInfo_p"),
		// 	text: this.text,
		// })

		// this.element.querySelector(".PopUpInfo_p")
		// this.element.appendChild(this.text)

		this.element.querySelector("button").addEventListener("click", () => {
			//Close the text message
			this.done();
		});


		this.actionListener = new KeyPressListener("Enter", () => {		
			console.log("checkvalue")
			this.done();
		})

	}

	done() {
		// if(this.revealingText.isDone){

		// 	// this.onComplete();
		// }
		// else{
		// 	this.revealingText.warpToDone();
		// }
		// console.log("Done",this.revealingText.isDone)

		this.element.remove();
		this.actionListener.unbind();
		this.popedUp = 0
	}

	init(container,person) {



		document.addEventListener("keyup", e => {
			if (e.code == "KeyG" && this.popedUp == 0){
				this.createElement(person.storage);
				container.appendChild(this.element);
				// this.revealingText.init();
				this.popedUp = 1

			}


		  })
	}

}