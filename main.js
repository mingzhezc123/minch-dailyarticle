/**
 * Created by Minzer on 2017/6/22.
 */
(function () {

  var oSearchText = document.querySelector(".search-article");//搜索框
  var articleTemp = '';//文章模板
  var articleTimeTemp = '';//文章时间模板
  var articleContent = document.querySelector(".article-content");//文章容器
  var btnRandom = document.querySelector(".random");//随机文章按钮
  var classNames = ["digest","title-content","line","article-main"];//要删除的节点类名


  // 搜索部分动画
  function searchAnimate(){
    var oSearchIcon = document.querySelector(".header-right img");//搜索图标
    var isShow = false;//节流开关
    oSearchIcon.addEventListener("click", function () {
      if (!isShow) {
        $.animate(oSearchText, {"right": 30}, 200, "Linear");
        isShow = true;
      } else {
        $.animate(oSearchText, {"right": -200}, 200, "Linear");
        isShow = false;
      }
    }, false);
  }

  // 加载模板
  function loadTemplate(templateName,templateString) {
    $.loadTemplate(templateName,function (err,data) {
      templateString = data;
    });
    return templateString;
  }

  // 处理文章
  function doArticle(err,result) {
    try{
      var dataJSON = JSON.parse(result);
      var timeJSON = dataJSON.data.date;
      var articleTimeTempNode = $.compile(articleTimeTemp,timeJSON);
      var articleTempNode = $.compile(articleTemp,dataJSON.data);
      articleContent.innerHTML += articleTimeTempNode;
      articleContent.innerHTML += articleTempNode;
    }catch(e){
      console.log(e.error);
    }
  }

  // 模板初始化
  function initTemp() {
    articleTimeTemp = loadTemplate("./template/articleTime.htm",articleTimeTemp);
    articleTemp = loadTemplate("./template/article.htm",articleTemp);
  }

  // 获取当天文章
  function getDailyArticle() {
    initTemp();
    $.get(
      "https://interface.meiriyiwen.com/article/today?dev=1",
      "",
      doArticle    // 处理当天文章
    );
  }

  // 获取随机文章
  function getRandomArticle() {
    initTemp();
    $.get(
      "https://interface.meiriyiwen.com/article/random?dev=1",
      "",
      doArticle    // 处理随机文章
    );
  }

  // 获取特定某一天文章
  function getSomedayArticle() {
    initTemp();
    var date = oSearchText.value;
    console.log(typeof date);
    if (Number(date) >= 20110308) {
      $.get(
        "https://interface.meiriyiwen.com/article/day",
        {"dev":1,"date":date},
        doArticle    // 处理特定某一天文章
      );
    }
  }

  // 删除节点
  function deleteNode() {
    for(var i=0;i<classNames.length;i++){
      var node = articleContent.getElementsByClassName(classNames[i])[0];
      articleContent.removeChild(node);
    }
  }

  // 随机一篇文章按钮
  btnRandom.addEventListener("click",function () {
    deleteNode();
    getRandomArticle();
  },false);

  // 搜索特定某一天的文章
  oSearchText.addEventListener("keyup",function (event) {
    event = event || window.event;
    if(event.keyCode === 13){
      var date = Number(this.value);
      if(date >= 20110308){ 
        deleteNode();
        getSomedayArticle();
        oSearchText.value = null;      
      }else {
        oSearchText.value = '请搜索2011年3月8日及以后文章';
      }
    }
  },false);

  window.onload = function() {
    searchAnimate();
    getDailyArticle();
  };

})();