var player = 1;
var solution1 = [];
var solution2 = [];
var currentRow = 0;
var endGame = false;
var timeLeft1 = 60;
var timeLeft2 = 60;
var timer1;
var timer2;
var handler;


function init() {
    solution1=JSON.parse(sessionStorage.getItem('solution1'));
    solution2=JSON.parse(sessionStorage.getItem('solution2'));
    timer1 = document.getElementById("timer1");
    timer2 = document.getElementById("timer2");
    handler = setInterval(updateCountdown, 1000);    
}



function updateCountdown() {
    if (endGame == true) {
        return;
    }

    if (player == 1) {
        timer1.innerHTML = timeLeft1;
        --timeLeft1;
        if (timeLeft1 < 0) {
            clearInterval(handler);
            showCombinations();
            endGame = true;
            alert("Player 2 wins!");
        }        
        
    }
    else {
        timer2.innerHTML = timeLeft2;
        --timeLeft2;
        if (timeLeft2 < 0) {
            clearInterval(handler);
            showCombinations();
            endGame = true;
            alert("Player 1 wins!");
        }                
    }
}

//Symbol insertion
function makeMove(symbol, id = null) {      
    if (endGame == true) {
        return; 
    }

    let table = getTable(id, "game");
    let position = emptyPosition(table);
    if ((id == player || id == null) && position != "full") {

        let picture = document.createElement("img");
        picture.src = "../img/" + symbol + ".png";
        picture.id = symbol;

        let field = document.getElementById(table).rows[currentRow].cells[position];
        field.appendChild(picture);
    }
}


function confirmMove(id = null) {      
    if (endGame == true || (player != id && id != null)) {
        return; 
    }

    let table = getTable(id, "game");

    if (emptyPosition(table) != "full") {
        alert("Some fields are empty!");
    }
    else if (id == player) {        
        //In-game confirmation
        rate();
        let table = getTable(id, "game");
        if (id == 2) {
            ++currentRow;
        }
        player = player == 1 ? 2 : 1;
    }
    else if (id == null) {      
        //Confrimation while assigning combination

        if (player == 1) {      
            //Player 1 assigned combination
            for (i = 0; i < 4; ++i) {
                let picture = document.getElementById(table).rows[0].cells[i].firstChild;
                solution1.push(picture.id);
            }
            document.getElementById("combination-setter").innerHTML = "Player 2 sets a combination:";
            player = 2;
            clearMove();
        }
        else {      
            //Player 2 assigned combination
            for (i = 0; i < 4; ++i) {
                let picture = document.getElementById(table).rows[0].cells[i].firstChild;
                solution2.push(picture.id);
            }
            clearMove();
            player = 1;
            sessionStorage.setItem('solution1', JSON.stringify(solution1));
            sessionStorage.setItem('solution2', JSON.stringify(solution2));
            window.location = "../common/mastermind-game.html";
        }
    }
}


//Praznjenje trenutnih polja
function clearMove(id = null) {  
    if (endGame == true) {
        return; 
    }

    if (id == null || id == player) {
        let table = getTable(id, "game");
        for (i = 0; i < 4; ++i) {
            let picture = document.getElementById(table).rows[currentRow].cells[i].firstChild;
            if (picture != null) picture.parentNode.removeChild(picture);
        }
    }
}

function rate() {       
    //Ocena poteza

    if (endGame == true) {
        return; 
    }

    let checkSolution = [false, false, false, false];
    let checkTry = [false, false, false, false];
    let table = getTable(player, "game");
    let solution = player == 1 ? solution1 : solution2;
    let red = 0, yellow = 0;

    for (let i = 0; i < 4; ++i) {
        let symbol = document.getElementById(table).rows[currentRow].cells[i].firstChild.id;
        if (symbol == solution[i]) {
            ++red;
            checkSolution[i] = true;
            checkTry[i] = true;
        }
    }

    for (let i = 0; i < 4; ++i) {
        if (checkTry[i] == true) {
            continue;
        }
        let symbol = document.getElementById(table).rows[currentRow].cells[i].firstChild.id;
        for (let j = 0; j < 4; ++j) {            
            if (symbol == solution[j] && checkSolution[j] == false) {
                checkSolution[j] = true;
                ++yellow;
                break;
            }
        }        
    }

    table = getTable(player, "success");
    let i;
    for (i = 0; i < red; ++i) {
        let picture = document.createElement("img");
        picture.src = "../img/red.png";
        let field = document.getElementById(table).rows[currentRow].cells[i];
        field.appendChild(picture);
    }
    for (; i < red + yellow; ++i) {
        let picture = document.createElement("img");
        picture.src = "../img/yellow.png";
        let field = document.getElementById(table).rows[currentRow].cells[i];
        field.appendChild(picture);
    }

    if (red == 4) {
        showCombinations();
        alert("Player " + player + " wins!");
        endGame = true;
    }
    else if (currentRow == 7) {
        showCombinations();
        alert("Game has ended and final result is even!");
        endGame = true;
    }
}


function emptyPosition(table) {
    if (endGame == true) {
        return; 
    }

    let i;
    for (i = 0; i < 4; ++i) {
        if (document.getElementById(table).rows[currentRow].cells[i].firstChild == null) {
            break;
        }
    }
    return i < 4 ? i : "full";
}

function agreementComplete() {
    let agreement1 = document.getElementById("agreement1").checked;
    let agreement2 = document.getElementById("agreement2").checked;

    if(agreement1 == true && agreement2 == true) {
        window.location = "../common/mastermind-settings.html";
    } 
    else {
        if (agreement1 == false && agreement2 == false) {
            alert("Neither of two players didn't check the agreement!");
        }
        else if (agreement1 == false) {
            alert("Player 1 didn't check the agreement!");
        }
        else {
            alert("Player 2 didn't check the agreement!");
        }
    }
}

function showCombinations() {
    if (endGame == true) {
        return; 
    }

    let table1 = getTable(1, "combination");
    let table2 = getTable(2, "combination");

    for (let i = 0; i < 4; ++i) {
        let picture = document.createElement("img");
        picture.src = "../img/" + solution1[i] + ".png";
        let field = document.getElementById(table1).rows[0].cells[i];
        field.appendChild(picture);
        picture = document.createElement("img");
        picture.src = "../img/" + solution2[i] + ".png";
        field = document.getElementById(table2).rows[0].cells[i];
        field.appendChild(picture);
    }
}

function getTable(id, type) {
    return id == null ? "table-settings" : "table-player" + id + "-" + type;
}