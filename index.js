
const Presets = {
  width: window.innerWidth,
  height: window.innerHeight,
  paddedWidth: window.innerWidth - 100,
  paddedHeight: window.innerHeight - 100,
  padding: 50,
}

let game = new Phaser.Game(Presets.width, Presets.height, Phaser.AUTO, 'root', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('background', 'assets/meadow.png');
  game.load.image('backgroundclouds', 'assets/clouds.jpg');
  game.load.image('blue', 'assets/blue.jpeg');
  game.load.image('pink', 'assets/pink.png');

  game.load.image('barn', 'assets/items/barn.png');
  game.load.image('chicken', 'assets/items/chicken.png');
  game.load.image('coop', 'assets/items/coop.png');
  game.load.image('dog', 'assets/items/dog.png');
  game.load.image('girl', 'assets/items/girl.png');
  game.load.image('man', 'assets/items/man.png');
  game.load.image('sign', 'assets/items/sign.png');
  game.load.image('cat', 'assets/items/cat.png');
  game.load.image('cloud', 'assets/items/cloud.png');
  game.load.image('cow', 'assets/items/cow.png');
  game.load.image('donkey', 'assets/items/donkey.png');
  game.load.image('house', 'assets/items/house.png');
  game.load.image('sheep', 'assets/items/sheep.png');
  game.load.image('sun', 'assets/items/sun.png');

  game.load.audio('correct', 'assets/correct.mp3');
  game.load.audio('wrong', 'assets/wrong.mp3');
  game.load.audio('music', 'assets/music.ogg');

  game.load.audio('cheer', 'assets/cheer.mp3');
  game.load.audio('crack', 'assets/crack.mp3');
  game.load.audio('horn', 'assets/horn.mp3');
}

let frame = 0;

let text1, text2;
let descText1, descText2;

let items = [];

let scores = [0, 0];

let numberOfItems = 5;

let successMessages = [
  'Nice!',
  'Sweet!',
  'Good job!',
  'Well done!',
  'Cooool',
  'Excellent!',
  'Groovy!',
  'Brill!',
  'Amazeballs',
  'Unbelievable',
  'Godly!',
  'Too good!',
]

let failMessages = [
  'Oops!',
  'Ouch!',
  'Zing!',
  'Awful!',
  'Too bad',
  'Poor show',
  'Maybe next time',
  'Try harder!',
  'So sad',
  'Waaaah!',
  'So smelly',
  'Stinky!',
]

