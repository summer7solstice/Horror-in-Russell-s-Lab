class Battle {
	constructor({onComplete }) {
		this.onComplete = onComplete
		this.combatants = {
			"player1": new Combatant({
				...Moves.s001,
				team: "player",
				hp: 30,
				maxHp: 50,
				xp: 100,
				maxXp: 100,
				level: 1,
				status: null,
				isPlayerControlled: true,
			}, this),
			"enemy1": new Combatant({
				...Moves.v001,
				team: "enemy",
				hp: 20,
				maxHp: 50,
				xp: 100,
				maxXp: 100,
				level: 1,
			}, this),
		}

		this.activeCombatants = {
			player: "player1",
			enemy: "enemy1",
		}

		this.items = [
			{
				actionId: "item_recoverStatus",
				instanceId: "p1",
				team: "player",
			},
			{
				actionId: "item_recoverStatus",
				instanceId: "p2",
				team: "player",
			},
			{
				actionId: "item_recoverHp",
				instanceId: "p3",
				team: "player",
			},
			{
				actionId: "item_recoverHp",
				instanceId: "p4",
				team: "player",
			},
			{
				actionId: "item_recoverHp",
				instanceId: "p5",
				team: "player",
			},
		]
	}

	createElement() {
		this.element = document.createElement("div");
		this.element.classList.add("Battle");
		this.element.innerHTML = (`
		<div class="Battle_hero">
		<img src="${'/IMG/characters/people/hero.png'}" alt="Hero" />
		</div>

		<div class="test_img">
		<img src=${'/IMG/characters/enemies/demon1_action1_new.png'} alt="Enemy" />
		</div>
    `)
	// <img src=${'/IMG/characters/people/npc3.png'} alt="Enemy" />
	// <img src=${'/IMG/characters/enemies/demon1_action1.png'} alt="Enemy" />
		// <div class="Battle_enemy">
		// <img src=${'/IMG/characters/people/npc4.png'} alt="Enemy" />
		// </div>

	}

	async init(container) {
		
		this.onComplete();

		this.createElement();
		container.appendChild(this.element);

		Object.keys(this.combatants).forEach(key => {
			let combatant = this.combatants[key];
			combatant.id = key;
			combatant.init(this.element)
		})


		this.turnCycle = new TurnCycle({
			battle: this,
			onNewEvent: event => {
				return new Promise(resolve => {
					const battleEvent = new BattleEvent(event, this)
					battleEvent.init(resolve);
				})
			}
		})
		await this.turnCycle.init();
		container.removeChild(this.element);
	}

}