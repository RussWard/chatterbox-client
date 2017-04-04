var app = {};

app.friends = [];

app.init = function(){
  app.fetch()
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
    //$.get(app.server,
    return $.ajax({
       url: app.server,
       type: 'GET',
       data: args || 'order=-createdAt',
       //data:'where={"username":{"$in":["matt"]}}',
       success: function(data) {
         var message = JSON.stringify(data.results[0]);
         var messagesArray = data.results;

         for (var i = 0; i < messagesArray.length; i++) {
           var username = messagesArray[i].username;
           var userLink = '<button class=' + username + '>' + username + '</button>';
           $('#chats').append('<p>'+userLink+'  '+messagesArray[i].text+'</p>');
         }
         $('button').on('click', app.handleUsernameClick.bind(event));
      },
      error: function(data) {
        console.error('chatterbox: Failed to recieve messages', data);
      }
   });
};

app.init();

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

}
