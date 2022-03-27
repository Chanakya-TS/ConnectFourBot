let WIDTH = 400, HEIGHT = 400;

let cnv;

let board = [];
let winHorz = [], winVert = [];
let winAsc = [], winDsc = [];
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

function centerCanvas(){
  cnv.position((windowWidth - WIDTH) / 2, (windowHeight - HEIGHT) / 2);
}

function resetSketch(){
  board = [];
  winHorz = [];
  winVert = [];
  winAsc = [];
  winDsc = [];
  for(let i=0; i<BHEIGHT; i++){
    board[i] = [];
    winHorz[i] = [];
    winVert[i] = [];
    winAsc[i] = [];
    winDsc[i] = [];
    for(let j=0; j<BWIDTH; j++){
      board[i][j] = '';
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
  cnv = createCanvas(WIDTH, HEIGHT);
  centerCanvas();
  resetSketch();
}

function windowResized(){
  centerCanvas();
}

let prevHoverCol = -1;

function getLatestActive(col){
  let result = [-1, -1];
  for(let i=BHEIGHT-1; i>=0; i--){
    if(board[i][col] != 'r' && board[i][col] != 'y'){
      result[0] = i;
      result[1] = col;
      break;
    }
  }
  return result;
}

function draw() {
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
}

function isAvail(col){
  for(let row=BHEIGHT-1; row >= 0; row--){
    if(board[row][col] != 'r' && board[row][col] != 'y'){
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

function checkWin(coin){
  // Horizontal
  for(let i=0; i<BHEIGHT; i++){
    for(let j=0; j<BWIDTH-3; j++){
      let win = true;
      for(let k=1; k<4; k++){
        win &= board[i][j+k] == board[i][j+k-1] && board[i][j] == coin;
      }
      if(win){
        print("HORIZONTAL WIN");
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
        win &= board[i+k][j] == board[i+k-1][j] && board[i][j] == coin;
      }
      if(win){
        print("VERTICAL WIN");
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
        win &= board[i+k][j+k] == board[i+k-1][j+k-1] && board[i][j] == coin;
      }
      if(win){
        print("DSSC WIN");
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
        win &= board[i-k][j+k] == board[i-k+1][j+k-1] && board[i][j] == coin;
      }
      if(win){
        print("ASC WIN");
        winAsc[i][j] = 1;
        print(winHorz[i][j]);
        return true;
      }
    }
  }
}

function mouseClicked(){
  if(!gameOver){
    let col = int(mouseX / (WIDTH / BWIDTH));
    let coin = 'r';
    if(!redTurn) coin = 'y';
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
  }
}

function keyPressed(){
  if(key == 'r'){
    resetSketch();
  }
}