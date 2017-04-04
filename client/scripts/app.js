// YOUR CODE HERE:

var app = {};

app.init = function(){};

app.message = {
    username: 'Mel Brooks',
    text: 'It\'s good to be the king',
    roomname: 'lobby'
};

app.send = function(message){

    return $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
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
app.server = 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages';

app.fetch = function(){
    $.get('http://parse.sfs.hackreactor.com/chatterbox/classes/messages', function(data){
      console.log('hello world');
      console.log(data.results);
      var message = JSON.stringify(data.results[0]);
      var messagesArray = data.results;

      for (var i = 0; i < messagesArray.length; i++) {
        // $('#chats').text(messagesArray[i].text);
        $('#chats').append('<p>'+messagesArray[i].text+'</p>');
      }
    });
};

app.clearMessages = function(){
  $('#chats').empty();
};

app.renderMessage = function(name, text, room) {
  var message = {
    username: name,
    text: text,
    roomname: room
  };
  $('#chats').append('<p>' + message.text + '</p>');
};

app.renderRoom = function(room) {
  $('#roomSelect').append('<div id=' + room + '></div>');
};
