// replace chords with contents
Editor = {
  harmonicContents: new ReactiveVar,
  bassContents: new ReactiveVar,
  currentBeat: new ReactiveVar,
  currentIndex: new ReactiveVar,
  // currentChord: new ReactiveVar,
  name: new ReactiveVar,
  createdAt: new ReactiveVar,
  pastOperations: [],
  presentOperations: [],
  incrementSize: new ReactiveVar,

  init: function(songId){
    this.setSongId(songId);
    this.reset(Songs.findOne(songId));
    this.handleNoteDown();
    Shortcuts.initEditor(this);
  },

  handleNoteDown: function(){
    var self = this;
    $(window).off('noteDown.Editor');
    $(window).on('noteDown.Editor', function(evt, data){
      self.addNoteToCurrentContent(data.noteNumber);
    });
  },

  insertRest: function(){
    this.addRestToCurrentContent();
    this.incrementCurrentBeat();
  },
  deleteContent: function(){
    var index = this.getCurrentIndex();
    var contents = this.getContents();
    var content = contents[index];
    if (content && Fraction.equal(content.startBeat, this.getCurrentBeat())) {
      contents.splice(index, 1);
      this.setContents(contents);
    } else {
      this.decrementCurrentBeat();
    }
  },
  navigateLeft: function(){
    this.decrementCurrentBeat();
  },
  navigateRight: function(){
    this.incrementCurrentBeat();
  },
  navigateRightWithSound: function(){
    var index = this.getCurrentIndex();
    var contents = this.getContents();
    var content = contents[index];
    if (content && Fraction.equal(content.startBeat, this.getCurrentBeat())) {
      if (content.noteNumbers && content.noteNumbers.length > 0) {
        content.noteNumbers.forEach(function(noteNumber){
          PianoPlayer.play(noteNumber);
        });
      } else {
        DrumPlayer.play(50);
      }
    } else {
      DrumPlayer.play(50);
    }
    this.incrementCurrentBeat();
  },
  navigateRightWithDrumSound: function(){
    var index = this.getCurrentIndex();
    var contents = this.getContents();
    var content = contents[index];
    if (content && Fraction.equal(content.startBeat, this.getCurrentBeat())) {
      if (content.noteNumbers && content.noteNumbers.length > 0) {
        // pass
      } else {
        DrumPlayer.play(50);
      }
    } else {
      DrumPlayer.play(50);
    }
    this.incrementCurrentBeat();
  },

  destroy: function(){
    $(window).off('noteDown.Editor');
  },

  reset: function(song){
    if (!song) song = {};

    this.setHarmonicContents(song.harmonicContents || []);
    this.setBassContents(song.bassContents || []);
    this.setCreatedAt(song.createdAt || new Date);
    this.setCurrentBeatSyncIndex(Fraction.create(0));
    this.setIncrementSize(song.incrementSize || Fraction.create(1));
  },

  createSong: function(){
    this.reset();
    Meteor.call('createSong', this.getSong(), function(err){
      if (err) {
        console.log(err.reason);
      }
    });
  },
  save: function(){
    Meteor.call('saveSong', this.getSongId(), this.getSong(), function(err){
      if (err){
        console.log(err.reason);
      } else {
        alert('Done');
      }
    });
  },

  // exclude the id
  getSong: function(){
    return {
      name: this.getName(),
      createdAt: this.getCreatedAt(),
      harmonicContents: this.getHarmonicContents(),
      currentBeat: this.getCurrentBeat(),
      incrementSize: this.getIncrementSize(),
      bassContents: this.getBassContents(),
    };
  },

  getHarmonicContents: function(){
    return this.harmonicContents.get();
  },
  setHarmonicContents: function(arg){
    this.harmonicContents.set(arg);
  },
  getBassContents: function(){
    return this.bassContents.get();
  },
  setBassContents: function(arg){
    this.bassContents.set(arg);
  },
  getCreatedAt: function(){
    return this.createdAt.get();
  },
  setCreatedAt: function(arg){
    this.createdAt.set(arg);
  },
  getName: function(){
    return this.name.get();
  },
  setName: function(arg){
    this.name.set(arg);
  },
  getSongId: function(){
    return this.songId;
  },
  setSongId: function(arg){
    this.songId = arg;
  },
  getContents: function(){
    return this.harmonicContents.get();
  },
  setContents: function(arg){
    this.harmonicContents.set(arg);
  },
  
  addRestToCurrentContent: function(){
    // todo: content.type = 'rest'
    var index = this.getCurrentIndex();
    var currentBeat = this.getCurrentBeat();
    var contents = this.getContents();
    var content = contents[index];
    var newContent = {
      noteNumbers: [],
      type: 'rest',
      startBeat: this.getCurrentBeat(),
    };

    if (!content || !Fraction.equal(content.startBeat, currentBeat)){
      contents.splice(index, 0, newContent);
    } else {
      contents.splice(index, 1, newContent);
    }

    this.setContents(contents);
  },
  addNoteToCurrentContent: function(noteNumber){
    if (noteNumber < 21 || noteNumber > 100) return ;

    var index = this.getCurrentIndex();
    var currentBeat = this.getCurrentBeat();
    var contents = this.getContents();
    var content = contents[index];

    if (!content || !Fraction.equal(content.startBeat, currentBeat)){
      content = {
        noteNumbers: [noteNumber],
        startBeat: this.getCurrentBeat(),
      };
      contents.splice(index, 0, content);
    } else {
      var repeated = false;
      for (var i = 0; i < content.noteNumbers.length; i++) {
        var n = content.noteNumbers[i];
        if (n === noteNumber) {
          repeated = true;
          break;
        }
      }
      if (!repeated) {
        content.noteNumbers.push(noteNumber);
      }
    }

    this.setContents(contents);
  },

  setIncrementSize: function(arg){
    this.incrementSize.set(arg);
  },
  getIncrementSize: function(){
    return this.incrementSize.get();
  },
  setCurrentBeat: function(arg){
    this.currentBeat.set(arg);
  },
  setCurrentBeatSyncIndex: function(arg){
    this.setCurrentBeat(arg);
    // todo: optimize
    var beat = this.getCurrentBeat();
    var contents = this.getContents(); 
    var index = contents.length;
    for (var i = 0; i < contents.length; i++) {
      var content = contents[i];
      if (Fraction.gte(content.startBeat, beat)) {
        index = i;
        break;
      }
    }
    this.setCurrentIndex(index);
  },
  getCurrentBeat: function(){
    return this.currentBeat.get();
  },
  incrementCurrentBeat: function(){
    this.setCurrentBeatSyncIndex(Fraction.plus(this.getCurrentBeat(), this.getIncrementSize()));
  },
  decrementCurrentBeat: function(){
    this.setCurrentBeatSyncIndex(Fraction.minus(this.getCurrentBeat(), this.getIncrementSize()));
  },

  getCurrentIndex: function(){
    return this.currentIndex.get();
  },
  setCurrentIndex: function(arg){
    this.currentIndex.set(arg);
  },
  setCurrentIndexSyncBeat: function(index){
    var contents = this.getContents();
    this.setCurrentIndex(index);
    this.setCurrentBeat(contents[index].startBeat);
  },

  insertSpace: function(){
    this.navigateRightWithDrumSound();
  },
}

