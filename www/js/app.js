var wordIndex = -1;
var firstLoad = true;
var triesCnt = 0;
var successCnt = 0;

function test() {    
    url = "https://jsonplaceholder.typicode.com/posts/1";
    $.ajax({
      url,
      method: 'GET'
    })
    .then(function(data) {
      alert(data.userId);
    });
}

function test0() {
    url = "http://arfffy.free.fr/picNames/data.json";
    var jqxhr = $.getJSON( url, function(json) {
      alert( "success" );
      jsonData = json;
    })
      .done(function(json) {
        console.log( "second success" );
      })
      .fail(function(jqxhr, textStatus, error) {
        alert( "error : " + textStatus + ", " + error );
      })
      .always(function() {
      });
//    $.getJSON(url).done(function(data){
//       alert(data);
//    })
//    .fail(function(d, textStatus, error) {
//        alert("getJSON failed, status: " + textStatus + ", error: " + error + ", d : " + d)
//    });
////    $.getJSON('http://arfffy.free.fr/picNames/data.json', function(data) {
////        alert(data);
////    });   
}
    

$(window).on("orientationchange",function(screenSetting ){
    setScreenMode(screenSetting.orientation);
});

function getOrientation() {
    var orientation = "portrait";
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();
    if (screenWidth > screenHeight) {
        orientation = "landscape";
    }
    return orientation;
}

$(document).ready(function() {
    loadWords();
//    setScreenMode(getOrientation());
});

function setScreenMode(screenSetting) {
  if(screenSetting == "portrait") // Portrait
  {
    $("#todo-list a").css({"font-size":"110%"});
    //$("#container").css({"display": "flex"});
    $("#container").removeClass("ui-grid-a");
    $("#pictList").removeClass("ui-block-a");
    $("#todo-list").removeClass("ui-block-b");
  }
  else // Landscape
  {
    $("#todo-list a").css({"font-size":"200%"});
//    $("#container").css({"display": "flex", "justify-content": "space-around"});
    $("#container").addClass("ui-grid-a");
    $("#pictList").addClass("ui-block-a");
    $("#todo-list").addClass("ui-block-b");
  }    
}

function getRandomIndexes(limit) {
    var amount = 4,
        lower_bound = 0,
        upper_bound = limit - 1,
        unique_random_numbers = [];
    
    if (amount > limit) amount=limit; //Infinite loop if you want more unique
                                        //Natural numbers than existemt in a
                                        // given range
    while (unique_random_numbers.length < amount) {
        var random_number = Math.round(Math.random()*(upper_bound - lower_bound) + lower_bound);
        if (unique_random_numbers.indexOf(random_number) == -1) { 
            // Yay! new random number
            unique_random_numbers.push( random_number );
        }
    }
    return unique_random_numbers;
}

function displayPicture(imgSrc) {
    li = '<li id="picItem"><img src="' + imgSrc + '"  /></li>';
    $("#pictList").append($(li));
    $("#picItem").addClass("shadow");
}

function addWordButton(label, index) {
    var storage = window.localStorage;
    var upperCaseSetting = storage.getItem("upperCaseSetting");

    if (upperCaseSetting == "Y") {
        label = label.toUpperCase();
    }

    $("#todo-list").append('<li><a href="#list-page" onclick="submitWord(' + index + ')" id="w' + index +'">' + label + '</a></li>');    
}

function updateScore() {
    $("#scoreLabel").html('Score : ' + successCnt + ' / ' + triesCnt);
}

function reloadWords()
{    
    $("#todo-list").empty(); 
    $("#pictList").empty(); 
    loadWords();
}

function submitWord(index){
    //alert("submit");
    //alert(wordIndex);
    //alert($(el).parent().index());
    if(wordIndex ==index){
        $('#w'+index).css({'color':'green'});
        triesCnt++;
        successCnt++;
    }
    else {
        triesCnt++;
        $('#w'+index).css({'color':'red'});
    }
       
    updateScore();
    
    setTimeout(function() {
        $('#w'+index).css({'color':'#333'});
        if(wordIndex == index)
        {
            reloadWords();   
        }
    }, 1000);
}

function loadWords() {
var jsonData;
var jqxhr = $.getJSON( "data/data.json", function(json) {
  console.log( "success" );
  jsonData = json;
})
  .done(function(json) {
    console.log( "second success" );
  })
  .fail(function(jqxhr, textStatus, error) {
    console.log( "error : " + textStatus + ", " + error );
  })
  .always(function() {
    console.log( "complete" );
    wordIndex = Math.floor((Math.random() * 4));
    indexes = getRandomIndexes(jsonData.length);
    
    displayPicture('data/' + jsonData[indexes[wordIndex]].path);
    
    for (var i in indexes)
    {
        addWordButton(jsonData[indexes[i]].label, i);
    }
//    $("#todo-list").append('<li><a href="#list-page" onclick="submitWord(0)" id="w0">' + jsonData[0].label + '</a></li>');
//    $("#todo-list").append('<li><a href="#list-page" onclick="submitWord(1)" id="w1">' + jsonData[1].label + '</a></li>');
//    $("#todo-list").append('<li><a href="#list-page" onclick="submitWord(2)" id="w2">' + jsonData[2].label + '</a></li>');
//    $("#todo-list").append('<li><a href="#list-page" onclick="submitWord(3)" id="w3">' + jsonData[3].label + '</a></li>');

    $("#todo-list").listview('refresh');
    
    setScreenMode(getOrientation());
  });    
}

$( document ).delegate("#settings-page", "pageinit", function() {
    var storage = window.localStorage;
    var upperCaseSetting = storage.getItem("upperCaseSetting");
    $("upperCaseSetting").val(upperCaseSetting);
});

function saveSettings() {
    var upperCaseSetting = $("input[name=upperCaseSetting]:checked").val();
    var storage = window.localStorage;
    storage.setItem("upperCaseSetting", upperCaseSetting);
    $.mobile.changePage($("#pic-page"));
}
