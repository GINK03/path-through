/*chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(changeInfo && changeInfo.status == "complete"){
    chrome.tabs.executeScript(tabId, {file: "jquery.js"}, function(){
      chrome.tabs.executeScript(tabId, {file: "script.js"});
   });
  }
});*/

$(function(){
  window.PT = {
    helloworld: function(){ alert("HelloWorld"); }
  };
  //* 現在閲覧中のURLを保存する,　キーとなる時間を保存する
  //* 
  var nowURL = window.location.href;
  var timeKey = (new Date()).toString();
  var title = document.title;
  function saveChanges() {
        // Get a value saved in a form.
        // Check that there's some code there.
        if (!nowURL) {
          console.log('Error: No value specified');
          return true;
        }
        // Save it using the Chrome extension storage API.
        chrome.storage.local.get("mkey",function(obj){
          console.log(obj);
          if( obj == {}) return false;
          if( obj["mkey"] == null) obj["mkey"] = {timeKey:["",0,"title"]};
          obj["mkey"][timeKey] = ["",0,"title"];
          obj["mkey"][timeKey][0] = nowURL;
          obj["mkey"][timeKey][2] = title;
          chrome.storage.local.set(obj, function() {
           // Notify that we saved.
           console.log(obj, 'Settings saved');
          });
          return true;
        });
  }
  // 経過時間を記録する
  // 経過時間はtimeKeyにsuffixであるteをつけたもの
  var _timeCounter = 0;
  function inLoop(){
    setTimeout(function(){
      //console.log("MMMM", _timeCounter);
      _timeCounter += 1;
      chrome.storage.local.get("mkey",function(obj){
        console.log(obj);
        obj["mkey"][timeKey][1] = _timeCounter;
        chrome.storage.local.set(obj, function() {
        // Notify that we saved.
        // console.log(obj, 'elapsed time saved', nowURL);
        });
      });
      inLoop();
    },  1000);
  };
  // ソーシャルボタンは使用しない
  // window == parent でiframeを許可しない
  if( window==parent ) {
    // LocalStrageが何もなかった場合、新規に必要なオブジェクトを作成し、保存する
    // ただし、未テスト
    if( saveChanges() == false ) {
      chrome.storage.local.set({"mkey":[{timeKey:[nowURL,0]}]}, function() {
        console.log('New Object Created');
      });
    };
    // inLoopを発火する
    inLoop();
  }
  //chrome.alarms.onAlarm.addListener(function(alarm){
  //  console.log("MMMM");
  //}); 
  //chrome.alarms.create("Start", {periodInMinutes:1});

  var  _block_classes = [];
  _block_classes.push('yjAdImage');
  //alert(_location);
  if( location.href.match(/yahoo\.co\.jp/) ){
    //alert("this site is yahoo");
    for( var mute in _block_classes ) {
      $('.' + mute).css({'display':'none'});
    }
  }
  //$('html').innerHTML = $('html').innerHTML.replace(/\d/g,"丸重万歳。");
  //$('html')[0].innerHTML = $('html')[0].innerHTML.replace(/^[\u3040-\u30ff]+$/g,"丸重万歳。");
  // chromeマニアのロゴを描画
  $('.itemsShowHeader').css('background-color','red');
  $('body').append('<div class="chrome-mania">Chrome-Mania</div>');
  $('.chrome-mania').css({
    'top': '0px',
    'position': 'fixed',
    'z-index': '999',
    'width': '30px',
    'height': '30px',
    'padding':'10px',
    'margin':'10px',
    'opacity': '0.4',
    'background-color':'green',
    'border-radius': '5px 5px 5px 5px'
  });
  
  $('body').append('<div class="chrome-maniaModal"></div>');
  $('.chrome-maniaModal').css({
    'z-index':'1',
    'display':'none',
    'position':'fixed',
    'top':'0',
    'left':'0',
    'width':'100%',
    'height':'120%',
    'background-color':'rgba(0,0,0,0.75)'
  });  
  $('body').append('<div class="chrome-maniaModalContent"></div>');
  $('.chrome-maniaModalContent').css({
    'z-index':'2',
    'display':'none',
    'top':'10px',
    'left':'12.5%',
    'width':'75%',
    'height': '100%',
    'position':'fixed',
    'background-color':'white',
    'overflow': 'scroll',
    'border-radius': '5px 5px 5px 5px'
  });  
  // クリックされたらモーダルウィンドウを表示
  // モーダルウィンドウにはあらゆる観測情報を見やすく加工して、置いておく
  // localStrageの時系列データを逆順にして表示する
  $('.chrome-mania').click(function(){
    console.log("clicked!");
    if( $('.chrome-maniaModal').css('display') == 'none') {
      $('.chrome-maniaModal').fadeIn('slow');
      $('.chrome-maniaModalContent').fadeIn('slow');
      chrome.storage.local.get("mkey",function(obj){
        console.log(JSON.stringify(obj));
        var toShow = [];
        $.each(obj["mkey"],function(k,v){
          var url = v[0];
          var title = v[2];
          var viewSec = v[1];
          var ins = '<a href=' + url + ' >' + title + '</a>';
          toShow.unshift(k,[ins, viewSec])
        });
        var jsondata = JSON.stringify(toShow);
        $('.chrome-maniaModalContent').html(jsondata.replace(/\],/g,'],</br>'));
      });
    }else {
      $('.chrome-maniaModal').fadeOut('slow');
      $('.chrome-maniaModalContent').fadeOut('slow');
    }
  });
  // モーダルがクリックされたら、モーダルをフェードアウト
  $('.chrome-maniaModal').click(function(){
    $(this).fadeOut('slow');
    $('.chrome-maniaModalContent').fadeOut('slow');
  });
  console.log($.fn.jquery);
});