let games = [
  {
    name: 'same',
    description: 'Touch the thing in common',
    weight: 0.6,
  },
  {
    name: 'different',
    description: 'Touch the different thing',
    weight: 0.6,
  },
  {
    name: 'all',
    description: 'Touch everything',
    weight: 0.6,
  },
  {
    name: 'opponent',
    description: 'Touch your OPPONENT\'S ',
    weight: 0.4,
  },
  {
    name: 'time',
    description: 'Touch after 10 seconds',
    weight: 0.7,
  },
  {
    name: 'patience',
    description: 'Have patience!',
    weight: 0.7,
  },
  {
    name: 'describe',
    descriptions: {
      sky: 'Touch everything in the sky',
      living: 'Touch all living things',
      manmade: 'Touch all manmade things',
      natural: 'Touch all natural things',
      animal: 'Touch all animals',
      person: 'Touch all people',
      fourlegs: 'Touch everything with 4 legs',
      twolegs: 'Touch everything with 2 legs',
    },
    weight: 0.8,
  },
  {
    name: 'fire',
    description: 'Touch as quickly as you can',
    weight: 0.4,
  },
  {
    name: 'drag',
    description: 'Drag to your opponent\'s side',
    weight: 0.4,
  },
  // {
  //   name: 'draw',
  //   description: 'Fill your screen',
  //   weight: 0.4,
  // },
];

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function addScoreSection() {
  let dividerHeight = 120;

  let graphics = game.add.graphics(0, 0);
  graphics.lineStyle(10, 0x6CA7DA, 1);
  graphics.beginFill(0x7CA7DA, 1);
  graphics.alpha = 0.85;
  graphics.drawRect(0, Presets.height / 2 - dividerHeight / 2, Presets.width, dividerHeight );
  graphics.endFill();

  // TODO: XXX: Make the score text use valign and center

  let style = { font: "bold 80px Arial" };
  let style2 = { font: "bold 40px Arial", fill: '#77a' };

  let p1text = game.add.text(Presets.padding / 2, Presets.height/2 - dividerHeight/2 + 35, "P1 ", style2);
  p1text.autoRound = true;
  text1 = game.add.text(Presets.padding + p1text.width - 10, Presets.height/2 - dividerHeight/2 + 16, "0", style);

  let p2text = game.add.text(Presets.padding / 2, Presets.height/2 - dividerHeight/2 + 35, "P2 ", style2);
  p2text.autoRound = true;
  p2text.angle = 180;

  text2 = game.add.text(Presets.padding + p1text.width - 20, Presets.height/2 - dividerHeight/2 + 16, "0", style);
  text2.angle = 180;

  // RANDOM NUMBERS YAYAYAYAY
  // wouldnt be good anyway without a bitta...... MAGIC heheheheheh

  p2text.x += Presets.width - Presets.padding;
  p2text.y += p2text.height - 6;

  text2.x += Presets.width - Presets.padding - p2text.width * 2 - 20;
  text2.y += text2.height - 10;

  let descriptionStyle = {
    font: "bold 40px Arial",
    fill: '#33a',
    boundsAlignH: "center",
    boundsAlignV: "middle",
  };

  descText1 = game.add.text(
    0, 0,
    "",
    descriptionStyle
  );

  descText1.y += descText1.height - 20;

  descText1.setTextBounds(0, 0, Presets.width, Presets.height);

  descText2 = game.add.text(
    0, 0,
    "",
    descriptionStyle
  );

  descText2.setTextBounds(0, 0, Presets.width, Presets.height);

  descText2.x = Presets.width;
  descText2.y = Presets.height - descText1.height + 20;
  descText2.angle = 180;
}

let background;
let background1, background2;
let arena1, arena2;
let grass1, grass2;
function addBackground() {
  game.stage.backgroundColor = '#182d3b';

  background = game.add.sprite(0, 0, 'backgroundclouds');
  game.physics.enable(background, Phaser.Physics.ARCADE);
  background.scale.setTo(Presets.height/background.height, Presets.height/background.height);
  background.body.velocity.x = 30;

  arena1 = game.add.sprite(0, 0);
  arena1.scale.setTo(Presets.paddedWidth/arena1.width, (Presets.paddedHeight/arena1.height)/2);
  arena1.y = Presets.paddedHeight / 2 + Presets.padding;
  arena1.x = Presets.padding;

  background1 = game.add.sprite(0, 0, 'background');
  background1.scale.setTo(Presets.width/background1.width, Presets.width/background1.width);
  background1.y = Presets.height - background1.height + 10;

  grass1 = game.add.sprite(0, 0);
  grass1.scale.setTo(Presets.paddedWidth/grass1.width, (background1.height/grass1.height) * 0.8);
  grass1.y = Presets.paddedHeight - grass1.height + Presets.padding;
  grass1.x = Presets.padding;

  arena2 = game.add.sprite(0, 0);
  arena2.scale.setTo(Presets.paddedWidth/arena2.width, (Presets.paddedHeight/arena2.height)/2);
  arena2.x = Presets.padding;

  background2 = game.add.sprite(0, 0, 'background');
  background2.scale.setTo(Presets.width/background2.width, Presets.width/background2.width);
  background2.anchor.setTo(0.5, 0.5);
  background2.angle = 180;

  background2.x = background2.width/2;
  background2.y = background2.height/2 - 10;

  grass2 = game.add.sprite(0, 0);
  grass2.scale.setTo(Presets.paddedWidth/grass2.width, (background1.height/grass2.height) * 0.8);

  grass2.x = Presets.padding;
  grass2.y = Presets.padding;
}

let ticker = 0;
let oldFrame = -1000;
function animateBackground() {
  ticker = (ticker + 0.0006) % 360;
  frame++;

  background1.y = background1.y + ((Math.sin(toDegrees(ticker)))/10);
  background2.y = background2.y + ((Math.sin(toDegrees(ticker)))/10);

  if (
    (background.x + background.width < Presets.width
    || background.x > 0)
    && frame - oldFrame > 100
  ) {
    oldFrame = frame;
    background.body.velocity.x *= -1;
  }
}

