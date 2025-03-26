let result = '';
      let score = JSON.parse(localStorage.getItem('score')) || {
          wins: 0,
          losses: 0,
          ties: 0
        };
      updateScoreElement();

      function getComputerMove() {
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

      function playGame(playerMove) {
        computerMove = getComputerMove();

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
            result = 'You win.';
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
      console.log(product2['name']);
      console.log(product2['delivery-time']);
      console.log(product2['delivery-time'+'fff']);
      console.log(product2.ratings.stars);
      product2.fun();

      console.log(JSON.stringify(product2));