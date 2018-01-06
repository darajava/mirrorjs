let toDegrees = function (angle) {
  return angle * (180 / Math.PI);
}

let shuffle = function(array) {
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

function random(bound) {
  return Math.floor(Math.random() * bound);
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

exports.toDegrees = toDegrees;
exports.shuffle = shuffle;
exports.random = random;
exports.placeInCenter = placeInCenter;