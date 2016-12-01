
var myWidth = 0, myHeight = 0, isOpen = 0, isFull = 0;editor = null;//获取浏览器高度和宽度,高亮代码编辑器


function screenResize(){
    if(typeof( $(window).innerWidth()) == 'number' ) {
        //Non-IE
        myWidth = $(window).innerWidth();
        myHeight = $(window).innerHeight();
    } 
    else if(document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight)){
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;  
    }
    window.onresize = function () 
    { 
        if( typeof( $(window).innerWidth() ) == 'number' ) {
            //Non-IE
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } 
        else if(document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight)){
            //IE 6+ in 'standards compliant mode'
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;  
        }
        mapheight();
    } 
}
/** 设置地图容器宽度 **/
function mapheight(){
    $("#container").width(myWidth - $("#menu")[0].offsetWidth - $("#code_area")[0].offsetWidth -5);
    $("#container").height(myHeight - 50);
}

/**设置显示源码的拖拽效果**/
function dragCode(){
    
}

/**页面初始化**/
(function(){
    dragCode();
    screenResize();

    $("#drag").mousedown(function(){
        document.onselectstart = function(){return false;};
        document.onmousemove = function(e){
            var bottomX = (e||window.event).clientX -281;
            if($("#overiframe").is(":hidden")==true){
                $("#overiframe").show();
            }
            if(bottomX <=0){
                bottomX = 0;
            }
            if(bottomX >= myWidth - 287){
                bottomX = myWidth - 287;
            }
            $("#code_area").width(bottomX);
            //$("#myresource").width(bottomX*0.8);
            $("#container").width(myWidth - bottomX -287);
            $("#overiframe").width(myWidth - bottomX -287);
        };
        document.onmouseup=function(){
            document.onmousemove=null;
            $("#overiframe").hide();
            //codeChange();           
            //init();
        };
    });
    
})();