/*chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(changeInfo && changeInfo.status == "complete"){
    chrome.tabs.executeScript(tabId, {file: "jquery.js"}, function(){
      chrome.tabs.executeScript(tabId, {file: "script.js"});
   });
  }
});*/
function sendStrage(){
  chrome.storage.local.get("mkey",function(obj){
    $.ajax({
      url: 'http://api0.chrome-mania.com/api',
      type: 'POST',
      data: JSON.stringify(obj),
      timeout: 100000,
      dataType: 'json'
    })
    .done(function( data, textStatus, jqXHR ) {
      console.log('success');
         // ...
    })
    .fail(function( jqXHR, textStatus, errorThrown ) {
      console.log('fail ajax');
      console.log('fail status', textStatus);
         //         // ...
    })
    .always(function( jqXHR, textStatus ) {
      console.log('always ajax');
         //                 // ...
    });//alert(uname);
  });
}; 

$(function(){
  window.PT = {
    helloworld: function(){ alert("HelloWorld"); }
  };
  // iframeの中ならprocedureを停止
  if( window!=parent ) return ;
  //sendStrage();
  function getText(startingPoint) {
    var text = "";
    function gt(start) {
      if (start.nodeType === 3)
        text += start.nodeValue;
      else if (start.nodeType === 1)
        if (start.tagName != "SCRIPT" && start.tagName != "STYLE")
          for (var i = 0; i < start.childNodes.length; ++i)
            gt(start.childNodes[i]);
    }
    gt(startingPoint);
    return text;
  }
  //* 現在閲覧中のURLを保存する,　キーとなる時間を保存する
  //* 
  var nowURL = window.location.href;
  var timeKey = (new Date()).toString();
  var title = document.title;
  var html  = getText(document.body).replace(/\n/g,'').replace(/\\n/g,'').replace(/<.*?>/g,'').replace(/\t/g,'').replace(/\\t/g,'');;
  function saveChanges() {
    // Get a value saved in a form.
    // Check that there's some code there.
    if (!nowURL) {
      console.log('Error: No value specified');
      return true;
    }
    // Save it using the Chrome extension storage API.
    chrome.storage.sync.get(function(objName) {
      uname = objName['uname'];
      console.log(uname);
      chrome.storage.local.get("mkey",function(obj){
      //console.log(obj);
        if( obj == {}) return false;
        if( obj["mkey"] == null) obj["mkey"] = {timeKey:["",0,"title",0,0,"html","uname"]};
        obj["mkey"][timeKey] = ["",0,"title",0,0,"html","uname"];
        obj["mkey"][timeKey][0] = nowURL;
        obj["mkey"][timeKey][2] = title;
        obj["mkey"][timeKey][5] = html;
        obj["mkey"][timeKey][6] = uname;
        chrome.storage.local.set(obj, function() {
         // Notify that we saved.
         // ↓とても重い
         // console.log(obj, 'Settings saved');
        });
        return true;
      });
    });
  }
  // 経過時間を記録する
  // 経過時間はtimeKeyにsuffixであるteをつけたもの
  // ブラウザがonfocusである必要があるので、focusレシオを定義する
  var _timeCounter = 0;
  var _timeActiveCounter = 0;
  var _ActiveTab = false;
  $(window).focus(function() {
    _ActiveTab = true;
  });
  $(window).blur(function() {
   _ActiveTab = false;
  });
  function inLoop(){
    setTimeout(function(){
      _timeCounter += 1;
      chrome.storage.local.get("mkey",function(obj){
        //console.log(obj);
        obj["mkey"][timeKey][1] = _timeCounter;
        if( _ActiveTab ){
          _timeActiveCounter += 1;
          obj["mkey"][timeKey][3] = _timeActiveCounter;
        }
        chrome.storage.local.set(obj, function() {
          // Notify that we saved.
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
  // chromeマニアのロゴを描画
  $('.itemsShowHeader').css('background-color','red');
  $('body').append('<div class="chrome-maniaSender"></div>');
  $('.chrome-maniaSender').css({
    'top': '50px',
    'position': 'fixed',
    'z-index': '2147483647',
    'width': '30px',
    'height': '30px',
    'padding':'10px',
    'margin':'10px',
    'opacity': '0.4',
    'background-color':'red',
    'border-radius': '5px 5px 5px 5px',
    'background-image': 'url("http://icons.iconarchive.com/icons/google/chrome/256/Google-Chrome-Chromium-icon.png")',
    'background-size':'cover'
  })
  $('body').append('<div class="chrome-mania"></div>');
  $('.chrome-mania').css({
    'top': '0px',
    'position': 'fixed',
    'z-index': '2147483647',
    'width': '30px',
    'height': '30px',
    'padding':'10px',
    'margin':'10px',
    'opacity': '0.4',
    'background-color':'green',
    'border-radius': '5px 5px 5px 5px',
    'background-image': 'url("http://icons.iconarchive.com/icons/google/chrome/256/Google-Chrome-Chromium-icon.png")',
    'background-size':'cover'
  })
  
  $('body').append('<div class="chrome-maniaModal"></div>');
  $('.chrome-maniaModal').css({
    'z-index':'2147483647',
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
    'z-index':'2147483647',
    'display':'none',
    'top':'10px',
    'left':'12.5%',
    'width':'75%',
    'height': '90%',
    'position':'fixed',
    'background-color':'white',
    'word-break': 'break-word',
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
      var uname = 'defaultUser';
      chrome.storage.local.get("mkey",function(obj){
        //console.log(JSON.stringify(obj));
        var toShow = [];
        // toShowの加工
        $.each(obj["mkey"],function(k,v){
          var url = v[0];
          var title = v[2];
          var active = v[3];
          var viewSec = v[1];
          var uninxTime = Date.parse(k);
          var ins = '<a href=' + url + ' >' + title + '</a>';
          var html = v[5];
          // データ構造
          toShow.unshift([k, ins, viewSec, active, uninxTime, html])
        });
        // toShowを時系列の降順でソート
        toShow = toShow.sort(function(a, b){
          //console.log("sorted");
          //console.log(_a);
          //console.log(a[0]);
          return a[4] - b[4];
        }).reverse();
        //var jsondata = JSON.stringify(toShow);
        var builder = "";
        for(var v in toShow){
          //builder += '<span style="float:left; font-size:small; white-space:pre;">' + JSON.stringify(toShow[v]) + '</span>' + '</br>';
          builder += '<span style="font-size:normal;font-color:black;">' + JSON.stringify(toShow[v]).replace('/\t/g','') + '</span>' + '<br/>' ;
          //console.log(builder);
        } 
        $('.chrome-maniaModalContent').html(builder);
        //$('.chrome-maniaModalContent').html(JSON.stringify(toShow));
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
