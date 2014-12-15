Keyboard = {
  shift: 0,
  hasPedal: true,
  volume: 1,

  init: function(){
    this.connectKeyToKeyboard();
    Shortcuts.initKeyboard();
  },

  destroy: function(){
    $(window).off('keydown.keyboard');
    $(window).off('keyup.keyboard');
    Shortcuts.destroyKeyboard();
  },

  connectKeyToKeyboard: function() {
    var self = this;
    var downKeys = {};

    $(window).off('keydown.keyboard');
    $(window).on('keydown.keyboard', function(evt) {
      if (evt.shiftKey || evt.ctrlKey) return ;

      var keyCode = fixKeyCode(evt.keyCode);

      // 1: prevent backspace from navigating back in the browser
      if (evt.which === 8) {
        evt.preventDefault();
      }

      // 2: prevent pressed keys from repeating
      if (downKeys[keyCode] === true) {
        return ;
      } else {
        downKeys[keyCode] = true;
      }

      var noteNumber = convertKeyCodeToNote(keyCode);

      if (typeof noteNumber !== "undefined") {
        noteNumber = self.adjustShift(noteNumber);
        PianoPlayer.play(noteNumber);
        $(window).trigger('noteDown', {
          noteNumber: noteNumber,
        });
      }
    });

    $(window).off('keyup.keyboard');
    $(window).on('keyup.keyboard', function(evt) {
      var keyCode = fixKeyCode(evt.keyCode);
      delete downKeys[keyCode];
    });
  },

  adjustShift: function(noteNumber) {
    noteNumber += this.shift;
    return noteNumber;
  },
}



////// helpers
function fixKeyCode(keyCode) {
  // firefox incompatibility
  if (keyCode === 59) {
    keyCode = 186;
  } else if (keyCode === 61) {
    keyCode = 187;
  } else if (keyCode === 173) {
    keyCode = 189;
  }

  return keyCode
}

function convertKeyCodeToNote(keyCode) {
  return keyCodeToNote[keyCode];
}


keyCodeToNote = {
  67: 41,
  86: 42,
  70: 43,
  51: 45,
  192: 47,
  49: 48, // C
  50: 49,
  81: 50,
  87: 51,
  65: 52,
  90: 53,
  88: 54,
  83: 55,
  68: 56,
  69: 57,
  82: 58,
  52: 59,
  53: 60, // C
  54: 61,
  84: 62,
  89: 63,
  71: 64,
  66: 65,
  78: 66,
  72: 67,
  74: 68,
  85: 69,
  73: 70,
  56: 71,
  57: 72, //C
  48: 73,
  79: 74,
  80: 75,
  76: 76,
  190: 77,
  191: 78,
  186: 79,
  222: 80,
  219: 81,
  221: 82,
  187: 83,
  8: 84, //C
  220: 86,
  189: 88,
  77: 89,
  188: 90,
  75: 91,
  55: 93,
};
