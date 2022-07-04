class OverworldMap {
	constructor(config) {
		this.overworld = null;
		this.location = config.location;
		this.gameObjects = config.gameObjects;
		this.cutsceneSpaces = config.cutsceneSpaces || {};
		this.walls = config.walls || {};

		this.lowerImage = new Image();
		this.lowerImage.src = config.lowerSrc;

		this.upperImage = new Image();
		this.upperImage.src = config.upperSrc;

		this.isCutscenePlaying = false;
	}

	drawLowerImage(ctx, cameraPerson) {
		console.log("utils.withGrid(10.5)", utils.withGrid(10.5))
		console.log("cameraPerson.x", cameraPerson.x)
		ctx.drawImage(
			this.lowerImage,
			utils.withGrid(10.5) - cameraPerson.x,
			utils.withGrid(6) - cameraPerson.y
		)
	}

	drawUpperImage(ctx, cameraPerson) {
		ctx.drawImage(
			this.upperImage,
			utils.withGrid(10.5) - cameraPerson.x,
			utils.withGrid(6) - cameraPerson.y
		)
	}

	isSpaceTaken(currentX, currentY, direction) {
		const { x, y } = utils.nextPosition(currentX, currentY, direction);
		return this.walls[`${x},${y}`] || false;
	}

	mountObjects() {
		Object.keys(this.gameObjects).forEach(key => {

			let object = this.gameObjects[key];
			object.id = key;

			//TODO: determine if this object should actually mount
			object.mount(this);

		})
	}



	async startCutscene(events) {
		this.isCutscenePlaying = true;

		this.removeCutsceneSpace(events)

		this.addCutsceneSpace(events)

		this.addObjects(events)

		// console.log("events[0]",events[0])
		// if(events[0]){
		// 	console.log("events[0]",events[0].functions[0])
		// 	events[0].functions[0]()
		// 	// this[events[0].functions[0]]()
		// }

		// get the item list of the hero
		const hero = this.gameObjects["hero"];

		console.log("hero.items", hero.storage)
		// renew the cutsceneSpaces
		this.cutsceneSpaces = window.OverworldMaps[this.location].cutsceneSpaces

		for (let i = 0; i < events.length; i++) {



			var triggable = true

			triggable = this.checkEventTriggable(events[i].haveItems, hero.storage)
			console.log("hero.storage", hero.storage)
			console.log("triggable", triggable)

			// if the event is not one time event or the one time event is not triggered
			if (!this.oneTimeTriggered(events[i]) && triggable) {
				// console.log("handlevent",events[i])
				// push all the item in the itemList to the user storage
				if (events[i].addItems) {
					const itemsList = events[i].addItems
					for (let j = 0; j < itemsList.length; j++) {
						hero.storage.push(itemsList[j])

					}
				}


				const eventHandler = new OverworldEvent({
					event: events[i],
					map: this,
				})
				await eventHandler.init();


				// if the events is a one time events,
				//  then will we do the fellowing part
				// we will check all the event inside the cutscense space
				// if we find the same event, then we will change the value in oneTime
				this.oneTimeEventRenew(events, i)

				// if the events is a one time events and under a Person
				//  then will we do the fellowing part
				// we will check all the event inside the Person
				// if we find the same event, then we will change the value in oneTimePerson
				this.oneTimePersonEventRenew(events, i)


				this.removeObjects(events[i])

			}





		}

		this.isCutscenePlaying = false;

		//Reset NPCs to do their idle behavior
		Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
	}

	checkEventTriggable(eventHaveItems, heroStorage) {
		if (eventHaveItems) {
			const storage = heroStorage.sort()
			const eventItemsList = eventHaveItems.sort()

			console.log("dddf",storage)
			console.log("dddf",eventItemsList)

<<<<<<< HEAD
			// console.log("result",triggable)
=======
>>>>>>> 075b14271d75a47e6251a517e4dd62e1782231cd
			const triggable = eventItemsList.every(val => storage.includes(val)) &&
				storage.every(val => eventItemsList.includes(val));
			console.log("result",triggable)

			return triggable
		}
		return true
	}

	checkForActionCutscene() {
		const hero = this.gameObjects["hero"];
		const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
		const match = Object.values(this.gameObjects).find(object => {
			return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
		});
		console.log("checking", match)
		if (!this.isCutscenePlaying && match && match.talking.length) {

			this.startCutscene(match.talking[0].events)
		}
	}

	checkForFootstepCutscene() {
		const hero = this.gameObjects["hero"];
		const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
		if (!this.isCutscenePlaying && match) {
			this.startCutscene(match[0].events)

		}


	}

	// delete the cutscene
	removeCutsceneSpace(events) {
		for (let i = 0; i < events.length; i++) {

			if (this.oneTimeTriggered(events[i])) {
				// this means the event is triggered and cannot be triggered again
				// skip
			} else if (("removeCutscene" in events[i])) {
				const cutsceneSpacesKeys = events[i]["removeCutscene"]
				// the value of "removeCutscene" must be the list of coordinate of the cutsceneSpaces
				// because we use the coordinate as the key
				cutsceneSpacesKeys.forEach(
					keys => {
						delete window.OverworldMaps[this.location].cutsceneSpaces[keys]

					}
				)

			}
		}
	}


	// delete the object
	// removeObjects(events) {
	// 	console.log("window.OverworldMaps[this.location]", window.OverworldMaps[this.location])

	// 	for (let i = 0; i < events.length; i++) {

	// 		if (this.oneTimeTriggered(events[i])) {
	// 			// this means the event is triggered and cannot be triggered again
	// 			// skip
	// 		} else if (("removeObjects" in events[i])) {
	// 			const hero = this.gameObjects["hero"];
	// 			var triggable = true

	// 			triggable = this.checkEventTriggable(events[i].haveItems, hero.storage)

	// 			if (triggable) {
	// 				const targetObjectKeys = events[i]["removeObjects"]
	// 				// the value of "remove" must be the list of coordinate of the cutsceneSpaces
	// 				// because we use the coordinate as the key
	// 				targetObjectKeys.forEach(
	// 					keys => {
	// 						try {
	// 							const removeX = window.OverworldMaps[this.location].gameObjects[keys].x
	// 							const removeY = window.OverworldMaps[this.location].gameObjects[keys].y
	// 							delete window.OverworldMaps[this.location].walls[`${removeX},${removeY}`]
	// 							delete window.OverworldMaps[this.location].gameObjects[keys]
	// 						} catch {

	// 						}


	// 					}
	// 				)
	// 			}

	// 		}
	// 	}
	// }
	removeObjects(event) {
		if ("removeObjects" in event){
			const targetObjectKeys = event["removeObjects"]
			// the value of "remove" must be the list of coordinate of the cutsceneSpaces
			// because we use the coordinate as the key
			targetObjectKeys.forEach(
				keys => {
					try {
						const removeX = window.OverworldMaps[this.location].gameObjects[keys].x
						const removeY = window.OverworldMaps[this.location].gameObjects[keys].y
						delete window.OverworldMaps[this.location].walls[`${removeX},${removeY}`]
						delete window.OverworldMaps[this.location].gameObjects[keys]
					} catch {

					}


				}
			)

		}
	}

	// Add trigger cutscenespace to the current cutscenespace
	addCutsceneSpace(events) {
		// Add trigger cutscenespace to the current cutscenespace
		for (let i = 0; i < events.length; i++) {

			if (this.oneTimeTriggered(events[i])) {
				// this means the event is triggered and cannot be triggered again
				// skip

			} else if (("addCutscene" in events[i])) {
				const triggerName = events[i]["addCutscene"]
				const newCutsceneSpaces = window.OverworldMaps.AddableCutscenes[triggerName]
				window.OverworldMaps[this.location].cutsceneSpaces =
					{ ...window.OverworldMaps[this.location].cutsceneSpaces, ...newCutsceneSpaces }

			}

		}
	}


	// Add trigger cutscenespace to the current cutscenespace
	addObjects(events) {
		// Add trigger cutscenespace to the current cutscenespace
		for (let i = 0; i < events.length; i++) {

			if (this.oneTimeTriggered(events[i])) {
				// this means the event is triggered and cannot be triggered again
				// skip

			} else if (("addObjects" in events[i])) {

				const targetObjectKeys = events[i]["addObjects"]
				targetObjectKeys.forEach(
					key => {
						const newObject = window.OverworldMaps.AddableObjects[key]

						console.log("newObjects", newObject)
						newObject[key]['id'] = key
						console.log("newObjects", newObject)
						window.OverworldMaps[this.location].gameObjects =
							{ ...window.OverworldMaps[this.location].gameObjects, ...newObject }
					}
				)
				console.log("window.OverworldMaps[this.location]", window.OverworldMaps[this.location])

				this.gameObjects = window.OverworldMaps[this.location].gameObjects
				this.mountObjects()


			}

		}
	}




	// if the events is a one time events,
	//  then will we do the fellowing part
	// we will check all the event inside the cutscense space
	// if we find the same event, then we will change the value in oneTime
	// this event is used to renew the one time parameter
	oneTimeEventRenew(events, i) {
		if (events[i].oneTime > 0) {
			console.log("window.OverworldMaps.Lab", window.OverworldMaps[this.location])

			const hero = this.gameObjects["hero"];
			var cutsceneEvent = window.OverworldMaps[this.location].cutsceneSpaces[`${hero.x},${hero.y}`][0].events
			console.log("cutsceneEvent", cutsceneEvent)


			if (cutsceneEvent[i] == events[i]) {
				window.OverworldMaps[this.location].cutsceneSpaces[`${hero.x},${hero.y}`][0].events[i].oneTime = 0
				console.log("changed", window.OverworldMaps[this.location].cutsceneSpaces[`${hero.x},${hero.y}`][0].events[i])
			}

		}
	}

	// if the events is a one time events and under a Person
	//  then will we do the fellowing part
	// we will check all the event inside the Person
	// if we find the same event, then we will change the value in oneTimePerson
	// this event is used to renew the one time parameter in person
	oneTimePersonEventRenew(events, i) {

		if (events[i].oneTimePerson > 0) {
			console.log("triggered", events[i].oneTimePerson)
			const hero = this.gameObjects["hero"];
			const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
			const match = Object.values(this.gameObjects).find(object => {
				return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
			});


			if (match.talking[0].events[i] == events[i]) {
				match.talking[0].events[i].oneTimePerson = 0
			}

		}
	}


	oneTimeTriggered(event) {
		if (
			(event.oneTime > 0 || !("oneTime" in event)) &&
			(event.oneTimePerson > 0 || !("oneTimePerson" in event))
		) {
			return false
		} else {
			return true
		}

	}



	addWall(x, y) {
		this.walls[`${x},${y}`] = true;
	}
	removeWall(x, y) {
		delete this.walls[`${x},${y}`]
	}
	moveWall(wasX, wasY, direction) {
		this.removeWall(wasX, wasY);
		const { x, y } = utils.nextPosition(wasX, wasY, direction);
		this.addWall(x, y);
	}



}