function addItems() {
  items.push({
    obj: game.add.sprite(Presets.width, 0, 'barn'),
    properties: {
      manmade: true,
    },
  });
  items.push({
    obj: game.add.sprite(Presets.width, 0, 'chicken'),
    properties: {
      living: true,
      natural: true,
      animal: true,
      twolegs: true,
    },
  });
  items.push({
    obj: game.add.sprite(Presets.width, 0, 'coop'),
    properties: {
      manmade: true,
    },
  });
  items.push({
    obj: game.add.sprite(Presets.width, 0, 'dog'),
    properties: {
      living: true,
      natural: true,
      animal: true,
      fourlegs: true,
    },
  });
  items.push({
    obj: game.add.sprite(Presets.width, 0, 'girl'),
    properties: {
      living: true,
      natural: true,
      person: true,
      animal: true,
      twolegs: true,
    },
  });
  items.push({
    obj: game.add.sprite(Presets.width, 0, 'man'),
    properties: {
      living: true,
      natural: true,
      animal: true,
      person: true,
      twolegs: true,
    },
  });
  items.push({
    obj: game.add.sprite(Presets.width, 0, 'sign'),
    properties: {
      manmade: true,
    },
  });
  items.push({
    obj: game.add.sprite(Presets.width, 0, 'cat'),
    properties: {
      living: true,
      natural: true,
      animal: true,
      fourlegs: true,
    },
  });
  items.push({
    obj: game.add.sprite(Presets.width, 0, 'cow'),
    properties: {
      living: true,
      natural: true,
      animal: true,
      fourlegs: true,
    },
  });
  items.push({
    obj: game.add.sprite(Presets.width, 0, 'donkey'),
    properties: {
      living: true,
      natural: true,
      animal: true,
      fourlegs: true,
    },
  });
  items.push({
    obj: game.add.sprite(Presets.width, 0, 'house'),
    properties: {
      manmade: true,
    },
  });
  items.push({
    obj: game.add.sprite(Presets.width, 0, 'sheep'),
    properties: {
      living: true,
      natural: true,
      animal: true,
      fourlegs: true,
    },
  });
  items.push({
    sky: true,
    obj: game.add.sprite(Presets.width, 0, 'sun'),
    properties: {
      sky: true,
      natural: true,
    },
  });
  items.push({
    sky: true,
    obj: game.add.sprite(Presets.width, 0, 'cloud'),
    properties: {
      sky: true,
      natural: true,
    },
  });

  for (let i = 0; i < items.length; i++) {
    items[i].obj.inputEnabled = true;
    items[i].obj.events.onInputDown.add(onLoseCallback, items[i]);
  }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function isPositionedCorrectly(sprite, player) {
  let grass, arena;

  if (player === 1) {
    grass = grass1;
    arena = arena1;
  } else {
    grass = grass2;
    arena = arena2;
  }

  let sky = sprite.properties.sky;
  sprite = sprite.obj;

  let bounds = new Phaser.Rectangle(sprite.position.x, sprite.position.y, sprite.width, sprite.height);
  let land = grass.getBounds();

  let arenaBounds = arena.getBounds();

  let onLand = Phaser.Rectangle.intersects(bounds, land);
  let onArena = Phaser.Rectangle.contains(arenaBounds, sprite.position.x, sprite.position.y) 
    && Phaser.Rectangle.contains(arenaBounds, sprite.position.x + sprite.width, sprite.position.y + sprite.height);

  let correctPlace = false;

  if (onArena && onLand && !sky) {
    correctPlace = true;
  } else if (onArena && !onLand && sky) {
    correctPlace = true;
  }

  if (!correctPlace) return false;

  for (let i = 0; i < items.length; i++) {
    if (!checkIntersection(items[i], bounds, sprite.key)) return false;
  }

  for (let i = 0; i < tempItems.length; i++) {
    if (!checkIntersection(tempItems[i], bounds, sprite.key)) return false;
  }

  return true;
}

function checkIntersection(item, bounds, key) {
  if (item.obj.key === key) return true;

  let boundsB = new Phaser.Rectangle(
    item.obj.position.x,
    item.obj.position.y,
    item.obj.width,
    item.obj.height
  );

  if (Phaser.Rectangle.intersects(bounds, boundsB)) {
    return false;
  }

  return true;
}

function random(bound) {
  return Math.floor(Math.random() * bound);
}

let totalcount = 0;
let failflag;

let tempItems = [];

function clearItems() {
  for (let i = 0; i < tempItems.length; i++)
    if (tempItems[i])
      tempItems[i].obj.destroy();

  tempItems = [];
  p1time = 0;
  p2time = 0;

  if (bigText1) {
    bigText1.text = '';
    bigText1.destroy();
    delete bigText1;
  }
  if (bigText2) {
    bigText2.text = '';
    bigText2.destroy();
    delete bigText2;
  }

  playerHitCount = [0, 0];

  for (let i = 0; i < items.length; i++) {
    items[i].obj.angle = 0;
    items[i].obj.anchor.setTo(0, 0);
    items[i].obj.position.x = Presets.width;
    items[i].obj.scale.x = 1;
    items[i].obj.scale.y = 1;
    items[i].rightAnswer = false;
  }
}

function placePlayersItem(item, player) {
  if (player === 2) {
    item.obj.anchor.setTo(1, 1);
    item.obj.angle = 180;
  }

  let count = 0;
  do {
    count++;
    item.obj.position.x = random(Presets.width);
    item.obj.position.y = random(Presets.height);
  } while(count < 1000 && !isPositionedCorrectly(item, player));
  if (count > 990) failflag = true;
}

let selectedGame;

function placeSameItemPlayer(item, player, index) {
  let rightAnswer = index === numberOfItems - 1;
  
  if (rightAnswer) {
    item = {
      properties: item.properties,
      obj: game.add.sprite(Presets.width, 0, item.obj.key),
      rightAnswer: !!rightAnswer,
    };

    item.obj.inputEnabled = true;
    if (rightAnswer)
      item.obj.events.onInputDown.add(onWinCallback, item);
    else
      item.obj.events.onInputDown.add(onLoseCallback, item);

    tempItems.push(item);
  }
  item.player = player;

  placePlayersItem(item, player);
}

function placeSameItems(items) {
  for (let i = 0; i < numberOfItems; i++) {
    placeSameItemPlayer(items[i], 1, i)
  }

  for (let i = items.length - 1; i >= numberOfItems - 1; i--) {
    placeSameItemPlayer(items[i], 2, i);
  }
}

function placeDifferentItemPlayer(item, player, rightAnswer) {  
  item = {
    properties: item.properties,
    obj: game.add.sprite(Presets.width, 0, item.obj.key),
    rightAnswer: !!rightAnswer,
  };

  item.obj.inputEnabled = true;

  if (rightAnswer)
    item.obj.events.onInputDown.add(onWinCallback, item);
  else
    item.obj.events.onInputDown.add(onLoseCallback, item);

  tempItems.push(item);
  item.player = player;

  placePlayersItem(item, player);
}

function placeDifferentItems(items) {
  for (let i = 0; i < numberOfItems; i++) {
    placeDifferentItemPlayer(items[i], 1, i === 0)
  }

  for (let i = 1; i <= numberOfItems; i++) {
    placeDifferentItemPlayer(items[i], 2, i === numberOfItems);
  }
}

function placeAllItemPlayer(item, player) {  
  item = {
    properties: item.properties,
    obj: game.add.sprite(Presets.width, 0, item.obj.key),
    rightAnswer: true,
  };

  item.obj.inputEnabled = true;

  item.obj.events.onInputDown.addOnce(touchedIt, item);

  tempItems.push(item);
  item.player = player;

  placePlayersItem(item, player);
}

function placeAllItems(items) {
  for (let i = 0; i < numberOfItems; i++) {
    placeAllItemPlayer(items[i], 1)
  }

  for (let i = items.length - 1; i >= numberOfItems - 1; i--) {
    placeAllItemPlayer(items[i], 2);
  }
}

function placeOpponentItemPlayer(item, player, rightAnswer) {  
  item = {
    properties: item.properties,
    obj: game.add.sprite(Presets.width, 0, item.obj.key),
    rightAnswer: rightAnswer,
  };

  item.obj.inputEnabled = true;

  if (rightAnswer)
    item.obj.events.onInputDown.add(onWinCallback, item);

  tempItems.push(item);

  if (player === 1)
    item.player = 2;
  else
    item.player = 1;

  placePlayersItem(item, player);
}

function placeOpponentItems(items) {
  for (let i = 0; i < numberOfItems; i++) {
    placeOpponentItemPlayer(items[i], 1, i === 0)
  }

  for (let i = 0; i < numberOfItems; i++) {
    placeOpponentItemPlayer(items[i], 2, i === 0);
  }
}

function placeInCenter(item, player) {
  if (player === 2) {
    item.anchor.setTo(1, 1);
    item.angle = 180;
    item.position.x = (Presets.width * 0.25) + 45 + item.width / 2;
    item.position.y = (Presets.height * 0.25) - item.height;
  } else {
    item.position.x = (Presets.width / 2) - item.width / 2;
    item.position.y = (Presets.height * 0.75) //+ item.obj.height / 2;
  }
}

let currentTime;
let p1time, p2time;

function placeTimeItemPlayer(item, player) {  
  item = {
    properties: item.properties,
    obj: game.add.sprite(Presets.width, 0, item.obj.key),
    rightAnswer: true,
  };

  item.obj.inputEnabled = true;

  item.obj.events.onInputDown.addOnce(setTime, item);

  tempItems.push(item);

  item.player = player;

  placeInCenter(item.obj, player);
}

function placeTimeItems(items) {
  currentTime = Date.now();
  placeTimeItemPlayer(items[0], 1);
  placeTimeItemPlayer(items[0], 2);
}

let timeToWait = 0;
function placePatienceItemPlayer(item, player) {  
  item = {
    properties: item.properties,
    obj: game.add.sprite(Presets.width, 0, item.obj.key),
    rightAnswer: true,
  };

  item.obj.inputEnabled = true;
  item.obj.events.onInputDown.add(onLoseCallback, item);

  currentTime = Date.now();

  // between 4 and 10 secs
  timeToWait = (Math.random() * 5 + 4) * 1000;
  tempItems.push(item);
  item.player = player;
  placeInCenter(item.obj, player);
}

function endPatienceRound() {
  setBigText('Go!', 1, true);
  setBigText('Go!', 2, true);

  for (var i = 0; i < tempItems.length; i++) {
    tempItems[i].obj.events.onInputDown.removeAll();
    tempItems[i].obj.events.onInputDown.add(onWinCallback, tempItems[i]);
  }

}

function placePatienceItems(items) {
  placePatienceItemPlayer(items[0], 1)
  placePatienceItemPlayer(items[0], 2);
}

function placeDescribeItemPlayer(item, player, rightAnswer) {  
  item = {
    properties: item.properties,
    obj: game.add.sprite(Presets.width, 0, item.obj.key),
    rightAnswer: rightAnswer,
  };

  item.obj.inputEnabled = true;

  if (rightAnswer) {
    item.obj.events.onInputDown.addOnce(touchedIt, item);
  } else {
    item.obj.events.onInputDown.addOnce(onLoseCallback, item);
  }

  tempItems.push(item);
  item.player = player;

  placePlayersItem(item, player);
}

function placeDescribeItems(items) {
  var randomProperty = function (obj, rnd) {
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * rnd << 0]];
  };

  var randomKey = function (obj, rnd) {
    var keys = Object.keys(obj)
    return keys[ keys.length * rnd << 0];
  };

  let hasAtLeastOne = false;

  do {
    let rnd = Math.random();
    selectedGame.description = randomProperty(selectedGame.descriptions, rnd);
    selectedGame.key = randomKey(selectedGame.descriptions, rnd);
    for (let i = 0; i < numberOfItems; i++) {
      if (items[i].properties[selectedGame.key]) {
        hasAtLeastOne = true;
      }
    }
  } while (!hasAtLeastOne)

  for (let i = 0; i < numberOfItems; i++) {
    placeDescribeItemPlayer(items[i], 1, items[i].properties[selectedGame.key])
  }

  for (let i = 0; i < numberOfItems; i++) {
    placeDescribeItemPlayer(items[i], 2, items[i].properties[selectedGame.key]);
  }
}

