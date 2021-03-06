window.console = window.console || {
  log: function() {}
}

function getKey(evt) {
  var key = getKey.table[evt.keyCode]
  if (!key) {
    key = String.fromCharCode(evt.keyCode)
    if (!evt.shiftKey) {
      key = key.toLowerCase()
    }
  }
  return key
}

getKey.table = {
  13: 'enter',
  38: 'up',
  40: 'down',
  37: 'left',
  39: 'right',
  27: 'esc',
  32: 'space',
  8:  'backspace',
  9:  'tab',
  46: 'delete',
  16: 'shift',
}

//var socket = io.connect('http://localhost:8080');
var socket = io.connect('http://localhost:8080');

var currKeys = {}

function update() {
  var props = {
    yaw:   !!currKeys['d'] - !!currKeys['a'],
    roll:  !!currKeys['k'] - !!currKeys['i'],
    pitch: (!!currKeys['J'] || !!currKeys['l']) -
           (!!currKeys['j'] || !!currKeys['L']),
    gaz:   !!currKeys['w'] - !!currKeys['s']
  }
  console.log(props)
  socket.send(JSON.stringify(props))
}

document.addEventListener('keydown', function(evt) {
  var key = getKey(evt)
  console.log('keydown: ' + key)
  
  var element = document.getElementById('key_' + key)
  if (element && !element.className.match(/(^|\s)active(\s|$)/)) {
    element.className += ' active'
  }
  
  if (key == 'enter' || key == 'up') {
    socket.send('takeoff')
    socket.send('_initNavData')
  } else if (key == 'esc' || key == 'down') {
    socket.send('land')
	} else if (key == 'r') {
		socket.send('recover');
  } else {
    currKeys[key] = 1
    update()
  }
}, false)

document.addEventListener('keyup', function(evt) {
  var key = getKey(evt)
  console.log('keyup: ' + key)
  
  var element = document.getElementById('key_' + key)
  if (element) {
    element.className = element.className.replace(/(^|\s)active(\s|$)/g, ' ')
  }
  
  currKeys[key] = 0
  update()
}, false)
