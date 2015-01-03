
Meteor.startup(function(){
  PianoPlayer.init();
  BassPlayer.init();
  LoudPianoPlayer.init();
  DrumPlayer.init();
  Keyboard.init();
  Metronome.init();
  Meteor.subscribe('allSongs');
});