function placeFireItemPlayer(item, player) {  
  item = {
    properties: item.properties,
    obj: game.add.sprite(Presets.width, 0, item.obj.key),
    rightAnswer: true,
  };

  item.obj.inputEnabled = true;
  item.obj.events.onInputDown.add(setRapidTouch, item);
  tempItems.push(item);
  item.player = player;
  placeInCenter(item.obj, player);
}

function placeFireItems(items) {
  placeFireItemPlayer(items[0], 1);
  placeFireItemPlayer(items[0], 2);
}

function placeDragItemPlayer(item, player) {  
  item = {
    properties: item.properties,
    obj: game.add.sprite(Presets.width, 0, item.obj.key),
    rightAnswer: true,
  };

  item.obj.inputEnabled = true;
  item.obj.input.enableDrag();

  item.player = player;

  item.obj.events.onDragStop.add(onDragStop, item);

  tempItems.push(item);

  placePlayersItem(item, player);
}

function placeDragItems(items) {
  for (let i = 0; i < numberOfItems; i++) {
    placeDragItemPlayer(items[i], 1, items[i].properties[selectedGame.key])
  }

  for (let i = 0; i < numberOfItems; i++) {
    placeDragItemPlayer(items[i], 2, items[i].properties[selectedGame.key]);
  }
}

