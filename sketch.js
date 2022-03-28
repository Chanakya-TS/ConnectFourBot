let WIDTH = 400, HEIGHT = 400;

let cnv;
let scorecnv;

let board = [], boardC = [];
let winHorz = [], winVert = [];
let winAsc = [], winDsc = [];
let rowVals = [];
let BWIDTH = 7, BHEIGHT = 6;
let CSIZE_H = HEIGHT / BHEIGHT, CSIZE_W = WIDTH / BWIDTH;
let COINRAD = 40;
let WINRAD = 50;

let WHITE = [255, 255, 255];
let RED = [255, 38, 73];
let REDA = [251, 103, 128];
let YELLOW = [255, 236, 108];
let YELLOWA = [255, 242, 158];
let BLUE = [33, 161, 255];

let redTurn = true;
let gameOver = false;

let useAI = true;
let mxDepth = 9;

let cache = {};

function centerCanvas(){
  cnv.position((windowWidth - WIDTH) / 2, (windowHeight - HEIGHT) / 2);
}

function resetSketch(){
  board = [];
  boardC = [];
  winHorz = [];
  winVert = [];
  winAsc = [];
  winDsc = [];
  rowVals = [];
  for(let i=0; i<BWIDTH; i++){
    rowVals.push("NA");
  }
  for(let i=0; i<BHEIGHT; i++){
    board[i] = [];
    boardC[i] = [];
    winHorz[i] = [];
    winVert[i] = [];
    winAsc[i] = [];
    winDsc[i] = [];
    for(let j=0; j<BWIDTH; j++){
      board[i][j] = '';
      boardC[i][j] = '';
      winHorz[i][j] = 0;
      winVert[i][j] = 0;
      winAsc[i][j] = 0;
      winDsc[i][j] = 0;
    }
  }
  redTurn = true;
  gameOver = false;
}

let title, restart;

function setup() {
  title = createDiv("Connect Four!");
  title.style('text-align', 'center');
  title.style('padding-top', '70px');
  title.style('font-size', '30px');
  title.style('font-family', 'Arial, Helvetica, sans-serif')

  restart = createDiv("Press 'r' to restart");
  restart.style('text-align', 'center');
  restart.style('padding-top', '10px');
  restart.style('font-family', 'Arial, Helvetica, sans-serif')
  cnv = createCanvas(WIDTH, HEIGHT+100);
  centerCanvas();
  resetSketch();
}

function windowResized(){
  centerCanvas();
}

let prevHoverCol = -1;

function getLatestActive(col, useCopy = false){
  let result = [-1, -1];
  for(let i=BHEIGHT-1; i>=0; i--){
    if(!useCopy && board[i][col] != 'r' && board[i][col] != 'y'){
      result[0] = i;
      result[1] = col;
      break;
    }
    if(useCopy && boardC[i][col] != 'r' && boardC[i][col] != 'y'){
      result[0] = i;
      result[1] = col;
      break;
    }
  }
  return result;
}

