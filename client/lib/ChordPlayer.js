

if (typeof(MIDI) === "undefined") MIDI = {};
MIDI.keyToNote = {}; // C8  == 108
MIDI.noteToKey = {}; // 108 ==  C8
(function () {
  var A0 = 0x15; // first note (21)
  var C8 = 0x6C; // last note (108)
  var number2key = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  for (var n = A0; n <= C8; n++) {
    var octave = (n - 12) / 12 >> 0;
    var name = number2key[n % 12] + octave;
    MIDI.keyToNote[name] = n;
    MIDI.noteToKey[n] = name;
  }
})();

PianoPlayer = {
  increaseVolume: function(){
    var res = this.getVolume();
    this.setVolume(res + 0.1);
  },
  decreaseVolume: function(){
    if (this.gainNode.gain.value > 0) {
      var res = this.getVolume();
      this.setVolume(res - 0.1);
    }
  },
  getVolume: function(){
    return this.gainNode.gain.value;
  },
  setVolume: function(arg){
    this.gainNode.gain.value = arg;
  },
  init: function(){
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain();
    // Connect the source to the gain node.
    // Connect the gain node to the destination.
    this.gainNode.connect(this.ctx.destination);
    this.gainNode.gain.value = 1;

    // caching the buffer
    this.bufferDict = {};
    var self = this;
    _.range(21, 109).forEach(function(noteNumber) {
      var key = MIDI.noteToKey[noteNumber];
      var base64 = MIDI.Soundfont.mp3.acoustic_grand_piano[key].split(",")[1];
      var buffer = Base64Binary.decodeArrayBuffer(base64);
      self.ctx.decodeAudioData(buffer, function(buffer){
        self.bufferDict[noteNumber] = buffer;
      });
    });      
  },
  play: function(noteNumber) {
    var source = this.ctx.createBufferSource(); // creates a sound source
    source.connect(this.gainNode);
    var buffer = this.bufferDict[noteNumber];
    if (buffer) {
      source.buffer = buffer;
      source.start(0);
    }
  },
}

BassPlayer = {
  increaseVolume: function(){
    var res = this.getVolume();
    this.setVolume(res + 0.1);
  },
  decreaseVolume: function(){
    if (this.gainNode.gain.value > 0) {
      var res = this.getVolume();
      this.setVolume(res - 0.1);
    }
  },
  getVolume: function(){
    return this.gainNode.gain.value;
  },
  setVolume: function(arg){
    this.gainNode.gain.value = arg;
  },
  init: function(){
    this.sources = {};
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain();
    // Connect the source to the gain node.
    // Connect the gain node to the destination.
    this.gainNode.connect(this.ctx.destination);
    this.gainNode.gain.value = 1;

    // caching the buffer
    this.bufferDict = {};
    var self = this;
    _.range(21, 109).forEach(function(noteNumber) {
      var key = MIDI.noteToKey[noteNumber];
      var base64 = MIDI.Soundfont.mp3.acoustic_grand_piano[key].split(",")[1];
      var buffer = Base64Binary.decodeArrayBuffer(base64);
      self.ctx.decodeAudioData(buffer, function(buffer){
        self.bufferDict[noteNumber] = buffer;
      });
    });      
  },
  play: function(noteNumber) {
    var source = this.ctx.createBufferSource(); // creates a sound source
    source.connect(this.gainNode);
    var buffer = this.bufferDict[noteNumber];
    if (buffer) {
      source.buffer = buffer;
      source.start(0);
      this.sources[noteNumber] = source;
    }
  },
  stop: function(noteNumber){
    for (var n in this.sources){
      source = this.sources[n];
      source.stop();
      delete this.sources[n];
    }
  }
}

LoudPianoPlayer = {
  increaseVolume: function(){
    var res = this.getVolume();
    this.setVolume(res + 0.1);
  },
  decreaseVolume: function(){
    if (this.gainNode.gain.value > 0) {
      var res = this.getVolume();
      this.setVolume(res - 0.1);
    }
  },
  getVolume: function(){
    return this.gainNode.gain.value;
  },
  setVolume: function(arg){
    this.gainNode.gain.value = arg;
  },
  init: function(){
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain();
    // Connect the source to the gain node.
    // Connect the gain node to the destination.
    this.gainNode.connect(this.ctx.destination);
    this.gainNode.gain.value = 2.5;

    // caching the buffer
    this.bufferDict = {};
    var self = this;
    _.range(21, 109).forEach(function(noteNumber) {
      var key = MIDI.noteToKey[noteNumber];
      var base64 = MIDI.Soundfont.mp3.acoustic_grand_piano[key].split(",")[1];
      var buffer = Base64Binary.decodeArrayBuffer(base64);
      self.ctx.decodeAudioData(buffer, function(buffer){
        self.bufferDict[noteNumber] = buffer;
      });
    });      
  },
  play: function(noteNumber) {
    var source = this.ctx.createBufferSource(); // creates a sound source
    source.connect(this.gainNode);
    var buffer = this.bufferDict[noteNumber];
    if (buffer) {
      source.buffer = buffer;
      source.start(0);
    }
  },
}

DrumPlayer = {
  increaseVolume: function(){
    var res = this.getVolume();
    this.setVolume(res + 0.1);
  },
  decreaseVolume: function(){
    if (this.gainNode.gain.value > 0) {
      var res = this.getVolume();
      this.setVolume(res - 0.1);
    }
  },
  getVolume: function(){
    return this.gainNode.gain.value;
  },
  setVolume: function(arg){
    this.gainNode.gain.value = arg;
  },
  init: function(){
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain();
    // Connect the source to the gain node.
    // Connect the gain node to the destination.
    this.gainNode.connect(this.ctx.destination);
    this.gainNode.gain.value = .7;

    // caching the buffer
    this.bufferDict = {};
    var self = this;
    _.range(21, 109).forEach(function(noteNumber) {
      var key = MIDI.noteToKey[noteNumber];
      var base64 = MIDI.Soundfont.mp3.percussion[key].split(",")[1];
      var buffer = Base64Binary.decodeArrayBuffer(base64);
      self.ctx.decodeAudioData(buffer, function(buffer){
        self.bufferDict[noteNumber] = buffer;
      });
    });      
  },
  play: function(noteNumber) {
    var source = this.ctx.createBufferSource(); // creates a sound source
    source.connect(this.gainNode);
    var buffer = this.bufferDict[noteNumber];
    if (buffer) {
      source.buffer = buffer;
      source.start(0);
    }
  },
}