window.Actions = {
	damage1: {
		name: "Whomp!",
		description: "normal attack (80%)",
		success: [
			{ type: "textMessage", text: "{CASTER} uses {ACTION}!" },
			{ type: "animation", animation: "spin" },
			{ type: "stateChange", damage: 10, percentage:80,missedMessage:"cannot hit it" },
		]
	},
	damage2: {
		name: "Whomp!",
		description: "normal attack (50%)",
		success: [
			{ type: "textMessage", text: "{CASTER} uses {ACTION}!" },
			{ type: "animation", animation: "spin" },
			{ type: "stateChange", damage: 10, percentage:50,missedMessage:"cannot hit it" },
		]
	},
	saucyStatus: {
		name: "Sword",
		targetType: "friendly",
		description: "heal yourself (100%)",
		success: [
			{ type: "textMessage", text: "{CASTER} uses {ACTION}!" },
			{ type: "stateChange", status: { type: "saucy", expiresIn: 3 } }
		]
	},
	clumsyStatus: {
		name: "Test Tube",
		success: [
			{ type: "textMessage", text: "{CASTER} uses {ACTION}!" },
			{ type: "animation", animation: "glob", color: "#dafd2a" },
			{ type: "stateChange", status: { type: "clumsy", expiresIn: 3 } },
			{ type: "textMessage", text: "{TARGET} is slipping all around!" },
		]
	},

	// Items
	item_recoverStatus:{
		name: "Heating Lamp",
		description: "Feeling fresh and wram",
		targetType: "friendly",
		success: [
			{type:"textMessage", text:"{CASTER} uses a {ACTION}!"},
			{type:"stateChange", status:null},
			{ type: "textMessage", text: "Feeling fresh!" },
		]
	},
	item_recoverHp:{
		name: "Recover Hp",
		description: "Recover Hp",
		targetType: "friendly",
		success: [
			{type:"textMessage", text:"{CASTER} uses a {ACTION}!"},
			{type:"stateChange", recover: 10,},
			{ type: "textMessage", text: "{CASTER} reovers HP!" },
		]
	}
}