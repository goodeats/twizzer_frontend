'use strict';

var App = App || {},
$jumbo = $('#jumbo'),
$tweetList = $('#tweet-list'),
$search = $('#handleInput'),
$form = $('.form-inline'),
$gridButton = $('#btnOther'),
$tweetPic = $('.tweetPic');

console.log('if you can read this, you are probably a web developer :)');

$(document).ready(function(){

  $search.focus();

  $gridButton.on('click', function(){
    $tweetList.empty();
    App.MyGridTweets(event);
    $('h1').text('What is @' + $search.val() + ' Twitpic-ing??');
  });

  $form.submit(function(event) {
    event.preventDefault();
    $tweetList.empty();
    App.MyTweets(event);
    console.log($search.val());
    $('h1').text('What is @' + $search.val() + ' Tweeting??');
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

    var legend = "<div id='legend'>";
    legend += "<p>500+ followers = <span class='glyphicon glyphicon-star star'></span></p>";
    legend += "<p>10+ favorites = <span style='color: blue;'>blue border</span></p>";
    legend += "<p>10+ retweets = <span style='color: green;'>green border</span></p>";
    legend += "<p>10+ favorites & retweets = <span style='color: red;'>red border</span></p>";
    legend += "</div>";

    $tweetList.append(legend);

    for (var i = 0; i < data.tweets.length; i++) {
      if (data.tweets[i].entities.media) {

          var html = "<div class='tweetGrid'>";
          if (data.tweets[i].user.followers_count > 500) {
            html += "<div class='star'><span class='glyphicon glyphicon-star'></span></div>";
          }
          html += "<img class='tweetPic' id='twitPic-" + i + "' ";

          if (data.tweets[i].favorite_count > 10 && data.tweets[i].retweet_count > 10){
            html += "style='border: 10px solid red;'";
          } else if (data.tweets[i].favorite_count > 10){
            html += "style='border: 10px solid blue;'";
          } else if (data.tweets[i].retweet_count > 10){
            html += "style='border: 10px solid green;'";
          }

          html += " src='" + data.tweets[i].entities.media[0].media_url + "'>";
          html += "<div class='twitterStats'>";
          html += "<span>RT: " + data.tweets[i].retweet_count + "</span>";
          html += "<span>F: " + data.tweets[i].favorite_count + "</span>";
          html += "</div></div>";

          $tweetList.append(html);
      }
    }

    $('.twitterStats').hide();

    $('.tweetGrid').mouseenter(function(){
      var $div = $('.twitterStats').eq($(this).index('.tweetGrid'));
      $div.show();
      $div.css('position', 'absolute');
      $div.css('width', '100%');
    }).mouseleave(function(){
      var $div = $('.twitterStats').eq($(this).index('.tweetGrid'));
      $div.hide();
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