function placeItems() {
  clearItems();
  items = shuffle(items);

  let thisRoundsItems = items.slice().splice(0, numberOfItems * 2 - 1);

  do {
    selectedGame = games[random(games.length)];
  } while (selectedGame.weight < Math.random())

  switch (selectedGame.name) {
    case 'same':
      placeSameItems(thisRoundsItems);
      break;
    case 'different':
      placeDifferentItems(thisRoundsItems);
      break;
    case 'all':
      placeAllItems(thisRoundsItems);
      break;
    case 'opponent':
      placeOpponentItems(thisRoundsItems);
      break;
    case 'time':
      placeTimeItems(thisRoundsItems);
      break;
    case 'patience':
      placePatienceItems(thisRoundsItems);
      break;
    case 'describe':
      placeDescribeItems(thisRoundsItems);
      break;
    case 'fire':
      placeFireItems(thisRoundsItems);
      break;
    case 'drag':
      placeDragItems(thisRoundsItems);
      break;
  }

  setDescriptionText();

  if (failflag) {
    // if we fail, just start over with new elements
    // not exactly effieicientnenitie lol
    failflag = false;
    placeItems();

  };
}

let correctSound, wrongSound;

function create() {
  Phaser.Canvas.setImageRenderingCrisp(game.canvas);

  addBackground();
  addScoreSection();
  addItems();

  correctSound = game.add.audio('correct');
  wrongSound = game.add.audio('wrong');

  cheerSound = game.add.audio('cheer');
  crackSound = game.add.audio('crack');
  hornSound = game.add.audio('horn');

  let music = game.add.audio('music');

  music.loop = true;
  music.volume = 0.6;
  music.play();
}

