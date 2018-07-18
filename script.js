(function(){

var userHeader = document.getElementById('userHeader');
var messages = document.getElementById('messages');
var text = document.getElementById('text');
var textSubmit = document.getElementById('textSubmit');
var activeUsers = document.getElementById('activeUsers');
var messagesField = document.getElementById('messagesField');
var user = {
  name: 'User Name',
  nick: 'User Nick',
  status: 'online',
  signed: Date.now()
};

userHeader.innerHTML = user.nick + " (" + user.name + ")";

var socket = io.connect();



function myFunction() {

    user.name = prompt("Please enter your name:", "User Name");
    user.nick = prompt("Please enter your nick:", "User Nick");
    if (user.name == null) {
      user.name = 'anonymous'
    }
    if (user.name == null) {
      user.nick = 'anonymous'
    }

    user.status = 'online';
    user.signed = Date.now();

    userHeader.innerText = user.nick + " (" + user.name + ")";
    socket.emit('chat user', user);

}
myFunction();

// nameButton.onclick = function(){
//
// };
textSubmit.onclick = function(){
  var data = {
    name: user.name,
    text: text.value
  };
  text.value = '';

  socket.emit('chat message', data);
};

socket.on('chat history', function(msg){
  //console.log(msg);
  messages.innerHTML = '';

  for(var i in msg){
    if (msg.hasOwnProperty(i)) {
      var el = document.createElement('li');
      el.innerText = msg[i].name + ': '+ msg[i].text;
      messages.appendChild(el);
    }
  }
});

socket.on('chat message', function(msg){
    var el = document.createElement('li');
    el.innerText = msg.name + ': '+ msg.text;
    messages.appendChild(el);
    messagesField.scrollTop = 9999;

});

socket.on('chat user', function(usr){
  activeUsers.innerHTML = '';

  for (var i in usr) {
    var el = document.createElement('li');
      el.innerText = usr[i].nick + " (" + usr[i].name + ")";
      activeUsers.appendChild(el);
      messagesField.scrollTop = 9999;
  }
});

})();
