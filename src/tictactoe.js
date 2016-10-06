
//contains the main game functions, and keeps track of active game,  determines winner or tie game


// different game statuses
const gameStatus = {
    ACTIVE_GAME: 1,
    PLAYER1_WINNER: 2,
    PLAYER2_WINNER: 3,
    TIE: 4
};

// cell  and text symbols
const gameCellFill = {
    X: 1,
    O: -1,
    EMPTY: 0
};

const gameCellFillSymbols = {
    X: 'X',
    O: 'O',
    EMPTY: '---'
};

// game players
function game(username1, username2){
    this.username1 = username1;
    this.username2 = username2;
    this.activePlayer = username1;

    //board grid size 
    this.boardSize = 3;

//================= draws a 3x3 board h draws horizontal lines and v draws vertical lines ===========

    var board = new Array(this.boardSize);
    for(var h = 0; h < this.boardSize; h++)
    {
        board[h] = new Array(this.boardSize);

        for(var v = 0; v < this.boardSize; v++)
        {
            board[h][v] = gameCellFill.EMPTY;
        }
    }
    // initates new game, empty board 
    this.board = board;

    this.gameStatus = gameStatus.ACTIVE_GAME;

    this.cellFilledCount = 0;

    this.totalCellsCount = this.boardSize * this.boardSize;

    this.finished = false;
    
    return this;
}


// draws the board
function drawCurrentBoard(currentGame){
    var boardDrawn = '';

    var board = currentGame.board;


    for(var h = 0; h < board.length; h++)
    {
        boardDrawn += '\n'

        for(var v = 0; v < board[h].length; v++)
        {
            if(v>0)
            {
                boardDrawn += '|';
            }
            // switch cases for empty, X and O moves
            switch(board[h][v])
            {
                case gameCellFill.EMPTY:
                    boardDrawn += gameCellFillSymbols.EMPTY;
                    break;
                case gameCellFill.X:
                    boardDrawn += gameCellFillSymbols.X;
                    break;
                case gameCellFill.O:
                    boardDrawn += gameCellFillSymbols.O;
                    break;
            }

        }
        
    }
    
    
    return boardDrawn;
}


// =============draws the board============

function move(payload, currentGame, rowIn, columnIn){

    var row = rowIn - 1;
    var col = columnIn - 1;

    if(currentGame.gameStatus == gameStatus.ACTIVE_GAME) {
        //out of bounds errors 
        if(row < 0 || row >= currentGame.boardSize || col < 0 || col >= currentGame.boardSize)
        {
            return 'Row and column must be within the board size' + drawCurrentBoard(currentGame);
        }
        else if (currentGame.board[row][col] != gameCellFill.EMPTY) {
            return 'Board space must be empty' + drawCurrentBoard(currentGame);
        }
        //move only occurs for activePlayer
        else {
            if(currentGame.activePlayer == payload.user_name){

                currentGame.cellFilledCount++;


                if(currentGame.activePlayer == currentGame.username1){
                    currentGame.board[row][col] = gameCellFill.X;
                    currentGame.activePlayer = currentGame.username2;
                }
                else {
                    currentGame.board[row][col] = gameCellFill.O;
                    currentGame.activePlayer = currentGame.username1;
                }
                return checkForWinnerOrTie(currentGame);
                
                
            }
            else {
                if(currentGame.username1 == payload.user_name || currentGame.username2 == payload.user_name){

                        return 'Hey! it\'s time for ' + currentGame.activePlayer +
                            ' to take a turn. wait for your turn ;)' +
                            drawCurrentBoard(currentGame);

                }
                else {
                    return 'Sorry, there is a game in progress, please wait for the current game to finish before beginning a new one';
                }
            }
        }
    }
    else {
        return 'There is not an active game in this channel. go ahead and start one! :)';
    }
}


//returns the current status of the game and draws the board from each turn 
function getCurrentStatus(currentGame){
    return 'It is ' + currentGame.activePlayer + '\'s turn in the game ' +
        'between ' + currentGame.username1 + ' (X) and ' + currentGame.username2 + ' (O)' +
        drawCurrentBoard(currentGame);
}


