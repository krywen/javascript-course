
const tableElement = document.querySelector(".js-table-3-2");

// Row 1

addRowToTable(3,2,true,false, tableElement);
addRowToTable(3,2,false,false, tableElement);
addRowToTable(3,2,false,true, tableElement);

addRowToTable(2,2,true,false, tableElement);
addRowToTable(2,2,false,false, tableElement);
addRowToTable(2,2,false,true, tableElement);

addRowToTable(3,1,true,false, tableElement);
addRowToTable(3,1,false,false, tableElement);
addRowToTable(3,1,false,true, tableElement);

addRowToTable(2,1,true,false, tableElement);
addRowToTable(2,1,false,false, tableElement);
addRowToTable(2,1,false,true, tableElement);

addRowToTable(1,1,true,false, tableElement);
addRowToTable(1,1,false,false, tableElement);
addRowToTable(1,1,false,true, tableElement);

addRowToTable(1,2,true,false, tableElement);
addRowToTable(1,2,false,false, tableElement);
addRowToTable(1,2,false,true, tableElement);




function addRowToTable(
  attackDiceNum,
  defenseDiceNum,
  attackerHasPlusOneAdvantage,
  defenderHasPlusOneAdvantage,
  tableElement
) {
  let probabilities = getAttackerProbabilities(
    attackDiceNum,
    defenseDiceNum,
    attackerHasPlusOneAdvantage,
    defenderHasPlusOneAdvantage
  );

  row = tableElement.insertRow()
  for (let i=0; i<7; i++) row.insertCell();
  fillRow(row, probabilities);
  fillFirst2Cols(attackDiceNum,
    defenseDiceNum,
    attackerHasPlusOneAdvantage,
    defenderHasPlusOneAdvantage,
    row
  );
}

function fillFirst2Cols(
  attackDiceNum,
  defenseDiceNum,
  attackerHasPlusOneAdvantage,
  defenderHasPlusOneAdvantage,
  row
) {
  row.cells[0].innerHTML = `<img src="./images/red_dice.png" class="dice-icon">
  `.repeat(attackDiceNum) + `+ <img src="./images/balestra.png" class="dice-icon">`.repeat(attackerHasPlusOneAdvantage && 1);

  row.cells[1].innerHTML = `<img src="./images/black_dice.png" class="dice-icon">
  `.repeat(defenseDiceNum) + `+ <img src="./images/balestra.png" class="dice-icon">`.repeat(defenderHasPlusOneAdvantage && 1);
}

function fillRow(row, probabilities) {
  row.cells[2].textContent = (probabilities.winwin * 100).toFixed(1) + '%';
  row.cells[3].textContent = (probabilities.winlose * 100).toFixed(1) + '%';
  row.cells[4].textContent = (probabilities.loselose * 100).toFixed(1) + '%';
  row.cells[5].textContent = (probabilities.win * 100).toFixed(1) + '%';
  row.cells[6].textContent = (probabilities.lose * 100).toFixed(1) + '%';
}

function getAttackerProbabilities(
  attackDiceNum,
  defenseDiceNum,
  attackerHasPlusOneAdvantage,
  defenderHasPlusOneAdvantage,
) {
  if (attackerHasPlusOneAdvantage && defenderHasPlusOneAdvantage) {
    console.error('attackerHasPlusOneAdvantage && defenderHasPlusOneAdvantage cannot be both true');
    return;
  }
  attackOutcomes = generateOutcomesForDice(attackDiceNum);
  defenderOutcomes = generateOutcomesForDice(defenseDiceNum);


  // console.log(`attackOutcomes=${attackOutcomes.lenght}`);
  // console.log(typeof attackOutcomes);
  // attackOutcomes.forEach((it, index) => {console.log(`${index}: ${it}`)});

  // console.log(`defenderOutcomes=${defenderOutcomes.lenght}`);
  // defenderOutcomes.forEach((it, index) => {console.log(`${index}: ${it}`)});

  // Sorting
  attackOutcomes.map(arr => arr.sort(function(a, b){return -a+b}));
  defenderOutcomes.map(arr => arr.sort(function(a, b){return -a+b}));

  // Apply Modifier
  if (attackerHasPlusOneAdvantage) {
    attackOutcomes.forEach(arr => arr[0]++);
  }
  if (defenderHasPlusOneAdvantage) {
    defenderOutcomes.forEach(arr => arr[0]++);
  }

  // console.log(`defenderOutcomes=${defenderOutcomes.lenght}`);
  // defenderOutcomes.forEach((it, index) => {console.log(`${index}: ${it}`)});

  // Generate probs


  const o = getOutcomesFromDice(attackOutcomes, defenderOutcomes);
  console.log(o);

  // GetProrabilities from counts
  let tot = o.winwin + o.winlose + o.loselose + o.win + o.lose;
  o.winwin = o.winwin/tot;
  o.winlose = o.winlose/tot;
  o.loselose = o.loselose/tot;
  o.win = o.win/tot;
  o.lose = o.lose/tot;

  console.log(o);
  return o;
}

function getOutcomesFromDice(attackOutcomes, defenderOutcomes) {
  const accum = {
    winwin: 0,
    winlose: 0,
    loselose: 0,
    win: 0,
    lose: 0
  }
  attackOutcomes.forEach(attack => {
    defenderOutcomes.forEach(defense => {
      getOutcomeProbA3D2(attack, defense, accum);
    })
  });
  return accum;
}

function getOutcomeProbA3D2(attack, defense, accum) {
  // if (attack.length <2) {
  //   console.error("bad outcome attack");
  //   return;
  // }
  // if (defense.length <2) {
  //   console.error(`bad outcome defense; ${typeof defense} ${defense}`);
  //   return;
  // }
  // if (attack[0]>defense[0] && attack[1]>defense[1])
  //   accum.winwin++
  // else if (attack[0]>defense[0] && attack[1]<=defense[1])
  //   accum.winlose++;
  // else if (attack[0]<=defense[0] && attack[1]>defense[1])
  //   accum.winlose++;
  // else if (attack[0]<=defense[0] && attack[1]<=defense[1])
  //   accum.loselose++;

  // method for any number of dice, max 2 in defense

  let numWin = 0;
  let numLose = 0;

  // console.log(`defense ${defense}; ${typeof defense}`);
  let numDiceToCompare = Math.min(attack.length, defense.length);
  console.log(`numDiceToCompare ${numDiceToCompare}`);
  for (let i=0; i<numDiceToCompare; i++) {
    if (attack[i]>defense[i])
      numWin++;
    else
      numLose++;
  }

  if(numWin==1 && numLose==0)
    accum.win++;
  else if(numWin==0 && numLose==1)
    accum.lose++;
  else if(numWin==1 && numLose==1)
    accum.winlose++;
  else if(numWin==2 && numLose==0)
    accum.winwin++;
  else if(numWin==0 && numLose==2)
    accum.loselose++;

  console.log(accum);
}

function generateOutcomesForDice(diceNum) {
  let ret = [[]];
  for(let dice=0; dice<diceNum; dice++) {
    const tmp = []
    ret.forEach(prev => {
      for(let i=1; i<=6; i++) {
        tmp.push(prev.concat([i]))
    }
    });
    ret = tmp.slice();
  }
  return ret;
}