let endRound = false;

function animateEndRound() {
  if (!endRound) return;

  for (let i = 0; i < tempItems.length; i++) {
    if (!tempItems[i].rightAnswer) {
      continue;
    }

    game.world.bringToTop(tempItems[i].obj);

    tempItems[i].obj.x -= tempItems[i].obj.width * 0.01;
    tempItems[i].obj.y -= tempItems[i].obj.height * 0.01;

    tempItems[i].obj.scale.x *= 1.02;
    tempItems[i].obj.scale.y *= 1.02;
  }

  if (Date.now() - endRoundTime >= 600) {
    endRound = false;
    nextRound = true;
  }
}

let nextRound = true;



let itemTicker = 0;

function animateItems() {
  itemTicker = (itemTicker + 0.0006) % 360;

  for (let i = 0; i < items.length; i++) {
    items[i].obj.y = items[i].obj.y + ((Math.cos(toDegrees(itemTicker)))/4);
  }

  for (let i = 0; i < tempItems.length; i++) {
    tempItems[i].obj.y = tempItems[i].obj.y + ((Math.cos(toDegrees(itemTicker)))/4);
  }
}


function update() {

  animateBackground();

  if (!finished && nextRound && frame > 1) {
    placeItems();
    nextRound = false;
  }


  if (endRound) {
    animateEndRound();
  }

  if (animateWrong) {
    animateShake();
  }

  if (showTime) {
    if (Date.now() - endRoundTime > 1000) {
      nextRound = true;
      showTime = false;
    }
  }

  for (var i = 0; i < scores.length; i++) {
    if (scores[i] === 10 && !finished) {
      showWin(i + 1);
      finished = true;
      return;
    }
  }

  // for patience round
  if (!finished && selectedGame && selectedGame.name === 'patience' && timeToWait > 0 && timeToWait + currentTime <= Date.now()) {
    endPatienceRound();
  }

  if (showNotification && !finished) {
    setBigText(notification.message, notification.player, notification.win, notification.opacity, true);
    notification.opacity -= 0.03;
  }

  animateItems();
}