BassEditor = _.extend({}, Editor);
BassEditor.getContents = function(){
  return this.bassContents.get();
}
BassEditor.setContents = function(arg){
  return this.bassContents.set(arg);
}


PlayEditor = _.extend({}, Editor);

PlayEditor.isStarted = new ReactiveVar;
PlayEditor.getIsStarted = function(){
  return this.isStarted.get();
}
PlayEditor.setIsStarted = function(arg){
  return this.isStarted.set(arg);
}

PlayEditor.init = function(songId){
  this.setSongId(songId);
  this.reset(Songs.findOne(songId));
  this.setCurrentBeatSyncIndex(Fraction.create(0));
  this.setIsStarted(false);
}

PlayEditor.destroy = function(){

}

PlayEditor.bassIndex = new ReactiveVar;
PlayEditor.setBassIndex = function(arg){
  this.bassIndex.set(arg);
}
PlayEditor.getBassIndex = function(){
  return this.bassIndex.get();
}
PlayEditor.setCurrentBeatSyncIndex = function(arg){
  this.setCurrentBeat(arg);
  // todo: optimize
  var beat = this.getCurrentBeat();

  var contents = this.getHarmonicContents(); 
  var index = contents.length;
  for (var i = 0; i < contents.length; i++) {
    var content = contents[i];
    if (Fraction.gte(content.startBeat, beat)) {
      index = i;
      break;
    }
  }
  this.setCurrentIndex(index);

  contents = this.getBassContents(); 
  index = contents.length;
  for (var i = 0; i < contents.length; i++) {
    var content = contents[i];
    if (Fraction.gte(content.startBeat, beat)) {
      index = i;
      break;
    }
  }
  this.setBassIndex(index);
}