//checks for the winner by row, column, diagonal after each move and checks for a tie (filled board)
function checkForWinnerOrTie(currentGame){

    if(currentGame.gameStatus == gameStatus.ACTIVE_GAME) {
        rowWinner(currentGame);
    }

    if(currentGame.gameStatus == gameStatus.ACTIVE_GAME) {
        columnWinner(currentGame);
    }

    if(currentGame.gameStatus == gameStatus.ACTIVE_GAME) {
        diagonalWinner(currentGame);
    }

    if(currentGame.gameStatus == gameStatus.ACTIVE_GAME){
        checkForTie(currentGame);
    }
    
    return returnTextForGameWinOrTieStatus(currentGame);
}

// switch cases for finished game 
function returnTextForGameWinOrTieStatus(currentGame){
    
    var statusString = '';
    switch(currentGame.gameStatus){
        case gameStatus.PLAYER1_WINNER:
            currentGame.finished = true;
            statusString = '\nCongrats!'  + currentGame.username1 + 'won the game';
            break;
        case gameStatus.PLAYER2_WINNER:
            currentGame.finished = true;
            statusString =  '\nCongrats! ' + currentGame.username2 + 'won the game';
            break;
        case gameStatus.TIE:
            currentGame.finished = true;
            statusString =  '\nThis game is tied';
            break;
        case gameStatus.ACTIVE_GAME:
        default:
            break;
    }

    if(currentGame.finished){
        return drawCurrentBoard(currentGame) + statusString;
    }
    else {
        return getCurrentStatus(currentGame);
    }

}




//checks current board for a tie (for completley filled board)
function checkForTie(currentGame){

    if(currentGame.totalCellsCount == currentGame.cellFilledCount){
        currentGame.gameStatus = gameStatus.TIE;
    }
    
}

// ========== winning situations ===========
function rowWinner(currentGame){

    var board = currentGame.board;

    var rowCount = 0;

    while(rowCount < currentGame.boardSize)
    {
        var columnCount = 0;

        var rowTotal = 0;

        rowTotal = board[rowCount].reduce(
            function(total, num){return total + num},0
        );
        // x winner 3 == 3 
        if(rowTotal == currentGame.boardSize){
            currentGame.gameStatus = gameStatus.PLAYER1_WINNER;
            break;
        }
        // O winner 3 == -(-3)
        else if(rowTotal == -currentGame.boardSize){
            currentGame.gameStatus = gameStatus.PLAYER2_WINNER;
            break;
        }

        rowCount++;
    }
}

function columnWinner(currentGame){

    var board = currentGame.board;

    var sumColArray = board[0];
    
    for(var rowCount = 1; rowCount < currentGame.boardSize; rowCount++){
        sumColArray = board[rowCount].map(function(cellVal, idx){
            return cellVal + sumColArray[idx];
        });
    }
    
    var columnCount = 0;

    while(columnCount < currentGame.boardSize)
    {
        // x winner 3 == 3 
        if(sumColArray[columnCount] == currentGame.boardSize){
            currentGame.gameStatus = gameStatus.PLAYER1_WINNER;
            break;
        }
        // O winner 3 == -(-3)
        else if(sumColArray[columnCount] == -currentGame.boardSize){
            currentGame.gameStatus = gameStatus.PLAYER2_WINNER;
            break;
        }

        columnCount++;
    }
}

//checks for diagonal winner
function diagonalWinner(currentGame){

    var board = currentGame.board;

    var diagonalCount = 0;
    var upDiagonalRow = currentGame.boardSize - 1;
    var upDiagonalCol = 0;

    var downdiagonalTotal = 0;
    var updiagonalTotal = 0;

    while(diagonalCount < currentGame.boardSize)
    {
        downdiagonalTotal += board[diagonalCount][diagonalCount];

        updiagonalTotal += board[upDiagonalRow][upDiagonalCol];

        diagonalCount++;

        upDiagonalRow--;

        upDiagonalCol++;
    }

    if(downdiagonalTotal == currentGame.boardSize || updiagonalTotal == currentGame.boardSize){
        currentGame.gameStatus = gameStatus.PLAYER1_WINNER;
    }
    else if(downdiagonalTotal == -currentGame.boardSize || upDiagonalCol == -currentGame.boardSize){
        currentGame.gameStatus = gameStatus.PLAYER2_WINNER;
    }
}

module.exports.game = game;
module.exports.gameStatus = gameStatus;
module.exports.gameCellFill = gameCellFill;
module.exports.drawCurrentBoard = drawCurrentBoard;
module.exports.move = move;
module.exports.getCurrentStatus = getCurrentStatus;
module.exports.checkForWinnerOrTie = checkForWinnerOrTie;