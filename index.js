var btn = document.getElementById('roll');
var diceNodes = document.querySelectorAll('.diceImg');
var playerIndicator = document.querySelector('.sidenav .player');

class Dice {
  static roll() {
    return Math.floor(Math.random() * 6) + 1
  }
  static rollTwo() {
    var a = Dice.roll()
    diceNodes[0].className = 'diceImg s'+a;
    var b = Dice.roll()
    diceNodes[1].className = 'diceImg s'+b;
    return [a, b];
  }
}

class Spielfigur {
  constructor(color, name) {
    this.name = name;
    this.color = color
    this.field = 1
  }

  playerOnField(field, player) {
    return player.some(p => p.field === field);
  }

  nextTurn(player) {
    var dices = Dice.rollTwo();
    var isPasch = dices[0] === dices[1];

    var from = this.field;
    var to = this.field + dices[0] + dices[1];
    var next = this.applyLaddersAndSnakes(to);
    while(this.playerOnField(next, player)) {
      console.log('Moved by one')
      next++;
      next = this.applyLaddersAndSnakes(next);
    }

    if (isPasch) {
      console.log(this.name, 'hat einen', dices[0], '\'er Pasch gewürfelt =>', to, next);
    }
    else {
      console.log(this.name, 'hat', dices[0], dices[1], 'gewürfelt =>', to, next);
    }


    if (to === 100) {
      this.moveTo(from, to, next);
      return false;
    }
    else if (to < 100) {
      this.moveTo(from, to, next);
    }
    return isPasch;
  }

  moveTo(from, to, next) {
    this.field = next;
    this.showUI(true);
    var node = document.querySelector(`.board .player.${this.color}`);
    var onFinish = () => {
      console.log('Move finished => ', this.field);
      this.showUI(false);
      node.style.transform = this.toPosition(next);
      if (next === 100) {
        alert(this.name + ' hat gewonnen');
      }
    };

    var positions = [];
    for(var i=from; i<= to; i++) {
      positions.push({ transform: this.toPosition(i) })
    }
    var move =  node.animate( positions, {
      easing: 'ease-in-out',
      duration: positions.length * 120,
      delay: 400
    });
    move.onfinish = () => {
      if (to !== next) {
        var toPos = this.toPosition(to);
        var nextPos = this.toPosition(next);
        node.style.transform = toPos;
        var secondMove = node.animate([
          { transform: toPos },
          { transform: nextPos }
        ],{
          easing: 'ease-in-out',
          duration: 600,
          delay: 300
        });
        secondMove.onfinish = () => onFinish()
      }
      else {
        onFinish()
      }
    }
  }

  toPosition(field) {
    var row = Math.ceil(field / 10);
    var col = Math.ceil((field - 1) % 10) + (row % 2 == 0 ? 1 : 0);
    if (row % 2 == 0) {
      col = 10 - col;
    }
    const x = (col) * 10
    const y = (10 - row) * 10
    return `translate(${x}vh, ${y}vh)`;
  }

  applyLaddersAndSnakes(field) {
    // ladder
    switch (field) {
      case 28: return 36;
      case 51: return 91;
      case 57: return 75;
      case 60: return 83;
      case 63: return 85;
      case 67: return 88;
      case 76: return 94;
      case 78: return 82;
    }

    // snake
    switch (field) {
      case 99: return 29;
      case 95: return 26;
      case 92: return 34;
      case 84: return 13;
      case 73: return 1;
      case 62: return 21;
      case 69: return 31;
      case 58: return 19;
      case 52: return 7;
      case 41: return 4;
      case 49: return 11;
      case 44: return 23;
    }
    return field;
  }

  showNode(nodes, show) {
    for (const node of nodes) {
      if (show) {
        node.classList.remove('hide')
      }
      else {
        node.classList.add('hide')
      }
    }
  }

  showUI(isMoving) {
    btn.disabled = isMoving;
    // this.showNode([playerIndicator], !isMoving);
    // this.showNode(diceNodes, isMoving);
  }

}


// meeple
var jessi = new Spielfigur('yellow', 'Jessica');
var papa = new Spielfigur('blue', 'Papa');
var mama = new Spielfigur('green', 'Mama');
var zoe = new Spielfigur('red', 'Zoe');
// var player = [zoe, jessi];
var player = [zoe, jessi, mama, papa];

let rolls = 0;
function roll() {
  var isPasch = player[rolls % player.length].nextTurn(player);
  if (!isPasch) {
    rolls++;
  }
  var nextPlayer = player[rolls % player.length];
  // playerIndicator.className = 'hide player '+ nextPlayer.color;
}