function play() {
	console.log("playing")
}







const tutorialEvents = {
	events: [

		{ type: "textMessage", text: "you forgot something" },
		{ who: "hero", type: "walk", direction: "right" },

	]
}

const fightEvents = {
	events: [

		{ type: "battle" }

	]
}

const moveToLevel2 = {
	events: [

		{ type: "changeMap", map: "DemoRoom"}

	]
}


const firstFightEvents = {
	events: [
		{ type: "textMessage", text: "AHHH! " },
		{ type: "textMessage", text: "WHAT ARE YOU?!? " },
		{ type: "textMessage", text: "Master?!?  " },
		{ type: "textMessage", text: "GET AWAY FROM ME! " },

		{ type: "battle" },

		{ type: "textMessage", text: "I need to get to the car. ",
		removeCutscene: [
			utils.asGridCoord(31, 11),
			utils.asGridCoord(31, 12),
			utils.asGridCoord(31, 13),
			utils.asGridCoord(31, 14),
			utils.asGridCoord(31, 15),


		]},


	]
}

const whiteBoardEvents = {
	events: [

		{
			type: "textMessage", text: "Whiteboard text:\n  • We are not alone.\n  • Hurry.\n  • PW = 796f6d717a\n    - Alex   ",
		 haveItems: ["nitrideAcid", "hydrochloricAcid"]
		},
		{ type: "textMessage", text: "“We”? Alex? Was he here before? But…", haveItems: ["nitrideAcid", "hydrochloricAcid"] },
		{ type: "textMessage", text: "He can’t have been. I’ve been here since it went wrong… ", haveItems: ["nitrideAcid", "hydrochloricAcid"] },
		{ type: "textMessage", text: "Hm… ", haveItems: ["nitrideAcid", "hydrochloricAcid"] },
		{ type: "textMessage", text: "What about if this is a trap? ", haveItems: ["nitrideAcid", "hydrochloricAcid"] },
		{ type: "textMessage", text: "… ", haveItems: ["nitrideAcid", "hydrochloricAcid"] },
		{
			type: "textMessage", text: "I still need to escape somehow before this “master” gets to me first. ",
			 oneTimePerson: 1, haveItems: ["nitrideAcid", "hydrochloricAcid"], 
			addItems: ["password"], removeObjects:["whiteBoard1","whiteBoard2","whiteBoard3","whiteBoard4"]
		},


	],
}

