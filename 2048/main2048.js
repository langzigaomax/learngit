 var board=new Array();/*存放游戏数据的部分*/
 var score=0;
 var hasConflicted = new Array();/*每次只生成一次碰撞*/
/*当整个程序加载完毕运行这个主函数*/
 $(document).ready(function(){
    newgame();
 }
 );

 function newgame(){
    //初始化棋盘格
    init();
    //生成两个随机数字
    generateOneNumber();
    generateOneNumber();/*要生成两个初始数字所以调用两次*/
 }

 function init(){

    for(var i=0;i<4;i++)
    	for (var j=0;j<4;j++){
    		var gridCell=$("#grid-cell-"+i+"-"+j);//通过id取得相应对象
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
    	}

    for(var i=0;i<4;i++){ /*二维化数组*/
    	board[i]=new Array();
    	hasConflicted[i] = new Array();
    	for(var j=0;j<4;j++)
    		board[i][j]=0;
    	/*初始化数组值为0*/
    	hasConflicted[i][j] = false;
    }

    updateBoardView();
    score = 0;
}/*通知前端 对numbercell里的元素进行显示设定*/

    function updateBoardView(){
           $(".number-cell").remove();
           for (var i=0;i<4;i++) 
           	for(var j=0;j<4;j++){

          $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
          var theNumberCell=$('#number-cell-'+i+'-'+j);
  
             if( board[i][j] == 0 ){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) +50 );
                theNumberCell.css('left',getPosLeft(i,j) +50 );
            }

 
          else{
          	theNumberCell.css('width','100px');
          	theNumberCell.css('height','100px');
          	theNumberCell.css('top',getPosTop(i,j));
          	theNumberCell.css('left',getPosLeft(i,j));
          	theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
            theNumberCell.css('color',getNumberColor(board[i][j]));/*文字的前景色*/
            theNumberCell.text(board[i][j]);/*显示数字*/
          }
          hasConflicted[i][j] = false;
    }
}

function generateOneNumber(){
  if(nospace(board))/*判断棋盘格子还能不能生成新的数字*/
  	return false;/*如果能生成就开始随机产生*/

//随机一个位置
var randx=parseInt(Math.floor(Math.random() *4));
var randy=parseInt(Math.floor(Math.random() *4));
   var times = 0;
    while( times < 50 ){                   //算法找空余 50次机会 找不到就转下面
        if( board[randx][randy] == 0 )
            break;

        randx = parseInt( Math.floor( Math.random()  * 4 ) );
        randy = parseInt( Math.floor( Math.random()  * 4 ) );

        times ++;
    }
    if( times == 50 ){                        //人工找空余位置
        for( var i = 0 ; i < 4 ; i ++ )
            for( var j = 0 ; j < 4 ; j ++ ){
                if( board[i][j] == 0 ){
                    randx = i;
                    randy = j;
                }
            }
    }

//随机一个数字2或者4
var randNumber=Math.random()<0.5 ? 2:4;/*小于50%的概率来在2或4里生成*/



//在随机位置显示随机数字
board[randx][randy]=randNumber;
showNumberWithAnimation(randx,randy,randNumber);/*动画效果函数*/

  	return true;
}

$(document).keydown( function( event ){/*玩家按下按键进行相应*/
    event.preventDefault();
    switch( event.keyCode ){
        case 37: //left
            if( moveLeft() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 38: //up
            if( moveUp() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39: //right
            if( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40: //down
            if( moveDown() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        default: //default
            break;
    }
});

function isgameover(){
    if( nospace( board ) && nomove( board ) ){
        gameover();
    }
}

function gameover(){
    alert('gameover!');
}


function moveLeft(){
	if(!canMoveLeft(board))
		return false;
	//begin move
for(var i=0;i<4;i++)
		for(var j=1;j<4;j++){
			if(board[i][j]!=0){
             
             for(var k=0;k<j;k++){
             	if(board[i][k]==0 && noBlockHorizontal(i, k, j, board)){
             		//move
             		showMoveAnimation(i ,j ,i ,k );
             		board[i][k]=board[i][j];
             		board[i][j]=0;
        
             		continue;
             	}
             	else if(board[i][k]==board[i][j] && noBlockHorizontal(i, k, j, board)&& !hasConflicted[i][k]){
             		//move
             		showMoveAnimation(i ,j ,i ,k );
             		//add
             		board[i][k]+=board[i][j];
             		board[i][j]=0;
             		//add 分数
             		score += board[i][k];
                     updateScore( score );
                     hasConflicted[i][j] = true;
             		continue;
             	}
             }

			}
		}
		setTimeout("updateBoardView()",200);
		return true;

}

function moveRight(){
    if( !canMoveRight(board) )
        return false;
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2 ; j >= 0 ; j -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > j ; k -- ){

                if( board[i][k] ==0 && noBlockHorizontal( i , k, j, board)){
                        //move
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j] && noBlockHorizontal(i, k, j, board)&& !hasConflicted[i][k]){
             		//move
             		showMoveAnimation(i ,j ,i ,k );
             		//add
             		board[i][k]+=board[i][j];
             		board[i][j]=0;
             		//add 分数
             		score += board[i][k];
                    updateScore( score );
                    hasConflicted[i][j] = true;
             		continue;
             			}
                }

			}
		}
		setTimeout("updateBoardView()",200);
		return true;
	}



function moveUp(){

    if( !canMoveUp( board ) )
        return false;

    //moveUp
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < i ; k ++ ){

                    if( board[k][j] == 0 && noBlockVertical( j , k , i , board ) ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , k , i , board )&& !hasConflicted[k][j]){

                    	//move
                        showMoveAnimation( i , j , k , j );
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0; 
             		  //add 分数
             		   score += board[i][k];
                       updateScore( score );
                       hasConflicted[k][j] = true;
                       continue;

                    }
                }
            }
        }
        setTimeout("updateBoardView()",200);
        return true;
    }



    function moveDown(){
if( !canMoveDown( board ) )
        return false;

    //moveDown
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > i ; k -- ){

                    if( board[k][j] == 0 && noBlockVertical( j , i , k , board ) ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , i , k , board )&& !hasConflicted[k][j]){
                        //move
                        showMoveAnimation( i , j , k , j );
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore( score );
                        //add 分数
             		    score += board[i][k];
                        updateScore( score );
                        hasConflicted[k][j] = true;
                        continue;

                       
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

    