let bigText1, bigText2;

function setBigText(text, player, win, opacity, smaller) {
  if (opacity < -0.03) {
    return;
    showNotification = false;
  }

  let timeWinStyle = {
    font: smaller ? "bold 110px Arial" : "bold 180px Arial",
    fill: 'green',
    boundsAlignH: "center",
    boundsAlignV: "middle",
  };

  let timeLoseStyle = {
    font: smaller ? "bold 110px Arial" : "bold 180px Arial",
    fill: 'red',
    boundsAlignH: "center",
    boundsAlignV: "middle",
  };

  if (!opacity) opacity = 1;


  if (player === 1) {
    if (bigText1) bigText1.destroy();
    bigText1 = game.add.text(
      0, 0,
      text,
      win ? timeWinStyle : timeLoseStyle
    );

    bigText1.alpha = opacity;

    bigText1.y += bigText1.height;
    if (smaller) bigText1.y += 50;

    bigText1.setTextBounds(0, 0, Presets.width, Presets.height);
  } else {
    if (bigText2) bigText2.destroy();
    bigText2 = game.add.text(
      0, 0,
      text,
      win ? timeWinStyle : timeLoseStyle
    );

    bigText2.alpha = opacity;

    bigText2.setTextBounds(0, 0, Presets.width, Presets.height);

    bigText2.x = Presets.width;
    bigText2.y = Presets.height - bigText2.height;
    if (smaller) bigText2.y -= 50;
    bigText2.angle = 180;
  }
}

let notification = {
  opacity: 0,
  message: '',
  player: 0,
  win: false,
}

function onLoseCallback() {
  onLose(this);
}

let showNotification = false;
function onLose(item) {
  if (endRound) return;

  if (--scores[item.player - 1] < 0) {
    scores[item.player - 1] = 0;
  }

  setText(item.player, scores[item.player - 1]);

  notification.opacity = 0.9;
  notification.message = failMessages[random(failMessages.length)];
  notification.player = item.player;
  notification.win = false;
  showNotification = true;

  shakenObj = item.obj;
  animateWrong = true;
  wrongX = item.obj.x;
  wrongY = item.obj.y;
  wrongSound.play();

}

function onWinCallback() {
  onWin(this);
}

function showWin(player) {
  clearItems();
  clearItems();

  if (player === 1) {
    setBigText('You RULE!', 1, true);
    setBigText('You SUCK!', 2, false);
  }
  else {
    setBigText('You RULE!', 2, true);
    setBigText('You SUCK!', 1, false);    
  }

  descText1.text = '';
  descText2.text = '';

  cheerSound.play();
  crackSound.play();
  hornSound.play();

  let item1 = {
    obj: game.add.sprite(Presets.width, 0, items[random(items.length)].obj.key),
    rightAnswer: false,
  }

  let item2 = {
    obj: game.add.sprite(Presets.width, 0, items[random(items.length)].obj.key),
    rightAnswer: false,
  }

  item1.obj.inputEnabled = true;
  item2.obj.inputEnabled = true;

  item1.obj.events.onInputDown.addOnce(restart, item1.obj);
  item2.obj.events.onInputDown.addOnce(restart, item2.obj);

  tempItems.push(item1);
  tempItems.push(item2);

  descText1.text = "TAP TO REPLAY!!!";
  descText2.text = "TAP TO REPLAY!!!";

  placeInCenter(item1.obj, 1);
  placeInCenter(item2.obj, 2);
}

