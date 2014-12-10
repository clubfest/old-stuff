
Meteor.startup(function(){
  PianoPlayer.init();
  DrumPlayer.init();
  // Keyboard.connectKeyToKeyboard();
  Keyboard.init();
  Metronome.init();
});