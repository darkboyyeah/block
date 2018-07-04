var activeBlock; // 当前活动的图形
var tb = document.getElementById('area'); // 方块活动区域
var score=0; // 分数
var timer; // 定时器
var area = new Array(18); //area 为18*10的数组，来判断当前表格中是否有方块。有方块，值为1，没有就为0，默认值是0；
for (var i = 0; i < 18; i++) {
  area[i] = new Array(10);
}
for (var i = 0; i < 18; i++) {
  for (var j = 0; j < 10; j++) {
    area[i][j] = 0;
  }
}
// 开始游戏
begin();
function begin(e) {
  generateBlock();
  paint();
  timer = setInterval(moveDown, 1000); //每秒自动下移一格
  document.onkeydown=keyControl;  //监听键盘按键按下事件

}
// 生成方块的形状，有7中基本状态
function generateBlock() {
  activeBlock = new Array(4); //用来存放方块的位置
  // 随机产生0-6的整数，对应7种图形。
  var t = (Math.floor(Math.random() * 20) + 1) % 7;
  switch (t) {
      case 0:{ 
        activeBlock[0] = {x:0, y:4}; 
        activeBlock[1] = {x:1, y:4}; 
        activeBlock[2] = {x:0, y:5}; 
        activeBlock[3] = {x:1, y:5}; 

        break; 
    } 
    case 1:{ 
        activeBlock[0] = {x:0, y:3}; 
        activeBlock[1] = {x:0, y:4}; 
        activeBlock[2] = {x:0, y:5}; 
        activeBlock[3] = {x:0, y:6}; 
        break; 
    } 
    case 2:{ 
        activeBlock[0] = {x:0, y:5}; 
        activeBlock[1] = {x:1, y:4}; 
        activeBlock[2] = {x:1, y:5}; 
        activeBlock[3] = {x:2, y:4}; 
        break; 
    } 
    case 3:{ 
        activeBlock[0] = {x:0, y:4}; 
        activeBlock[1] = {x:1, y:4}; 
        activeBlock[2] = {x:1, y:5}; 
        activeBlock[3] = {x:2, y:5}; 
        break; 
    } 
    case 4:{ 
        activeBlock[0] = {x:0, y:4}; 
        activeBlock[1] = {x:1, y:4}; 
        activeBlock[2] = {x:1, y:5}; 
        activeBlock[3] = {x:1, y:6}; 
        break; 
    } 
    case 5:{ 
        activeBlock[0] = {x:0, y:4}; 
        activeBlock[1] = {x:1, y:4}; 
        activeBlock[2] = {x:2, y:4}; 
        activeBlock[3] = {x:2, y:5}; 
        break; 
    } 
    case 6:{ 
        activeBlock[0] = {x:0, y:5}; 
        activeBlock[1] = {x:1, y:4}; 
        activeBlock[2] = {x:1, y:5}; 
        activeBlock[3] = {x:1, y:6}; 
        break; 
    } 
  }
  // 检查刚生成的方块是否能放在初始位置
  for(var i=0;i<4;i++){
    if(!isCellValid(activeBlock[i].x,activeBlock[i].y)){
      return false;
    }
  }
  return true;

}
// 绘制图形
function paint() {
  for (var i = 0; i < 4; i++) {
    tb.rows[activeBlock[i].x].cells[activeBlock[i].y].style.backgroundColor = "green";
  }
}
// 擦除移动之前图形
function wipe() {
  for (var i = 0; i < 4; i++) {
    tb.rows[activeBlock[i].x].cells[activeBlock[i].y].style.backgroundColor = "white";
  }
}
// 更新area数组
function updateArea() {
  for(var i=0;i<4;i++){
    area[activeBlock[i].x][activeBlock[i].y]=1;
  }
}
// 向下移动
function moveDown() {
  //判断底边界
  if (isBottomBorder()) {
    // 没有触碰到底边
    // 擦除上一秒的图形
    wipe();
    // 更新当前图形坐标
    for (var i = 0; i < 4; i++) {
      activeBlock[i].x = activeBlock[i].x + 1;
    }
    paint();
    
  }else{
    // 触碰到底边
    clearInterval(timer);  //将定时器停止
    updateArea();  //  更新area数组
    // 消行
    var lines = removeRow();
    // 如果有消行，则更新分数
    if(lines!=0){
      score=score+10*lines;
      updateScore();  // 更新分数
      wipeAll();  // 清除整个游戏区域
      paintAll()  //  重新绘制区域内的方块
    }
    if(!generateBlock()){  // 生产方块，如果方块不能放在初始位置，结束游戏。
      alert('Game Over,Your score is:'+score);
      return;
    }
    paint();
    timer= setInterval(moveDown, 1000);
  }

}
// 消行
function removeRow() {
  var lines = 0;
  for(var i=0;i<18;i++){
    var j=0;
    for(;j<10;j++){
      if(area[i][j]==0){
        break; // 一行中只要有一个格子没有方块，就跳出循环，进入下一次循环。
      }
    }
    if(j==10){ // 当这一行遍历完(这一行的area的值全为1)
      lines++;
      if(i!=0){  // 而且这一行不是第一行
        for(var k=i-1;k>0;k--){
          area[k+1]=area[k];  // 用上一行，覆盖下面area值全为1的行
        }
      }
      area[0]=generateBlankRow();   // 在第一行补充一行area值全为0的行。
    }
  }
  return lines; 
}
// 生成一个空白行
function generateBlankRow(){
  var blank_row= new Array(10);
  for(var i=0;i<10;i++){
    blank_row[i] = 0;
  }
  return blank_row;
}
// 擦除整个游戏区域
function wipeAll(){
  for(var i=0;i<18;i++){
    for(var j=0;j<10;j++){
      tb.rows[i].cells[j].style.backgroundColor = 'white';
    }
  }
}
// 重绘整个游戏区域
function paintAll(){
  for(var i=0;i<18;i++){
    for(var j=0;j<10;j++){
      if(area[i][j]==1){
        tb.rows[i].cells[j].style.backgroundColor = 'green';
      }
    }
  }
}
// 更新分数，消玩一行之后，分数加10
function updateScore(){
  document.getElementsByClassName('score')[0].innerHTML = " "+score;
}
// 向左移动
function moveLeft() {
  if(isLeftBorder()){
    wipe(); // 擦除
    for(var i=0;i<4;i++){
      activeBlock[i].y=activeBlock[i].y-1;
    }
    paint(); //重绘
  }
}
// 向右移动
function moveRight() {
  if(isRightBorder()){
    wipe();  // 擦除
    for(var i=0;i<4;i++) {
      activeBlock[i].y=activeBlock[i].y+1;
    }
    paint();  //重绘
  }
}
// 旋转变换
function rotate(){
  // 创建tempBlock,将activeBlock里的内容拷贝到tempBlock中。
  // 将tempBlock旋转，然后判断旋转后是否会将其它已经有方块的方格给覆盖。
  // 如果没有以上冲突，就可以将旋转后的tempBlock赋值给activeBlock.擦除之前的，然后重绘。
  var tempBlock = new Array(4);
  for(var i=0;i<4;i++){
    tempBlock[i]={x:0,y:0};
  }
  for(var i=0;i<4;i++){
    tempBlock[i].x=activeBlock[i].x;
    tempBlock[i].y=activeBlock[i].y;
  }
  // 计算四个点的中心点
  var cx = Math.round((tempBlock[0].x+tempBlock[1].x+tempBlock[2].x+tempBlock[3].x)/4);
  var cy = Math.round((tempBlock[0].y+tempBlock[1].y+tempBlock[2].y+tempBlock[3].y)/4);
  // 计算围绕中心点旋转90°后的坐标
  for(var i=0;i<4;i++){
    tempBlock[i].x=cx+cy-activeBlock[i].y;
    tempBlock[i].y=cy-cx+activeBlock[i].x;
  }
  // 判断旋转后是否合法
  for(var i=0;i<4;i++){
    if(!isCellValid(tempBlock[i].x,tempBlock[i].y)){
      return;
    }
  }
  // 合法，就擦除该方块
  wipe();
  // 对activeBlock重新赋值
  for(var i=0;i<4;i++){
    activeBlock[i].x=tempBlock[i].x;
    activeBlock[i].y=tempBlock[i].y;
  }
  // 重绘旋转后方块
  paint();
}
// 底边界，判断方块是否下落到底部
function isBottomBorder() {
  for (var i = 0; i < 4; i++) {
    if (activeBlock[i].x == 17) {
      return false;
    }
    if(!isCellValid(activeBlock[i].x+1,activeBlock[i].y)){
      return false;
    }
  }
  return true;
}
// 左边界
function isLeftBorder() {
  for(var i=0;i<4;i++){
    if(activeBlock[i].y==0){
      return false;
    }
    if(!isCellValid(activeBlock[i].x,activeBlock[i].y-1)){
      return false;
    }
  }
  return true;
}
// 右边界
function isRightBorder(){
  for(var i=0;i<4;i++){
    if(activeBlock[i].y==9){
      return false;
    }
    if(!isCellValid(activeBlock[i].x,activeBlock[i].y+1)){
      return false;
    }
  }
  return true;
}
// 判断方块的坐标合法性
function isCellValid(x,y) {
  if(x>17||x<0||y>9||y<0) {
    return false;
  }
  if(area[x][y]==1){
    // 判断该位置是否存在方块
    return false;
  }
  return true;
}
// 键盘控制
function keyControl(){
  var code = event.keyCode;
  // console.log(code)
  switch(code) {
    case 37:{
      moveLeft();
      break;
    }
    case 38:{
      rotate();
      break;
    }
    case 39:{
      moveRight();
      break;
    }
    case 40:{
      moveDown();
      break;
    }
  }
}
