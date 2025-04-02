const tableElement = document.querySelector(".js-warriors-table");

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
  const formatProb = (prob) => prob === 0 ? "" : (prob * 100).toFixed(1) + '%';
  
  row.cells[2].textContent = formatProb(probabilities.winwin);
  row.cells[3].textContent = formatProb(probabilities.winlose);
  row.cells[4].textContent = formatProb(probabilities.loselose);
  row.cells[5].textContent = formatProb(probabilities.win);
  row.cells[6].textContent = formatProb(probabilities.lose);
}

function getAttackerProbabilities(
  attackDiceNum,
  defenseDiceNum,
  attackerHasPlusOneAdvantage,
  defenderHasPlusOneAdvantage,
  attackerIsDragon=false,
  defenderIsDragon=false
) {
  if (attackerHasPlusOneAdvantage && defenderHasPlusOneAdvantage) {
    console.error('attackerHasPlusOneAdvantage && defenderHasPlusOneAdvantage cannot be both true');
    return;
  }
  if (attackerIsDragon) {
    attackDiceNum = 2;
    attackerHasPlusOneAdvantage = false;
  }
  if (defenderIsDragon) {
    defenseDiceNum = 2;
    defenderHasPlusOneAdvantage = false;
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
  if(attackerIsDragon) {
    attackOutcomes.forEach(arr => arr[0]++);
    attackOutcomes.forEach(arr => arr[1]++);
  }
  if(defenderIsDragon) {
    defenderOutcomes.forEach(arr => arr[0]++);
    defenderOutcomes.forEach(arr => arr[1]++);
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
  let numWin = 0;
  let numLose = 0;

  let numDiceToCompare = Math.min(attack.length, defense.length);
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


// Dragon
// Entirely

const dragonTableElement = document.querySelector(".js-dragon-table");
addRowToDragonTable(1,false,2,false,true,false, dragonTableElement);
addRowToDragonTable(1,false,2,true,true,false, dragonTableElement);
addRowToDragonTable(1,false,1,false,true,false, dragonTableElement);
addRowToDragonTable(1,false,1,true,true,false, dragonTableElement);

addRowToDragonTable(3,true,1,false,false,true, dragonTableElement);
addRowToDragonTable(3,false,1,false,false,true, dragonTableElement);

addRowToDragonTable(2,true,1,false,false,true, dragonTableElement);
addRowToDragonTable(2,false,1,false,false,true, dragonTableElement);

addRowToDragonTable(1,true,1,false,false,true, dragonTableElement);
addRowToDragonTable(1,false,1,false,false,true, dragonTableElement);

addRowToDragonTable(1,false,1,true,true,true, dragonTableElement);


function addRowToDragonTable(
  attackDiceNum,
  attackerHasPlusOneAdvantage,
  defenseDiceNum,
  defenderHasPlusOneAdvantage,
  attackerIsDragon,
  defenderIsDragon,
  tableElement
) {
  let probabilities = getAttackerProbabilities(
    attackDiceNum,
    defenseDiceNum,
    attackerHasPlusOneAdvantage,
    defenderHasPlusOneAdvantage,
    attackerIsDragon,
    defenderIsDragon
  );

  row = tableElement.insertRow()
  for (let i=0; i<7; i++) row.insertCell();
  fillDragonRow(row, probabilities);
  fillDragonFirst2Cols(
    attackDiceNum,
    defenseDiceNum,
    attackerHasPlusOneAdvantage,
    defenderHasPlusOneAdvantage,
    attackerIsDragon,
    defenderIsDragon,
    row
  );
}


function fillDragonFirst2Cols(
  attackDiceNum,
    defenseDiceNum,
    attackerHasPlusOneAdvantage,
    defenderHasPlusOneAdvantage,
    attackerIsDragon,
    defenderIsDragon,
    row
) {
  if (attackerIsDragon)
    row.cells[0].innerHTML = `<img src="./images/dragon.png" class="dice-icon">`
  else
    row.cells[0].innerHTML = `<img src="./images/red_dice.png" class="dice-icon">
    `.repeat(attackDiceNum) + `+ <img src="./images/balestra.png" class="dice-icon">`.repeat(attackerHasPlusOneAdvantage && 1);

  if (defenderIsDragon)
    row.cells[1].innerHTML = `<img src="./images/dragon.png" class="dice-icon">`
  else
    row.cells[1].innerHTML = `<img src="./images/black_dice.png" class="dice-icon">`
    .repeat(defenseDiceNum) + `+ <img src="./images/balestra.png" class="dice-icon">`.repeat(defenderHasPlusOneAdvantage && 1);
}

function fillDragonRow(row, probabilities) {
  const formatProb = (prob) => prob === 0 ? "" : (prob * 100).toFixed(1) + '%';
  
  row.cells[2].textContent = formatProb(probabilities.winwin);
  row.cells[3].textContent = formatProb(probabilities.winlose);
  row.cells[4].textContent = formatProb(probabilities.loselose);
  row.cells[5].textContent = formatProb(probabilities.win);
  row.cells[6].textContent = formatProb(probabilities.lose);
}