PlayEditor.start = function(){
  if (!this.getIsStarted()) {
    this.setIsStarted(true);
    this.isHarmonicEnd = false;
    this.isBassEnd = false;
    this.playAndSetPlay();
  }
}

PlayEditor.stop = function(){
  window.clearTimeout(this.timeout);
  this.setIsStarted(false);
}

PlayEditor.playAndSetPlay = function(contents){
  var contents = this.getHarmonicContents();
  var currentIndex = this.getCurrentIndex();
  
  var currentTime = Fraction.toFloat(this.getCurrentBeat());
  var tempo = 60000 / Metronome.getBeatsPerMinute();

  for (var i = currentIndex; ; i++) {
    if (i < contents.length) {
      var content = contents[i];
      var time = Fraction.toFloat(content.startBeat);
      if (currentTime <= time && time < currentTime + 1) {
        var delay = (time - currentTime) * tempo;
        window.setTimeout(function(content){
          if (content.noteNumbers) {
            content.noteNumbers.forEach(function(noteNumber){
              PianoPlayer.play(noteNumber);
            });
          }
        }, delay, content);
      } else {
        this.setCurrentIndex(i);
        break ;
      }
    } else {
      this.isHarmonicEnd = true;
      break;
    }
  }

  contents = this.getBassContents();
  currentIndex = this.getBassIndex();

  for (var i = currentIndex; ; i++) {
    if (i < contents.length) {
      var content = contents[i];
      var time = Fraction.toFloat(content.startBeat);
      if (currentTime <= time && time < currentTime + 1) {
        var delay = (time - currentTime) * tempo;
        window.setTimeout(function(content){
          if (content.noteNumbers) {
            BassPlayer.stop();
            content.noteNumbers.forEach(function(noteNumber){
              BassPlayer.play(noteNumber);
            });
          }
        }, delay, content);
      } else {
        this.setBassIndex(i);
        break ;
      }
    } else {
      this.isBassEnd = true;
      break;
    }
  }

  DrumPlayer.play(50);

  // future sound
  var delay = 1 * tempo;
  var self = this;

  this.timeout = window.setTimeout(function(){
    if (self.isHarmonicEnd && self.isBassEnd) {
      self.setCurrentBeatSyncIndex(Fraction.create(0));
      self.isHarmonicEnd = false;
      self.isBassEnd = false;
    } else {
      self.setCurrentBeat(Fraction.create(currentTime + 1));
      // self.setCurrentBeatSyncIndex(Fraction.create(currentTime + 1));
    }
    self.playAndSetPlay();
  }, delay);
}

isInt = function(num){
  return Math.ceil(num) - num === 0;
}