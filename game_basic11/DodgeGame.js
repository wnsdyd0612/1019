window.addEventListener("load", drawScreen, false);
window.addEventListener("keydown", onkeydown, true);

var GAME_STATE_READY = 0; // 준비
var GAME_STATE_GAME = 1;  // 게임 중
var GAME_STATE_OVER = 2;  // 게임 오버

// 게임 상태값을 저장하는 변수
var GameState = GAME_STATE_READY; // 초깃값은 준비 상태

var imgBackground = new Image();
imgBackground.src = "img/background.png";
imgBackground.addEventListener("load", drawScreen, false);

var imgPlayer = new Image();
imgPlayer.src = "img/player.png";
imgPlayer.addEventListener("load", drawScreen, false);

var intPlayerX = 350;
var intPlayerY = 250;

var tempMissile1 = {x:0, y:0, go_x:1, go_y:1};
var tempMissile2 = {x:800, y:0, go_x:-1, go_y:1};
var tempMissile3 = {x:800, y:600, go_x:-1, go_y:-1};
var tempMissile4 = {x:0, y:600, go_x:1, go_y:-1};

var imgMissile = new Image();
imgMissile.src = "img/missile.png"

var intervalID;

function onGameStart()
{
  //게임 시작
  GameState = GAME_STATE_GAME;
  //intervalID = setInterval(MoveMissile, 100);
  intervalID = setInterval(InGameUpdate, 100);
  //초기 총알 랜덤 생성
  //초기 총알 랜덤 생성
  for(var i = 0; i<50; i++)
  {
    var MissileType = RandomNext(4);
    var intX, intY, intGoX, intGoY;
    switch(MissileType)
    {
      case 1: //왼쪽 총알
        intX = 0;
        intY = RandomNext(600);
        intGoX = RandomNext(2);
        intGoY = -2 + RandomNext(4);
        break;
      case 2: //왼쪽 총알
        intX = 800;
        intY = RandomNext(600);
        intGoX = -RandomNext(2);
        intGoY = -2 + RandomNext(4);
        break;
      case 3: //위쪽 총알
        intX = RandomNext(800);
        intY = 0
        intGoX = -2 + RandomNext(4);
        intGoY = RandomNext(2);
        break;
      case 4: //아래쪽 총알
        intX = RandomNext(800);
        intY = 600;
        intGoX = -2 + RandomNext(2);
        intGoY = -RandomNext(4);
        break;
    };

    arrMissiles.push({x:intX, y:intY, go_x:intGoX, go_y:intGoY});
  }  
}
  
function onGameOver(){
  GameState = GAME_STATE_OVER;
  clearInterval(intervalID);
}
function onReady()
{
  //게임준비
  GameState = GAME_STATE_READY;

  //타이머 초기화
  intTime = 0;

  //플레이어 위치 초기화
  intPlayerX = 350;
  intPlayerY = 250;

  //총알 리스트 초기화
  while(arrMissiles.length != 0)
  {
    arrMissiles.pop();
  }
}

