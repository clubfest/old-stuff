
Shortcuts = {
  keyboardShortcuts: {
    38: {
      normal: function(){
        Keyboard.shift += 12;

      },
      shift: function(){
        Keyboard.shift++;
      },
    },
    40: {
      normal: function(){
        Keyboard.shift -= 12;
      },
      shift: function(){
        Keyboard.shift--;
      },
    },
    32: {
      normal: function(){
        DrumPlayer.play(50);
        $(window).trigger('beatDown', {
          noteNumber: 50,
        });
      },
    }
  },
  editorShortcuts: {

  },
  destroyKeyboard: function(){
    $(window).off('keydown.keyboardShortcuts');
  },
  initKeyboard: function(){
    var self = this;
    $(window).off('keydown.keyboardShortcuts');
    $(window).on('keydown.keyboardShortcuts', function(evt){
      // evt.preventDefault();

      var keyCode = evt.which;
      var desc = 'normal';
      if (evt.shiftKey) {
        desc = 'shift';
      }

      if (self.keyboardShortcuts[keyCode]){
        var shortcut = self.keyboardShortcuts[keyCode][desc];
        shortcut();
      }

      // } else if (keyCode === 40) {
      //   DrumPlayer.decreaseVolume();
      //   PianoPlayer.decreaseVolume();
      // } else if (keyCode === 38) {
      //   DrumPlayer.increaseVolume();
      //   PianoPlayer.increaseVolume();
    });
  },

  initEditor: function(){

  },
}