function restart() {
  console.log('here');
  setText(1, 0);
  setText(2, 0);
  scores = [0, 0];
  finished = false;
  // endRound = true;
  nextRound = true;
  showNotification = false;
  endRoundTime = Date.now();
  correctSound.play();
}

let finished = false;

function onWin(item) {
  if (endRound) return;

  scores[item.player - 1]++;
  
  setText(item.player, scores[item.player - 1]);

  notification.opacity = 0.9;
  notification.message = successMessages[random(successMessages.length)];
  notification.player = item.player;
  notification.win = true;
  showNotification = true;

  endRound = true;
  endRoundTime = Date.now();

  correctSound.play();
}

let playerHitCount = [0, 0];
function setRapidTouch(item) {
  if (endRound) return;

  correctSound.play();

  this.obj.x -= this.obj.width * 0.04;
  this.obj.y -= this.obj.height * 0.04;

  this.obj.scale.x *= 1.08;
  this.obj.scale.y *= 1.08;

  this.hit = true;
  playerHitCount[this.player - 1]++;

  if (playerHitCount[this.player - 1] >= 19) {
    this.obj.events.onInputDown.removeAll();
    this.obj.events.onInputDown.add(onWinCallback, this);
  }
}

function touchedIt(item) {
  if (endRound) return;

  correctSound.play();

  this.obj.scale.x = 0.5;
  this.obj.scale.y = 0.5;
  this.obj.x += this.obj.width * 0.5;
  this.obj.y += this.obj.height * 0.5;
  this.hit = true;

  for (var i = 0; i < tempItems.length; i++) {
    if (tempItems[i].player !== this.player) {
      continue;
    }
    if (tempItems[i].rightAnswer && !tempItems[i].hit) {
      return;
    }
  }

  onWin(this);
}

let playerDraggedCount = [0, 0];
function onDragStop() {
  let land;

  if (this.player === 1) {
    land = grass2;
  } else {
    land = grass1;
  }

  let onLand = Phaser.Rectangle.intersects(this.obj.getBounds(), land);

  if (onLand) {
    correctSound.play();
    this.obj.events.onDragStop.removeAll();

    this.obj.scale.x = 0.5;
    this.obj.scale.y = 0.5;
    this.obj.x += this.obj.width * 0.5;
    this.obj.y += this.obj.height * 0.5;

    playerDraggedCount[this.player - 1]++;
    if (playerDraggedCount[this.player - 1] === numberOfItems) {
      onWin(this);
      playerDraggedCount = [0, 0];
    }
  }
}

let showTime;

function setTime() {
  let timeWinner;

  correctSound.play();

  if (this.player === 1) {
    p1time = Date.now();
  } else {
    p2time = Date.now();
  }

  if (p1time !== 0 && p2time !== 0) {
    showTime = true;
    endRoundTime = Date.now();
    if (Math.abs(p1time - currentTime - 10000) < Math.abs(p2time - currentTime - 10000)) {
      setText(1, ++scores[0]);
      timeWinner = 1;
    } else {
      setText(2, ++scores[1]);
      timeWinner = 2;
    }

    setBigText((p1time - currentTime) / 1000 + 's', 1, timeWinner === 1);
    setBigText((p2time - currentTime) / 1000 + 's', 2, timeWinner === 2);
  }
}

function setText(player, score) {
  if (player === 1) {
    text1.text = score;
  } else {
    text2.text = score;
  }
}

let shakenObj = null;
let animateWrong = false;
let wrongX = 0;
let wrongY = 0;
let wrongFrameCount = 0;

function animateShake() {
  shakenObj.x = wrongX + Math.random() * 20 - 20;
  shakenObj.y = wrongY + Math.random() * 7 - 7;

  wrongFrameCount++;

  if (wrongFrameCount > 20) {
    animateWrong = false;

    wrongFrameCount = 0;
    shakenObj.x = wrongX;
    shakenObj.y = wrongY;
    wrongX = 0;
    wrongY = 0;
    shakenObj = null;

  }
} 

function setDescriptionText() {
  descText1.text = selectedGame.description;
  descText2.text = selectedGame.description;

  if (selectedGame.name === 'opponent') {
    descText1.text = selectedGame.description + tempItems[0].obj.key;
    descText2.text = selectedGame.description + tempItems[0].obj.key;
  }
}


