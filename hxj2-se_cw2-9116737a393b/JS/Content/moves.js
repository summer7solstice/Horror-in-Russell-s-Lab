window.MoveTypes = {
  normal: "normal",
  spicy: "spicy",
  veggie: "veggie",
  fungi: "fungi",
  chill: "chill",
}

window.Moves = {
  "s001": {
    name: "Prof",
    type: MoveTypes.spicy,
    src: "/IMG/characters/moves/s001.png",
    // src: null,
    icon: "/IMG/icons/spicy.png",
    // actions: [ "clumsyStatus", "damage1" ],
    actions: [ "damage1", "saucyStatus", "clumsyStatus"],
  },
  "v001": {
    name: "Enemy",
    type: MoveTypes.veggie,
    src: "/IMG/characters/moves/v001.png",
    // src: null,
    icon: "/IMG/icons/veggie.png",
    actions: [ "damage2" ],
  },
  
}