function draw() {
  background(255, 255, 255);
  fill(BLUE);
  strokeWeight(0);
  rect(0, 0, WIDTH, HEIGHT, 20);
  if(!gameOver){
    let hoverCol = int(mouseX / (WIDTH / BWIDTH));
    let coin = 'yh';
    if(redTurn) coin = 'rh';
    for(let j=0; j<BWIDTH; j++){
      let pos = getLatestActive(j);
      if(j != hoverCol){
        if(pos[0] != -1)
          board[pos[0]][pos[1]] = '';
      } else {
        if(pos[0] != -1)
          board[pos[0]][pos[1]] = coin;
      }
    }
  }
  for(let i = 0; i<BHEIGHT; i++){
    for(let j=0; j<BWIDTH; j++){
      let color = WHITE;
      if(board[i][j] == 'r') {
        color = RED;
      }
      else if(board[i][j] == 'y') {
        color = YELLOW;
      } else if(board[i][j] == 'rh'){
        color = REDA;
      } else if(board[i][j] == 'yh'){
        color = YELLOWA;
      }
      fill(color);
      strokeWeight(0);
      ellipse(j*CSIZE_W + CSIZE_W * 0.5, i*CSIZE_H + CSIZE_H * 0.5, COINRAD);
    }
  }
  // Horizontal Win
  for(let i=0; i<BHEIGHT; i++){
    for(let j=0; j<BWIDTH; j++){
      if(winHorz[i][j]){
        noFill();
        strokeWeight(2);
        arc(j*CSIZE_W + CSIZE_W * 0.5, i*CSIZE_H + CSIZE_H * 0.5, WINRAD, WINRAD,HALF_PI, PI + HALF_PI);
        arc((j+3)*CSIZE_W + CSIZE_W * 0.5, (i)*CSIZE_H + CSIZE_H * 0.5, WINRAD, WINRAD,PI + HALF_PI, HALF_PI);
        line(j*CSIZE_W + CSIZE_W * 0.5, i*CSIZE_H + CSIZE_H * 0.5 - WINRAD / 2, (j+3)*CSIZE_W + CSIZE_W * 0.5, i*CSIZE_H + CSIZE_H * 0.5 - WINRAD/2)
        line(j*CSIZE_W + CSIZE_W * 0.5, i*CSIZE_H + CSIZE_H * 0.5 + WINRAD / 2, (j+3)*CSIZE_W + CSIZE_W * 0.5, i*CSIZE_H + CSIZE_H * 0.5 + WINRAD/2)
      }
    }
  }
  // Vertical Win
  for(let i=0; i<BHEIGHT; i++){
    for(let j=0; j<BWIDTH; j++){
      if(winVert[i][j]){
        noFill();
        strokeWeight(2);
        arc(j*CSIZE_W + CSIZE_W * 0.5, i*CSIZE_H + CSIZE_H * 0.5, WINRAD, WINRAD,PI, 2*PI);
        arc((j)*CSIZE_W + CSIZE_W * 0.5, (i+3)*CSIZE_H + CSIZE_H * 0.5, WINRAD, WINRAD,2*PI, PI);
        line(j*CSIZE_W + CSIZE_W * 0.5 - WINRAD / 2, i*CSIZE_H + CSIZE_H * 0.5, (j)*CSIZE_W + CSIZE_W * 0.5 - WINRAD/2, (i+3)*CSIZE_H + CSIZE_H * 0.5)
        line(j*CSIZE_W + CSIZE_W * 0.5 + WINRAD / 2, i*CSIZE_H + CSIZE_H * 0.5, (j)*CSIZE_W + CSIZE_W * 0.5 + WINRAD/2, (i+3)*CSIZE_H + CSIZE_H * 0.5)
      }
    }
  }
  // Ascending Win
  for(let i=0; i<BHEIGHT; i++){
    for(let j=0; j<BWIDTH; j++){
      if(winAsc[i][j]){
        noFill();
        strokeWeight(2);
        arc(j*CSIZE_W + CSIZE_W * 0.5, i*CSIZE_H + CSIZE_H * 0.5, WINRAD, WINRAD,QUARTER_PI, PI + QUARTER_PI);
        arc((j+3)*CSIZE_W + CSIZE_W * 0.5, (i-3)*CSIZE_H + CSIZE_H * 0.5, WINRAD, WINRAD, QUARTER_PI + PI, QUARTER_PI);
        line(j*CSIZE_W + CSIZE_W * 0.5 - (sin(QUARTER_PI) * WINRAD / 2), i*CSIZE_H + CSIZE_H * 0.5 - (cos(QUARTER_PI) * WINRAD/2), (j+3)*CSIZE_W + CSIZE_W * 0.5 - (sin(QUARTER_PI) * WINRAD / 2), (i-3)*CSIZE_H + CSIZE_H * 0.5 - (cos(QUARTER_PI) * WINRAD/2));
        line(j*CSIZE_W + CSIZE_W * 0.5 + (sin(QUARTER_PI) * WINRAD / 2), i*CSIZE_H + CSIZE_H * 0.5 + (cos(QUARTER_PI) * WINRAD/2), (j+3)*CSIZE_W + CSIZE_W * 0.5 + (sin(QUARTER_PI) * WINRAD / 2), (i-3)*CSIZE_H + CSIZE_H * 0.5+ (cos(QUARTER_PI) * WINRAD/2));
      }
    }
  }
  // Descending Win
  for(let i=0; i<BHEIGHT; i++){
    for(let j=0; j<BWIDTH; j++){
      if(winDsc[i][j]){
        noFill();
        strokeWeight(2);
        arc(j*CSIZE_W + CSIZE_W * 0.5, i*CSIZE_H + CSIZE_H * 0.5, WINRAD, WINRAD,HALF_PI + QUARTER_PI, PI + HALF_PI + QUARTER_PI);
        arc((j+3)*CSIZE_W + CSIZE_W * 0.5, (i+3)*CSIZE_H + CSIZE_H * 0.5, WINRAD, WINRAD, QUARTER_PI + PI + HALF_PI, QUARTER_PI + HALF_PI);
        line(j*CSIZE_W + CSIZE_W * 0.5 - (cos(QUARTER_PI) * WINRAD / 2), i*CSIZE_H + CSIZE_H * 0.5 + (sin(QUARTER_PI) * WINRAD/2), (j+3)*CSIZE_W + CSIZE_W * 0.5 - (cos(QUARTER_PI) * WINRAD / 2), (i+3)*CSIZE_H + CSIZE_H * 0.5 + (sin(QUARTER_PI) * WINRAD/2));
        line(j*CSIZE_W + CSIZE_W * 0.5 + (cos(QUARTER_PI) * WINRAD / 2), i*CSIZE_H + CSIZE_H * 0.5 - (sin(QUARTER_PI) * WINRAD/2), (j+3)*CSIZE_W + CSIZE_W * 0.5 + (cos(QUARTER_PI) * WINRAD / 2), (i+3)*CSIZE_H + CSIZE_H * 0.5 - (sin(QUARTER_PI) * WINRAD/2));
      }
    }
  }
  for(let i=0; i<BWIDTH; i++){
    textSize(20);
    fill(0, 0, 0);
    text(rowVals[i], i * CSIZE_W + CSIZE_W * 0.5 , HEIGHT + 25);
    textAlign('center');
  }
}