function MoveMissile()
{
  //총알 이동 처리
  for(var i =0; i < arrMissiles.length; i++){
    arrMissiles[i].x += arrMissiles[i].go_x * 3;
    arrMissiles[i].y += arrMissiles[i].go_y * 3;
    if(IsCollisionWithPlayer(arrMissiles[i].x, arrMissiles[i].y)){
      //충돌 시 게임 오버
      onGameOver();
    }
    //총알이 화면 밖으로 나갈 경우 정보를 새로 갱신해준다.
    if(arrMissiles[i].x < 0 || arrMissiles[i].x > 800 || arrMissiles[i].y < 0 || arrMissiles[i].y > 600)
    {
      var MissileType = RandomNextInt(4);
      switch(MissileType)
      {
        case 1: //왼쪽 총알
          arrMissiles[i].x = 0;
          arrMissiles[i].y = RandomNextInt(600);
          arrMissiles[i].go_x = RandomNextInt(2);
          arrMissiles[i].go_y = -2 + RandomNextInt(4);
          break;
        case 2: //오른쪽 총알
          arrMissiles[i].x = 800;
          arrMissiles[i].y = RandomNextInt(600);
          arrMissiles[i].go_x = -RandomNextInt(2);
          arrMissiles[i].go_y = -2 + RandomNextInt(4);
          break;
        case 3: //위쪽 총알
          arrMissiles[i].x = RandomNextInt(600);
          arrMissiles[i].y = 0;
          arrMissiles[i].go_x = -2 + RandomNextInt(4);
          arrMissiles[i].go_y = RandomNextInt(2);
          break;
        case 4: //아래쪽 총알
          arrMissiles[i].x = RandomNextInt(600);
          arrMissiles[i].y = 600;
          arrMissiles[i].go_x = -2 + RandomNextInt(4);
          arrMissiles[i].go_y = -RandomNextInt(2);
          break;
      }
    }
  }

  //화면 갱신
  drawScreen();
}
function drawScreen()
{
  var theCanvas = document.getElementById("GameCanvas");
  var Context  = theCanvas.getContext("2d");

  Context.fillStyle = "#000000";
  Context.fillRect(0, 0, 800, 600);  
  
  // 배경 화면 그리기
  Context.drawImage(imgBackground,0,0);
  
  // 플레이어 그리기
  Context.drawImage(imgPlayer, intPlayerX, intPlayerY); 
  
  Context.fillStyle    = "#ffffff"; 
  Context.font     = '50px Arial'; 
  Context.textBaseline = "top";
  
  // 게임 준비 중
  if( GameState == GAME_STATE_READY )  {
    Context.fillText( "준비", 330, 180  );
  }

    // 게임 중
  else if( GameState == GAME_STATE_GAME )  {
    for(var i = 0; i < arrMissiles.length; i++)    {
      Context.drawImage(imgMissile, arrMissiles[i].x, arrMissiles[i].y);
    }
  }
  // 게임 오버
   else if( GameState == GAME_STATE_OVER )
  {
    for(var i = 0; i < arrMissiles.length; i++)
    {
      Context.drawImage(imgMissile, arrMissiles[i].x, arrMissiles[i].y);
    }
    Context.fillText( "게임 오버", 330, 180  );   
  }

  Context.font = '20px Arial';
  Context.fillText("Time : " + intTime /100, 20, 5);
  Context.fillText("총알 수 : ", 680, 5);
  
}
function onkeydown(e) 
{
  // 게임 준비 중
  if( GameState == GAME_STATE_READY )
  {
    // 게임을 시작합니다
    if( e.keyCode == 13 )
    {
      // 엔터를 입력하면 게임시작
      GameState = GAME_STATE_GAME;
      onGameStart();
    }
  }
  // 게임 중
  else if( GameState == GAME_STATE_GAME )
  {
    // 기존의 플레이어 이동 처리 코드
    switch( e.keyCode )    {
      case 37: // LEFT
        intPlayerX-=5;
        if( intPlayerX < 0 ) {
          intPlayerX = 0;
        } 
      break;
      case 39: // RIGHT
        intPlayerX+=5;
        if( intPlayerX > 740 ) {
          intPlayerX = 740;
        }       
      break;
      case 38: // UP
        intPlayerY-=5;
        if( intPlayerY < 0 ) {
          intPlayerY = 0;
        } 
      break;
      case 40: // DOWN
        intPlayerY+=5;
        if( intPlayerY > 540 ) {
          intPlayerY = 540;
        }   
      break;
    };
  }
    // 게임 오버
  else if( GameState == GAME_STATE_OVER )  {
    // 게임 준비 상태로 변경
    if( e.keyCode == 13 )    {
      // 엔터를 입력하면 준비 상태로
      onReady();
    }
  }
  // 화면 갱신
  drawScreen();
}
function IsCollisionWithPlayer(x, y)
{
  if((intPlayerX+55) > (x+5) && (intPlayerX + 5) < (x + 25) && (intPlayerY + 5) < (y + 25) && (intPlayerY + 55) > (y + 5)){
    return true;
  } 
  return false;
}

var arrMissiles = new  Array();

function RandomNext(max)
{
  return 1+Math.floor(Math.random()*max);
}

var intTime = 0; //플레이 시간을 저장할 변수

function InGameUpdate()
{
  //시간 체크
  intTime += 100;
  //총알 이동 처리
  MoveMissile();
}





