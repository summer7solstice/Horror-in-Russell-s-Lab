class Overworld {
	constructor(config) {
		this.element = config.element;
		this.canvas = this.element.querySelector(".game-canvas");
		this.ctx = this.canvas.getContext("2d");
		this.map = null;
	}

	startGameLoop() {
		const step = () => {

			//Clear off the canvas
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			//Establish the camera person
			const cameraPerson = this.map.gameObjects.hero;

			//Update all objects
			Object.values(this.map.gameObjects).forEach(object => {
				object.update({
					arrow: this.directionInput.direction,
					map: this.map,
				})
			})

			//Draw Lower layer
			this.map.drawLowerImage(this.ctx, cameraPerson);

			//Draw Game Objects
			Object.values(this.map.gameObjects).sort((a, b) => {
				return a.y - b.y;
			}).forEach(object => {
				object.sprite.draw(this.ctx, cameraPerson);
			})

			//Draw Upper layer
			this.map.drawUpperImage(this.ctx, cameraPerson);

			requestAnimationFrame(() => {
				step();
			})
		}
		step();
	}

	bindActionInput() {
		new KeyPressListener("Enter", () => {
			//Is there a person here to talk to?
			this.map.checkForActionCutscene()
		})
	}

	bindHeroPositionCheck() {
		document.addEventListener("PersonWalkingComplete", e => {
			if (e.detail.whoId === "hero") {
				//Hero's position has changed
				this.map.checkForFootstepCutscene()
			}
		})
	}

	startMap(mapConfig) {
		this.map = new OverworldMap(mapConfig);
		this.map.overworld = this;
		this.map.mountObjects();
	}

	async init() {
		this.startMap(window.OverworldMaps.Title);


		this.bindActionInput();
		this.bindHeroPositionCheck();

		this.directionInput = new DirectionInput();
		this.directionInput.init();

		// this.stop = await new Promise(async resolve => {
		// 	// this[this.event.type](resolve)
		// 	this.stopScene = new StopScene()
		// 	await this.stopScene.init(resolve)
		// })

		this.popUpInfo = new PopUpInfo();
		this.popUpInfo.init(document.querySelector(".game-container"),this.map.gameObjects.hero);



		this.startGameLoop();

		this.map.startCutscene([
			// { type: "battle"}
			{ type: "stopScene", text: "What happened?"},
			// { type: "changeMap", map: "Title"},
			// { type: "textMessage", text: "What happened?"},
			{ type: "changeMap", map: "Lab"},



			{ type: "textMessage", text: "What happened?"},
			{ type: "textMessage", text: "Where- "},
			{ type: "textMessage", text: "Wait"},
			{ type: "textMessage", text: "The lab… "},
			{ type: "textMessage", text: "It’s… "},
			{ type: "textMessage", text: "…ruined. "},
			{ type: "textMessage", text: "Did it explode? What happened? "},
			{ type: "textMessage", text: "The machine… "},
			{ type: "textMessage", text: "I need to get to the machine "},


		])
	}
}