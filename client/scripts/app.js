var app = {};

app.friends = [];

app.init = function(){
  app.fetch();
  app.sendButton();
};

app.message = function(name, text, room) {
  var message = {
    username: name,
    text: text,
    roomname: room
  };
    return message;
};

app.server = 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages';

app.send = function(message) {

    return $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: app.server,
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
            console.log('chatterbox: Message sent');
        },
        error: function (data) {
            // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
            console.error('chatterbox: Failed to send message', data);
        }
    });
};

app.fetch = function(args) {

    return $.ajax({
       url: app.server,
       type: 'GET',
       data: args || 'order=-createdAt',
       success: function(data) {
         console.log(data.results);
         var cleanData = app.secure(data);
         var message = JSON.stringify(cleanData.results[0]);
         var messagesArray = cleanData.results;

         for (var i = 0; i < messagesArray.length; i++) {
           var username = messagesArray[i].username;
           var userLink = '<button class=' + username + '>' + username + '</button>';
           $('#chats').append('<p>'+userLink+'  '+messagesArray[i].text+'</p>');
         }
         $('button').on('click', app.handleUsernameClick.bind(event));
         $('form').on('click', '#sendMessageButton', function(event) {
           event.preventDefault();
           var name = $('#input-username').val();
           var text = $('#input-text').val();
           var room = $('#input-roomname').val();
           var message = app.message(name, text, room);

           app.send(app.renderMessage(message));

         });
      },
      error: function(data) {
        console.error('chatterbox: Failed to recieve messages', data);
      }
   });
};



app.clearMessages = function(){
  $('#chats').empty();
};

app.renderMessage = function(message) {
  $('#chats').append('<p>' + message.text + '</p>');
  return message;
};

app.renderRoom = function(room) {
  $('#roomSelect').append('<div id=' + room + '></div>');
};

app.handleUsernameClick = function(event) {

  if (!app.friends.includes(event.target.className)) {
    var name = event.target.className;
    var friendElement = '<li id="' + name + '">' + name + '</li>';
    $('.friends').append(friendElement);
    app.friends.push(event.target.className);
    console.log(name);
    $('#' + name).on('click', app.friendFetch.bind(event));
  }
};

app.friendFetch = function(event) {
  var name = event.target.id;
  $('#chats').children().remove();
  var data = 'where={"username":{"$in":["' + name + '"]}}';
  app.fetch(data);

};

app.sendButton = function() {
  // $('#input-text').on('click', function(event) {
  //  //  event.preventDefault();
  //  console.log('hey');
  //  console.log($('#input-text').val());
  // });

};


app.secure = function(obj) {
  for (var i = 0; i < obj.results.length; i++) {
    if (obj.results[i].username === undefined) {
      obj.results.splice(i, 1);
    } else  if (obj.results[i].username.match('<.*>')) {
      obj.results.splice(i, 1);
    }
    // if (obj.results[i].text.match('<.*>')) {
    //   obj.results.splice(i, 1);
    // }
    // if (obj.results[i].roomname.match('<.*>')) {
    //   obj.results.splice(i, 1);
    // }
    // if (obj.results[i].username.match('function()')) {
    //   obj.results.splice(i, 1);
    // }
    // if (obj.results[i].text.match('function()')) {
    //   obj.results.splice(i, 1);
    // }
    // if (obj.results[i].roomname.match('function()')) {
    //   obj.results.splice(i, 1);
    // }
  }
  return obj;
};

app.init();
