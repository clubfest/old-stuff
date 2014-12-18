
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
  },
  editorShortcuts: {
    8: {
      shift: function(){
        Editor.deleteContent();
      },
    },
    32: {
      normal: function(){
        Editor.insertSpace();
      },
      shift: function(){
        Editor.insertRest();
      },
    },
    37: {
      normal: function(){
        Editor.navigateLeft();
      },
    },
    39: {
      normal: function(){
        Editor.navigateRightWithSound();
      },
    },
    // todo:
      // Shift + z is undo
      // Shift + y is redo
  },
  destroyKeyboard: function(){
    $(window).off('keydown.keyboardShortcuts');
  },
  initKeyboard: function(){
    var self = this;
    $(window).off('keydown.keyboardShortcuts');
    $(window).on('keydown.keyboardShortcuts', function(evt){
      var keyCode = evt.which;
      var desc = 'normal';
      if (evt.shiftKey) {
        desc = 'shift';
      // } else if (evt.altKey){
      //   desc = 'alt';
      }

      if (self.keyboardShortcuts[keyCode]){
        var shortcut = self.keyboardShortcuts[keyCode][desc];
        if (shortcut) {
          evt.preventDefault();
          shortcut();
        }
      }
    });
  },

  initEditor: function(){
    var self = this;
    $(window).off('keydown.editorShortcuts');
    $(window).on('keydown.editorShortcuts', function(evt){      
      var keyCode = evt.which;
      var desc = 'normal';
      if (evt.shiftKey) {
        desc = 'shift';
      }

      if (self.editorShortcuts[keyCode]){
        var shortcut = self.editorShortcuts[keyCode][desc];
        if (shortcut) {
          evt.preventDefault();
          shortcut();
        }
      }
    });
  },
}