class TurnCycle {
	constructor({ battle, onNewEvent }) {
		this.battle = battle;
		this.onNewEvent = onNewEvent;
		this.currentTeam = "player"; //or "enemy"
	}

	async turn() {
		//Get the caster
		const casterId = this.battle.activeCombatants[this.currentTeam];
		const caster = this.battle.combatants[casterId];
		const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"]
		const enemy = this.battle.combatants[enemyId];

		const submission = await this.onNewEvent({
			type: "submissionMenu",
			caster,
			enemy
		})



		if (submission.instanceId) {
			this.battle.items = this.battle.items.filter(i =>i.instanceId !== submission.instanceId);
		}

		const resultingEvents = caster.getReplacedEvents(submission.action.success);

		console.log("resultingEvents",resultingEvents)
		for (let i = 0; i < resultingEvents.length; i++) {
			const event = {
				...resultingEvents[i],
				submission,
				action: submission.action,
				caster,
				target: submission.target,
			}
			console.log("event",event)
			await this.onNewEvent(event);
		}

		//Check for post events
		//(Do things AFTER your original turn submission)
		const postEvents = caster.getPostEvents();
		for (let i = 0; i < postEvents.length; i++) {
			const event = {
				...postEvents[i],
				submission,
				action: submission.action,
				caster,
				target: submission.target,
			}
			await this.onNewEvent(event);
		}

		//Check for status expire
		const expiredEvent = caster.decrementStatus();
		if (expiredEvent) {
			await this.onNewEvent(expiredEvent)
		}

		this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
		
		// once the turn is finished, we will check 
		// the hp of the enemy (enemy can be the prof or the moster)
		// if the hp enemy is the monster and its hp is zero --> gameover
		if (enemy.hp > 0){
			await this.turn();
		}else{
			if (enemy.team == "enemy"){
				return
			} else{
				console.log("game over")
				return
			}
			
		}


		// console.log("caster",caster)

	}

	async init() {
		await this.onNewEvent({
			type: "textMessage",
			text: "The battle is starting!"
		})

		//Start the first turn!
		await this.turn();


	}

}