function isAvail(col, useCopy = false){
  for(let row=BHEIGHT-1; row >= 0; row--){
    if(!useCopy && board[row][col] != 'r' && board[row][col] != 'y'){
      return true;
    }
    if(useCopy && boardC[row][col] != 'r' && boardC[row][col] != 'y'){
      return true;
    }
  }
  return false;
}

function placeCoin(col, coin){
  for(let row=BHEIGHT-1; row >= 0; row--){
    if(board[row][col] != 'r' && board[row][col] != 'y'){
      board[row][col] = coin;
      return;
    }
  }
}

function checkWin(coin, draw = true, useCopy = false){
  // Horizontal
  for(let i=0; i<BHEIGHT; i++){
    for(let j=0; j<BWIDTH-3; j++){
      let win = true;
      for(let k=1; k<4; k++){
        if(!useCopy)
          win &= board[i][j+k] == board[i][j+k-1] && board[i][j] == coin;
        else 
          win &= boardC[i][j+k] == boardC[i][j+k-1] && boardC[i][j] == coin;
      }
      if(win){
        if(draw)
          winHorz[i][j] = 1;
        return true;
      }
    }
  }
  // Vertical
  for(let i=0; i<BHEIGHT-3; i++){
    for(let j=0; j<BWIDTH; j++){
      let win = true;
      for(let k=1; k<4; k++){
        if(!useCopy)
          win &= board[i+k][j] == board[i+k-1][j] && board[i][j] == coin;
        else 
          win &= boardC[i+k][j] == boardC[i+k-1][j] && boardC[i][j] == coin;
      }
      if(win){
        if(draw)
          winVert[i][j] = 1;
        return true;
      }
    }
  }
  // Descending
  for(let i=0; i<BHEIGHT-3; i++){
    for(let j=0; j<BWIDTH-3; j++){
      let win = true;
      for(let k=1; k<4; k++){
        if(!useCopy)
          win &= board[i+k][j+k] == board[i+k-1][j+k-1] && board[i][j] == coin;
        else
          win &= boardC[i+k][j+k] == boardC[i+k-1][j+k-1] && boardC[i][j] == coin;
      }
      if(win){
        if(draw)
          winDsc[i][j] = 1;
        return true;
      }
    }
  }
  // Ascending
  for(let i=3; i<BHEIGHT; i++){
    for(let j=0; j<BWIDTH-3; j++){
      let win = true;
      for(let k=1; k<4; k++){
        if(!useCopy)
          win &= board[i-k][j+k] == board[i-k+1][j+k-1] && board[i][j] == coin;
        else
          win &= boardC[i-k][j+k] == boardC[i-k+1][j+k-1] && boardC[i][j] == coin;
      }
      if(win){
        if(draw)
          winAsc[i][j] = 1;
        return true;
      }
    }
  }
  return false;
}

