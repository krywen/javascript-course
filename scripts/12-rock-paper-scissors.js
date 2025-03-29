let result = '';
let score = JSON.parse(localStorage.getItem('score')) || {
    wins: 0,
    losses: 0,
    ties: 0
  };
updateScoreElement();

function pickComputerMove() {
  const randomNumber = Math.random();
  if (randomNumber < 0.34) {
    return 'rock';
  } else if (randomNumber < 0.67) {
    return 'paper';
  } else {
    return 'scissors';
  }
  console.log(computerMove);
}

// play with the keyboard
document.body.addEventListener('keydown', (event)=>{
  if (event.key === 'r') {
    playGame('rock');
  } else if (event.key === 'p') {
    playGame('paper');
  } else if (event.key === 's') {
    playGame('scissors');
  }
});

function playGame(playerMove) {
  computerMove = pickComputerMove();

  if (playerMove === 'paper') {
    if (computerMove === 'rock') {
      result = 'You Win.';
    } else if (computerMove === 'paper') {
      result = 'Tie.';
    } else {
      result = 'You Lose.';
    }
  } else if(playerMove === 'rock') {
    if (computerMove === 'rock') {
      result = 'Tie.';
    } else if (computerMove === 'paper') {
      result = 'You Lose.';
    } else {
      result = 'You Win.';
    }
  } else { // Scissors
    if (computerMove === 'scissors') {
      result = 'Tie.';
    } else if (computerMove === 'paper') {
      result = 'You Win.';
    } else {
      result = 'You Lose.';
    }
  }

  if (result === 'You Win.') {
    score.wins++;
  } else if (result === 'You Lose.') {
    score.losses++;
  } else {
    score.ties++;
  }

  localStorage.setItem('score', JSON.stringify(score));

  updateScoreElement();
  document.querySelector('.js-result').innerHTML = result;
  document.querySelector('.js-moves').innerHTML = `You
    <img src="images/${playerMove}-emoji.png" class="move-icon">
    <img src="images/${computerMove}-emoji.png" class="move-icon">
    Computer`;
}

function updateScoreElement() {
  document.querySelector('.js-score')
  .innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

const product2 = {
  name: 'shirt',
  ['delivery-time']: '1 day',
  ['delivery-time'+'fff']: '1 day',
  ratings: {
    stars: 4.5,
    count: 87
  },
  fun: function f1() {
    console.log('f1 inside product2');
  }
}

let isAutoPlaying = false;
let intervalId;
function autoPlay() {
  if (!isAutoPlaying) {
    isAutoPlaying = true;
    intervalId = setInterval(() => {
      playGame(pickComputerMove());
    }
    , 1000)
  } else {
    isAutoPlaying = false;
    clearInterval(intervalId);
  }
}

document.querySelector('.js-rock-button').addEventListener('click', ()=>{playGame('rock')});
document.querySelector('.js-paper-button').addEventListener('click', ()=>{playGame('paper')});
document.querySelector('.js-scissors-button').addEventListener('click', ()=>{playGame('scissors')});