const quantumMachineEvents = {
		events: [

			{ type: "textMessage", text: "It’s…it’s wrecked. " },
			{ type: "textMessage", text: "Oh no… oh god… " },
			{ type: "textMessage", text: "What have I done? " },
			{ type: "textMessage", text: "I need to tell Alex. This CANNOT get out. " },
			{ type: "textMessage", text: "… " },
			{ type: "textMessage", text: "I must have left it in the car. " },
			{
				type: "textMessage", text: "There’s smashed glass in the way, I need to pick it up before I really hurt myself. ", addCutscene: "firstBattle",
				 removeObjects: ["quantumMachine1", "quantumMachine2", "quantumMachine3","quantumMachine4", "quantumMachine5", "quantumMachine6"]
				//  removeObjects: ["quantumMachine1"]
			},

		],
}

const doorEvents = {
	events: [

		{ type: "textMessage", text: "*The door panel appears to be jammed with some strange dark substance* ", haveItems: [] },
		{ type: "textMessage", text: "Huh? ", haveItems: [] },
		{ type: "textMessage", text: "The panel keys are jammed…?! ", haveItems: [] },
		{ type: "textMessage", text: "*The acid is poured over the keys*", haveItems: ["hydrochloricAcid"] },
		{ type: "textMessage", text: "*The acid seems to have no effect on the substance*", haveItems: ["hydrochloricAcid"] },
		{ type: "textMessage", text: "What is this stuff?", haveItems: ["hydrochloricAcid"] },
		{ type: "textMessage", text: "*The superacid is poured over the keys*", haveItems: ["nitrideAcid", "hydrochloricAcid"] },
		{ type: "textMessage", text: "*The dark substance dissolves away on contact with the acid*", haveItems: ["nitrideAcid", "hydrochloricAcid"] },
		{ type: "textMessage", text: "Finally!", haveItems: ["nitrideAcid", "hydrochloricAcid"] },
		{ type: "textMessage", text: "…", haveItems: ["nitrideAcid", "hydrochloricAcid"] },
		{ type: "textMessage", text: "Huh?", haveItems: ["nitrideAcid", "hydrochloricAcid"] },
		{ type: "textMessage", text: "The passcode isn’t working?!", haveItems: ["nitrideAcid", "hydrochloricAcid"] },
		{ type: "textMessage", text: "…", haveItems: ["nitrideAcid", "hydrochloricAcid", "password"] },
		{ type: "textMessage", text: "It worked.", haveItems: ["nitrideAcid", "hydrochloricAcid", "password"], 
		removeObjects: ["door1", "door2", "door3","door4", "door5", "door6"],addCutscene:"moveToLevel2" },





	]
}