function chooseBest(player, depth, alpha, beta){
    if([boardC, player] in cache){
      return cache[[boardC, player]];
    }
    if(checkWin('y', false, true)){
      return 100 - depth;
    } else if(checkWin('r', false, true)){
      return -100 - depth;
    }
    let moves = [];
    for(let i=0; i<BWIDTH; i++){
      if(isAvail(i, true)){
        moves.push(i);
      }
    }
    if(moves.length == 0) return 0;
    if(depth >= mxDepth) return 0;
    // Maximising
    let best;
    if(player){
      best = -1e9;
      for(let i=0; i<moves.length; i++){
        let row = getLatestActive(moves[i], true)[0];
        boardC[row][moves[i]] = 'y';
        best = max(best, chooseBest(0, depth+1, alpha, beta));
        boardC[row][moves[i]] = '';
        alpha = max(alpha, best);
        if(alpha >= beta){
          break;
        }
      }
    } else {
      best =  1e9;
      for(let i=0; i<moves.length; i++){
        let row = getLatestActive(moves[i], true)[0];
        boardC[row][moves[i]] = 'r';
        best = min(best, chooseBest(1, depth+1, alpha, beta));
        boardC[row][moves[i]] = '';
        beta = min(beta, best);
        if(alpha >= beta){
          break;
        }
      }
    }
    cache[[boardC,player]] = best;
    return best;
}

function minMax(){
    let moves = [];
    for(let i=0; i<BWIDTH; i++){
      if(isAvail(i, true)){
        moves.push(i);
      }
    }
    for(let i=0; i<BWIDTH; i++){
      rowVals[i] = 'NA';
    }
    let bestMoves = [], bestVal = -1e9;
    for(let i=0; i<moves.length; i++){
      let row = getLatestActive(moves[i], true)[0];
      boardC[row][moves[i]] = 'y';
      let cur = chooseBest(0, 0, -1e9, 1e9);
      rowVals[moves[i]] = cur;
      boardC[row][moves[i]] = '';
      if(bestVal == cur){
        bestMoves.push(moves[i]);
      } else if(bestVal < cur){
        bestVal = cur;
        bestMoves = [];
        bestMoves.push(moves[i]);
      }
    }
    return random(bestMoves);
}

function aiMove(){
  if(!useAI){
    let moves = [];
    for(let i=0; i<BWIDTH; i++){
      if(isAvail(i)){
        moves.push(i);
      }
    }
    return random(moves);
  } else {
    for(let i=0; i<BHEIGHT; i++){
      for(let j=0; j<BWIDTH; j++){
        if(board[i][j] == 'r') boardC[i][j] = 'r';
        else if(board[i][j] == 'y') boardC[i][j] = 'y';
      }
    }
    return minMax();
  }
}

function mouseClicked(){
  if(!gameOver && mouseX >= 0 && mouseX <= WIDTH){
    let col = int(mouseX / (WIDTH / BWIDTH));
    let coin = 'r';
    if(isAvail(col)){
      placeCoin(col, coin);
      if(checkWin('r')){
        gameOver = true;
      }
      else if(checkWin('y')){
        gameOver = true;
      }
      redTurn ^= 1;
    }
    
    if(!redTurn && !gameOver){
      let result = aiMove();
      placeCoin(result, 'y');
      if(checkWin('r')){
        gameOver = true;
      }
      else if(checkWin('y')){
        gameOver = true;
      }
      redTurn ^= 1;
    }
  }
}

function keyPressed(){
  if(key == 'r'){
    resetSketch();
  }
}