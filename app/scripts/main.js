'use strict';

var App = App || {},
$jumbo = $('#jumbo'),
$tweetList = $('#tweet-list'),
$search = $('#handleInput'),
$form = $('.form-inline'),
$gridButton = $('#btnOther');

console.log('if you can read this, you are probably a web developer :)');

$(document).ready(function(){

  $search.focus();

  $gridButton.on('click', function(){
    $tweetList.empty();
    App.MyGridTweets(event);
    $('h1').text('What the F@$% is @' + $search.val() + ' Twitpic-ing??');
  });

  $form.submit(function(event) {
    event.preventDefault();
    $tweetList.empty();
    App.MyTweets(event);
    console.log($search.val());
    $('h1').text('What the F@$% is @' + $search.val() + ' Tweeting??');
  });

});

App.MyTweets = function(event){
  event.preventDefault();
  $.ajax({
    url: 'https://wtfamitweeting.herokuapp.com/tweets/' + $search.val(),
    type: 'GET',
    dataType: 'JSON'
  })
  .done(function(data) {
    console.log(data);

    // pass in the 'created_at' string returned from twitter //
    // stamp arrives formatted as Tue Apr 07 22:52:51 +0000 2009 //
    function parseTwitterDate(text) {
    var date = new Date(Date.parse(text)).toLocaleDateString();
    var time = new Date(Date.parse(text)).toLocaleTimeString();
    return date +' • ' + time;
    }

    for (var i = 0; i < data.tweets.length; i++) {
      var html = "<div class='tweet'>";
      html += "<p>Posted: " + parseTwitterDate(data.tweets[i].created_at) + "</p>";
      html += "<p>" + App.addLinks(data.tweets[i].text) + "</p>";
      if (data.tweets[i].entities.media) {
        html += "<p><img src='" + data.tweets[i].entities.media[0].media_url + "'></p>";
      }
      html += "<div class='twitterStats'>"
      html += "<p>Retweets: " + data.tweets[i].retweet_count + "</p>";
      html += "<p>Favorites: " + data.tweets[i].favorite_count + "</p>";
      html += "</div></div>";
      $tweetList.append(html);
    }
  })
  .fail(function() {
    console.log("try typing a real twitter handle... here's what you look like right now");
    var puppy = "<img id='puppyFail' src='http://www.goodmeme.net/wp-content/uploads/2014/07/240_cute_dog_driving.jpg' alt='Smiley face'>";
    $jumbo.append(puppy);
    window.setTimeout(function(){
      location.reload();
    }, 3000);
  });
};

App.displayTweet = function(tweet){
  $tweetList.append(App.addLinks(tweet));
};

App.addLinks = function(text){
  var textAr = text.split(' ');
  for (var i = 0; i < textAr.length; i++){
    if (textAr[i].slice(0,7) === 'http://' || textAr[i].slice(0,8) === 'https://'){
      textAr[i] = '<a href=' + textAr[i] + ' target="_blank">' + textAr[i] + '</a>';
    } else if (textAr[i].slice(0,1) === '@'){
      textAr[i] = '<a href="https://twitter.com/' + textAr[i] + '" target="_blank">' + textAr[i] + '</a>';
    } else if (textAr[i].slice(0,1) === '#'){
      textAr[i] = "<a href='https://twitter.com/hashtag/" + textAr[i].replace(/[#]/g, '') + "?src=hash' target='_blank'>" + textAr[i] + "</a>";
    }
  }
  return textAr.join(' ');
};

App.MyGridTweets = function(event){
  event.preventDefault();
  $.ajax({
    url: 'https://wtfamitweeting.herokuapp.com/tweets/' + $search.val(),
    type: 'GET',
    dataType: 'JSON'
  })
  .done(function(data) {
    console.log(data);

    // pass in the 'created_at' string returned from twitter //
    // stamp arrives formatted as Tue Apr 07 22:52:51 +0000 2009 //
    function parseTwitterDate(text) {
    var date = new Date(Date.parse(text)).toLocaleDateString();
    var time = new Date(Date.parse(text)).toLocaleTimeString();
    return date +' • ' + time;
    }

    for (var i = 0; i < data.tweets.length; i++) {
      if (data.tweets[i].entities.media) {
        var html = "<div class='tweetGrid'>";
        html += "<p>Posted: " + parseTwitterDate(data.tweets[i].created_at) + "</p>";
        html += "<p>" + App.addLinks(data.tweets[i].text) + "</p>";
        html += "<p><img class='tweetPic' src='" + data.tweets[i].entities.media[0].media_url + "'></p>";
        html += "<div class='twitterStats'>";
        html += "<p>Retweets: " + data.tweets[i].retweet_count + "</p>";
        html += "<p>Favorites: " + data.tweets[i].favorite_count + "</p>";
        html += "</div></div>";
        $tweetList.append(html);
      }
    }

    $('.tweetPic').on('mouseover', function(){
      console.log('hi');
    });
  })
  .fail(function() {
    console.log("try typing a real twitter handle... here's what you look like right now");
    var puppy = "<img id='puppyFail' src='http://www.goodmeme.net/wp-content/uploads/2014/07/240_cute_dog_driving.jpg' alt='Smiley face'>";
    $jumbo.append(puppy);
    window.setTimeout(function(){
      location.reload();
    }, 3000);
  });
};