window.OverworldMaps = {
	Title:{
		location: "Title",
		lowerSrc: "",
		upperSrc: "/IMG/title/newTitle.png",
		gameObjects: {
			hero: new Person({
				isPlayerControlled: true,
				x: utils.withGrid(10.5),
				y: utils.withGrid(6),
				src: "/IMG/characters/people/hero.png",
			})
		}
	},
	Lab: {
		location: "Lab",
		lowerSrc: "/IMG/maps/biggerRoom.png",
		upperSrc: "",
		gameObjects: {
			hero: new Person({
				isPlayerControlled: true,
				x: utils.withGrid(65),
				y: utils.withGrid(9),
				src: "/IMG/characters/people/hero.png",
			}),
			hydrochloricAcid: new Person({
				x: utils.withGrid(34),
				y: utils.withGrid(4),
				src: "",
				talking: [
					{
						events: [
							{ type: "textMessage", text: "*Hydrochloric acid picked up!*", oneTimePerson: 1 },
							{
								type: "textMessage", text: "*shakes head* I told Alex to put this in the fume hood.", faceHero: "hydrochloricAcid",
								removeCutscene: [
									utils.asGridCoord(31, 11),
									utils.asGridCoord(31, 12),
									utils.asGridCoord(31, 13),
									utils.asGridCoord(31, 14),
									utils.asGridCoord(31, 15),
								],
								// addCutscene:"battle",
								addItems: ["hydrochloricAcid"],
								oneTimePerson: 1
							},
						],
					}
				]
			}),
			nitrideAcid: new Person({
				x: utils.withGrid(0),
				y: utils.withGrid(8),
				src: "",
				talking: [
					{
						events: [

							{
								type: "textMessage", text: "*Nitric acid picked up!* ",
								faceHero: "nitrideAcid", oneTimePerson: 1, addItems: ["nitrideAcid"]
							},
						],
					}
				]
			}),

			quantumMachine1: new Person({
				x: utils.withGrid(50),
				y: utils.withGrid(11),
				src: "",
				talking: [
					quantumMachineEvents
				]
			}),
			quantumMachine2: new Person({
				x: utils.withGrid(51),
				y: utils.withGrid(11),
				src: "",
				talking: [
					quantumMachineEvents
				]
			}),
			quantumMachine3: new Person({
				x: utils.withGrid(52),
				y: utils.withGrid(11),
				src: "",
				talking: [
					quantumMachineEvents
				]
			}),
			quantumMachine4: new Person({
				x: utils.withGrid(53),
				y: utils.withGrid(11),
				src: "",
				talking: [
					quantumMachineEvents
				]
			}),


			whiteBoard1: new Person({
				x: utils.withGrid(64),
				y: utils.withGrid(3),
				src: "",
				talking: [
					whiteBoardEvents
				]
			}),
			whiteBoard2: new Person({
				x: utils.withGrid(65),
				y: utils.withGrid(3),
				src: "",
				talking: [
					whiteBoardEvents
				]
			}),
			whiteBoard3: new Person({
				x: utils.withGrid(66),
				y: utils.withGrid(3),
				src: "",
				talking: [
					whiteBoardEvents
				]
			}),
			whiteBoard4: new Person({
				x: utils.withGrid(67),
				y: utils.withGrid(3),
				src: "",
				talking: [
					whiteBoardEvents
				]
			}),

			door1: new Person({
				x: utils.withGrid(21),
				y: utils.withGrid(31),
				src: "/IMG/characters/people/hero.png",
				talking: [
					doorEvents
				]
			}),
			door2: new Person({
				x: utils.withGrid(22),
				y: utils.withGrid(31),
				src: "/IMG/characters/people/hero.png",
				talking: [
					doorEvents
				]
			}),
			door3: new Person({
				x: utils.withGrid(23),
				y: utils.withGrid(31),
				src: "/IMG/characters/people/hero.png",
				talking: [
					doorEvents
				]
			}),
			door4: new Person({
				x: utils.withGrid(24),
				y: utils.withGrid(31),
				src: "/IMG/characters/people/hero.png",
				talking: [
					doorEvents
				]
			}),
			door5: new Person({
				x: utils.withGrid(25),
				y: utils.withGrid(31),
				src: "/IMG/characters/people/hero.png",
				talking: [
					doorEvents
				]
			}),
			door6: new Person({
				x: utils.withGrid(26),
				y: utils.withGrid(31),
				src: "/IMG/characters/people/hero.png",
				talking: [
					doorEvents
				]
			}),
		},

		cutsceneSpaces: {

			// [utils.asGridCoord(6, 10)]: [
			// 	{
			// 		events: [
			// 			{ type: "textMessage", text: "Testando", oneTime:1 },
			// 			{ type: "textMessage", text: "how my god", oneTime:1 },


			// 		]
			// 	}
			// ],

			[utils.asGridCoord(8, 8)]: [
				{
					events: [
						{ type: "textMessage", text: "hahahahaha" },

						// { type: "textMessage", text: "hahahahaha", haveItems:["nitrideAcid"] },




					]
				}
			],
			[utils.asGridCoord(9, 9)]: [
				{
					events: [

						{ type: "textMessage", text: "eee" },

						{ type: "textMessage", text: "fffff", haveItems: ["nitrideAcid"] },




					]
				}
			],
			[utils.asGridCoord(0, 0)]: [
				{
					events: [
						{ type: "textMessage", text: "Testando", oneTime: 1 },
						{ type: "textMessage", text: "how my god", oneTime: 1 },


					]
				}
			],
			[utils.asGridCoord(7, 10)]: [
				{
					events: [

						{ type: "textMessage", text: "Você não pode entrar aqui!" },

						{ who: "hero", type: "walk", direction: "down" },
						{ who: "hero", type: "walk", direction: "left", removeCutscene: [utils.asGridCoord(10, 10)] },
					],

				}
			],

		},
<<<<<<< HEAD
		
=======
>>>>>>> 075b14271d75a47e6251a517e4dd62e1782231cd
		// walls
		walls: {
			// chestofdrawers: 
			[utils.asGridCoord(-1, 5)]: true,
			[utils.asGridCoord(-1, 6)]: true,
			[utils.asGridCoord(-1, 7)]: true,
			[utils.asGridCoord(-1, 8)]: true,
			[utils.asGridCoord(0, 5)]: true,
			[utils.asGridCoord(0, 6)]: true,
			[utils.asGridCoord(0, 7)]: true,
			[utils.asGridCoord(0, 8)]: true,

			// holesinground: 
			[utils.asGridCoord(17, 8)]: true,
			[utils.asGridCoord(18, 8)]: true,
			[utils.asGridCoord(17, 9)]: true,
			[utils.asGridCoord(18, 9)]: true,
			[utils.asGridCoord(-1, 27)]: true,
			[utils.asGridCoord(-1, 28)]: true,
			[utils.asGridCoord(-1, 29)]: true,
			[utils.asGridCoord(-1, 30)]: true,
			[utils.asGridCoord(0, 27)]: true,
			[utils.asGridCoord(0, 28)]: true,
			[utils.asGridCoord(0, 29)]: true,
			[utils.asGridCoord(0, 30)]: true,
			[utils.asGridCoord(43, 10)]: true,
			[utils.asGridCoord(43, 11)]: true,
			[utils.asGridCoord(43, 12)]: true,
			[utils.asGridCoord(44, 9)]: true,
			[utils.asGridCoord(44, 10)]: true,
			[utils.asGridCoord(44, 11)]: true,
			[utils.asGridCoord(44, 12)]: true,
			[utils.asGridCoord(45, 9)]: true,
			[utils.asGridCoord(45, 10)]: true,
			[utils.asGridCoord(45, 11)]: true,
			[utils.asGridCoord(45, 12)]: true,
			[utils.asGridCoord(46, 9)]: true,
			[utils.asGridCoord(46, 10)]: true,
			[utils.asGridCoord(46, 11)]: true,
			[utils.asGridCoord(46, 12)]: true,
			[utils.asGridCoord(49, 8)]: true,
			[utils.asGridCoord(50, 7)]: true,
			[utils.asGridCoord(50, 8)]: true,
			[utils.asGridCoord(51, 7)]: true,
			[utils.asGridCoord(51, 8)]: true,
			[utils.asGridCoord(52, 7)]: true,
			[utils.asGridCoord(52, 8)]: true,
			[utils.asGridCoord(52, 7)]: true,
			[utils.asGridCoord(52, 8)]: true,
			[utils.asGridCoord(53, 7)]: true,
			[utils.asGridCoord(53, 8)]: true,
			[utils.asGridCoord(54, 8)]: true,
			[utils.asGridCoord(47, 13)]: true,
			[utils.asGridCoord(47, 14)]: true,
			[utils.asGridCoord(48, 13)]: true,
			[utils.asGridCoord(48, 14)]: true,
			[utils.asGridCoord(57, 9)]: true,
			[utils.asGridCoord(58, 9)]: true,
			[utils.asGridCoord(57, 10)]: true,
			[utils.asGridCoord(57, 11)]: true,
			[utils.asGridCoord(57, 12)]: true,
			[utils.asGridCoord(58, 10)]: true,
			[utils.asGridCoord(58, 11)]: true,
			[utils.asGridCoord(58, 12)]: true,

			// lockers:
			[utils.asGridCoord(9, 5)]: true,
			[utils.asGridCoord(9, 6)]: true,
			[utils.asGridCoord(9, 7)]: true,
			[utils.asGridCoord(9, 8)]: true,
			[utils.asGridCoord(10, 5)]: true,
			[utils.asGridCoord(10, 6)]: true,
			[utils.asGridCoord(10, 7)]: true,
			[utils.asGridCoord(10, 8)]: true,
			[utils.asGridCoord(11, 5)]: true,
			[utils.asGridCoord(11, 6)]: true,
			[utils.asGridCoord(11, 7)]: true,
			[utils.asGridCoord(11, 8)]: true,
			[utils.asGridCoord(12, 5)]: true,
			[utils.asGridCoord(12, 6)]: true,
			[utils.asGridCoord(12, 7)]: true,
			[utils.asGridCoord(12, 8)]: true,

			// middlewalls: 
			[utils.asGridCoord(19, 13)]: true,
			[utils.asGridCoord(19, 14)]: true,
			[utils.asGridCoord(19, 15)]: true,
			[utils.asGridCoord(19, 16)]: true,
			[utils.asGridCoord(19, 17)]: true,
			[utils.asGridCoord(19, 18)]: true,
			[utils.asGridCoord(19, 20)]: true,
			[utils.asGridCoord(19, 21)]: true,
			[utils.asGridCoord(19, 22)]: true,
			[utils.asGridCoord(19, 23)]: true,
			[utils.asGridCoord(19, 24)]: true,
			[utils.asGridCoord(20, 24)]: true,
			[utils.asGridCoord(21, 24)]: true,
			[utils.asGridCoord(22, 24)]: true,
			[utils.asGridCoord(22, 23)]: true,
			[utils.asGridCoord(22, 22)]: true,
			[utils.asGridCoord(22, 21)]: true,
			[utils.asGridCoord(22, 20)]: true,
			[utils.asGridCoord(22, 19)]: true,
			[utils.asGridCoord(22, 18)]: true,
			[utils.asGridCoord(22, 17)]: true,
			[utils.asGridCoord(22, 16)]: true,
			[utils.asGridCoord(22, 15)]: true,
			[utils.asGridCoord(22, 14)]: true,
			[utils.asGridCoord(22, 13)]: true,
			[utils.asGridCoord(21, 13)]: true,
			[utils.asGridCoord(20, 13)]: true,

			// columns: 
			[utils.asGridCoord(27, 5)]: true,
			[utils.asGridCoord(27, 6)]: true,
			[utils.asGridCoord(28, 6)]: true,
			[utils.asGridCoord(28, 5)]: true,
			
			// acidonbench:
			[utils.asGridCoord(34, 4)]: true,
			[utils.asGridCoord(34, 3)]: true,

			// bench: 
			[utils.asGridCoord(33, 10)]: true,
			[utils.asGridCoord(34, 10)]: true,
			[utils.asGridCoord(34, 9)]: true,
			[utils.asGridCoord(34, 8)]: true,
			[utils.asGridCoord(34, 7)]: true,
			[utils.asGridCoord(34, 6)]: true,
			[utils.asGridCoord(34, 5)]: true,
			[utils.asGridCoord(34, 4)]: true,
			[utils.asGridCoord(34, 3)]: true,
			[utils.asGridCoord(34, 2)]: true,
			[utils.asGridCoord(34, 1)]: true,
			[utils.asGridCoord(34, 0)]: true,
			[utils.asGridCoord(35, 0)]: true,
			[utils.asGridCoord(36, 0)]: true,
			[utils.asGridCoord(37, 0)]: true,
			[utils.asGridCoord(38, 0)]: true,
			[utils.asGridCoord(39, 0)]: true,
			[utils.asGridCoord(40, 0)]: true,
			[utils.asGridCoord(41, 0)]: true,
			[utils.asGridCoord(42, 0)]: true,
			[utils.asGridCoord(43, 0)]: true,
			[utils.asGridCoord(44, 0)]: true,
			[utils.asGridCoord(45, 0)]: true,
			[utils.asGridCoord(46, 0)]: true,
			[utils.asGridCoord(47, 0)]: true,
			[utils.asGridCoord(48, 0)]: true,
			[utils.asGridCoord(49, 0)]: true,
			[utils.asGridCoord(50, 0)]: true,
			[utils.asGridCoord(51, 0)]: true,
			[utils.asGridCoord(52, 0)]: true,
			[utils.asGridCoord(53, 0)]: true,
			[utils.asGridCoord(54, 0)]: true,
			[utils.asGridCoord(55, 0)]: true,
			[utils.asGridCoord(56, 0)]: true,
			[utils.asGridCoord(57, 0)]: true,
			[utils.asGridCoord(58, 0)]: true,
			[utils.asGridCoord(59, 0)]: true,
			[utils.asGridCoord(77, 1)]: true,
			[utils.asGridCoord(77, 2)]: true,
			[utils.asGridCoord(77, 3)]: true,
			[utils.asGridCoord(77, 4)]: true,
			[utils.asGridCoord(77, 5)]: true,
			[utils.asGridCoord(77, 6)]: true,
			[utils.asGridCoord(77, 7)]: true,
			[utils.asGridCoord(77, 8)]: true,
			[utils.asGridCoord(77, 9)]: true,
			[utils.asGridCoord(77, 10)]: true,
			[utils.asGridCoord(78, 10)]: true,

			// quantummachine:
			[utils.asGridCoord(47, 12)]: true,
			[utils.asGridCoord(48, 12)]: true,
			[utils.asGridCoord(49, 12)]: true,
<<<<<<< HEAD
			[utils.asGridCoord(50, 12)]: true,
			[utils.asGridCoord(51, 12)]: true,
			[utils.asGridCoord(52, 12)]: true,
			[utils.asGridCoord(53, 12)]: true,
=======
			// [utils.asGridCoord(50, 12)]: true,
			// [utils.asGridCoord(51, 12)]: true,
			// [utils.asGridCoord(52, 12)]: true,
			// [utils.asGridCoord(53, 12)]: true,
>>>>>>> 075b14271d75a47e6251a517e4dd62e1782231cd
			[utils.asGridCoord(54, 12)]: true,
			[utils.asGridCoord(55, 12)]: true,
			[utils.asGridCoord(56, 12)]: true,
			[utils.asGridCoord(47, 11)]: true,
			[utils.asGridCoord(48, 11)]: true,
			[utils.asGridCoord(49, 11)]: true,
			[utils.asGridCoord(50, 11)]: true,
			[utils.asGridCoord(51, 11)]: true,
			[utils.asGridCoord(52, 11)]: true,
			[utils.asGridCoord(53, 11)]: true,
			[utils.asGridCoord(54, 11)]: true,
			[utils.asGridCoord(55, 11)]: true,
			[utils.asGridCoord(56, 11)]: true,
			[utils.asGridCoord(47, 10)]: true,
			[utils.asGridCoord(48, 10)]: true,
			[utils.asGridCoord(49, 10)]: true,
			[utils.asGridCoord(50, 10)]: true,
			[utils.asGridCoord(51, 10)]: true,
			[utils.asGridCoord(52, 10)]: true,
			[utils.asGridCoord(53, 10)]: true,
			[utils.asGridCoord(54, 10)]: true,
			[utils.asGridCoord(55, 10)]: true,
			[utils.asGridCoord(56, 10)]: true,
			[utils.asGridCoord(47, 9)]: true,
			[utils.asGridCoord(48, 9)]: true,
			[utils.asGridCoord(49, 9)]: true,
			[utils.asGridCoord(50, 9)]: true,
			[utils.asGridCoord(51, 9)]: true,
			[utils.asGridCoord(52, 9)]: true,
			[utils.asGridCoord(53, 9)]: true,
			[utils.asGridCoord(54, 9)]: true,
			[utils.asGridCoord(55, 9)]: true,
			[utils.asGridCoord(56, 9)]: true,
			
			// whiteboard:
<<<<<<< HEAD
			[utils.asGridCoord(63, 3)]: true,
			[utils.asGridCoord(64, 3)]: true,
			[utils.asGridCoord(65, 3)]: true,
			[utils.asGridCoord(66, 3)]: true,
			[utils.asGridCoord(63, 2)]: true,
			[utils.asGridCoord(64, 2)]: true,
			[utils.asGridCoord(65, 2)]: true,
			[utils.asGridCoord(66, 2)]: true,
			[utils.asGridCoord(63, 1)]: true,
			[utils.asGridCoord(64, 1)]: true,
			[utils.asGridCoord(65, 1)]: true,
			[utils.asGridCoord(66, 1)]: true,
=======
			[utils.asGridCoord(64, 3)]: true,
			[utils.asGridCoord(65, 3)]: true,
			[utils.asGridCoord(66, 3)]: true,
			[utils.asGridCoord(67, 3)]: true,
			[utils.asGridCoord(64, 2)]: true,
			[utils.asGridCoord(65, 2)]: true,
			[utils.asGridCoord(66, 2)]: true,
			[utils.asGridCoord(67, 2)]: true,
			[utils.asGridCoord(64, 1)]: true,
			[utils.asGridCoord(65, 1)]: true,
			[utils.asGridCoord(66, 1)]: true,
			[utils.asGridCoord(67, 1)]: true,
>>>>>>> 075b14271d75a47e6251a517e4dd62e1782231cd

			// place_test_tube_at: 
			[utils.asGridCoord(37, 5)]: true,

			// maindoor: 
<<<<<<< HEAD
			[utils.asGridCoord(21, 31)]: true,
			[utils.asGridCoord(22, 31)]: true,
			[utils.asGridCoord(23, 31)]: true,
			[utils.asGridCoord(24, 31)]: true,
			[utils.asGridCoord(25, 31)]: true,
			[utils.asGridCoord(26, 31)]: true,
=======
			// [utils.asGridCoord(21, 31)]: true,
			// [utils.asGridCoord(22, 31)]: true,
			// [utils.asGridCoord(23, 31)]: true,
			// [utils.asGridCoord(24, 31)]: true,
			// [utils.asGridCoord(25, 31)]: true,
			// [utils.asGridCoord(26, 31)]: true,
>>>>>>> 075b14271d75a47e6251a517e4dd62e1782231cd

			// bins:
			[utils.asGridCoord(75, 1)]: true,
			[utils.asGridCoord(75, 2)]: true,
			[utils.asGridCoord(76, 1)]: true,
			[utils.asGridCoord(76, 2)]: true,
			[utils.asGridCoord(33, 35)]: true,
			[utils.asGridCoord(34, 35)]: true,
			[utils.asGridCoord(33, 36)]: true,
			[utils.asGridCoord(34, 36)]: true,
		  }
<<<<<<< HEAD
=======

>>>>>>> 075b14271d75a47e6251a517e4dd62e1782231cd
	},
	AddableCutscenes: {
		tutorial: {
			[utils.asGridCoord(31, 11)]: [
				tutorialEvents
			],
			[utils.asGridCoord(31, 12)]: [
				tutorialEvents
			],
			[utils.asGridCoord(31, 13)]: [
				tutorialEvents
			],
			[utils.asGridCoord(31, 14)]: [
				tutorialEvents
			],
			[utils.asGridCoord(31, 15)]: [
				tutorialEvents
			],
		},
		battle: {
			[utils.asGridCoord(31, 11)]: [
				fightEvents
			],
			[utils.asGridCoord(31, 12)]: [
				fightEvents
			],
			[utils.asGridCoord(31, 13)]: [
				fightEvents
			],
			[utils.asGridCoord(31, 14)]: [
				fightEvents
			],
			[utils.asGridCoord(31, 15)]: [
				fightEvents
			],
		},
		firstBattle: {
			[utils.asGridCoord(31, 11)]: [
				firstFightEvents
			],
			[utils.asGridCoord(31, 12)]: [
				firstFightEvents
			],
			[utils.asGridCoord(31, 13)]: [
				firstFightEvents
			],
			[utils.asGridCoord(31, 14)]: [
				firstFightEvents
			],
			[utils.asGridCoord(31, 15)]: [
				firstFightEvents
			],
		},
		        
		moveToLevel2: {
			[utils.asGridCoord(21, 32)]: [
				moveToLevel2
			],
			[utils.asGridCoord(22, 32)]: [
				moveToLevel2
			],
			[utils.asGridCoord(23, 32)]: [
				moveToLevel2
			],
			[utils.asGridCoord(24, 32)]: [
				moveToLevel2
			],
			[utils.asGridCoord(25, 32)]: [
				moveToLevel2
			],
		},

	},
	AddableObjects: {
		door2: {
			door2: new Person({
				x: utils.withGrid(10),
				y: utils.withGrid(9),
				src: "/IMG/characters/people/hero.png",
				talking: [
					doorEvents
				]
			}),
		}

	}
}