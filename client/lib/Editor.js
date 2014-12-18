// replace chords with contents
Editor = {
  contents: new ReactiveVar,
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
    Shortcuts.initEditor();
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

    this.setContents(song.contents || []);
    this.setCreatedAt(song.createdAt || new Date);
    this.setCurrentBeatSyncIndex(song.currentBeat || Fraction.create(0));
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
      }
    });
  },

  // exclude the id
  getSong: function(){
    return {
      name: this.getName(),
      createdAt: this.getCreatedAt(),
      contents: this.getContents(),
      currentBeat: this.getCurrentBeat(),
      incrementSize: this.getIncrementSize(),
    };
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
    return this.contents.get();
  },
  setContents: function(arg){
    this.contents.set(arg);
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

  // setPastOperations: function(arg) {
  //   this.pastOperations = arg;
  // },
  // getPastOperations: function(){
  //   return this.pastOperations;
  // },
  // setPresentOperations: function(arg) {
  //   this.presentOperations = arg;
  // },
  // getPresentOperations: function(){
  //   return this.presentOperations;
  // },
  

  // undo: function(){
  //   var op = this.pastOperations.pop();
  //   if (op) {
  //     this.reverseOperation(op);
  //   }
  // },
  // redo: function(){
  //   var op = this.presentOperations.pop();
  //   if (op){
  //     this.applyOperation(op);
  //   }
  // },

  // reverseOperation: function(op){
  //   switch (op.name) {
  //     case "insert":
  //       this.applyUninsert(op.info);
  //       break;
  //     case "insertSpace":
  //       this.decrementCurrentBeat();
  //       break;
  //     case "zoom":
  //       this.applyUnzoom(op.info);
  //       break;
  //     case "lowerPitch":
  //       this.higherPitch();
  //       break;
  //     case "higherPitch":
  //       this.lowerPitch();
  //       break;
  //     default:
  //       break;
  //   }
  //   this.presentOperations.push(op);
  // },

  // applyOperation: function(op){
  //   switch (op.name) {
  //     case "insert":
  //       this.applyInsert(op.info);
  //       break;
  //     case "insertSpace":
  //       this.incrementCurrentBeat();
  //       break;
  //     default:
  //       break;
  //   }
  //   this.pastOperations.push(op);
  // },

  // insertSpace: function(){
  //   this.applyOperation(this.createInsertSpaceOp());
  // },

  // createInsertSpaceOp: function(){
  //   this.presentOperations = []; // prevent redo after new operation
  //   return {
  //     name: 'insertSpace',
  //     info: {},
  //   }
  // },


  // // remove present operations when we create new things
  // createInsertOp: function(newContent){
  //   var contents = this.getContents();
  //   var currentBeat = this.getCurrentBeat();
  //   var currentIndex = this.getCurrentIndex();
  //   var oldContent = null;
  //   if (currentIndex < contents.length) {
  //     oldContent = contents[currentIndex];
  //     if (!Fraction.equal(oldContent.startBeat, currentBeat)){
  //       oldContent = null;
  //     }
  //   }

  //   this.presentOperations = []; // prevent redo after new operation
  //   newContent.startBeat = currentBeat; // annotate

  //   return {
  //     name: 'insert',
  //     info: {
  //       content: newContent,
  //       oldContent: oldContent,
  //       currentIndex: currentIndex,
  //       currentBeat: currentBeat,
  //     } 
  //   };
  // },

  // applyInsert: function(info){
  //   this.setCurrentBeat(info.currentBeat);
  //   var contents = this.getContents();
  //   if (info.oldContent) {
  //     contents.splice(info.currentIndex, 1, info.content);
  //   } else {
  //     contents.splice(info.currentIndex, 0, info.content);
  //   }
  //   this.setContents(contents);
  //   this.incrementCurrentBeat();
  // },

  // applyUninsert: function(info){
  //   var contents = this.getContents();
  //   if (info.oldContent) {
  //     contents.splice(info.currentIndex, 1, info.oldContent);
  //   } else {
  //     contents.splice(info.currentIndex, 1);
  //   }
  //   this.setContents(contents);
  //   this.setCurrentBeatSyncIndex(info.currentBeat);
  // },
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

PlayEditor.start = function(){
  if (!this.getIsStarted()) {
    this.setIsStarted(true);
    this.playAndSetPlay();
  }
}

PlayEditor.stop = function(){
  window.clearTimeout(this.timeout);
  this.setIsStarted(false);
}

PlayEditor.playAndSetPlay = function(contents){
  var contents = this.getContents();
  var currentIndex = this.getCurrentIndex();
  if (contents.length > currentIndex) {
    var content = contents[currentIndex];
    this.setCurrentBeat(content.startBeat); // todo: use incrementSize

    var isEnd = false;
    if (contents.length > currentIndex + 1) {
      this.setCurrentIndex(currentIndex + 1);
      var nextContent = contents[currentIndex + 1];
      var numBeats = Fraction.toFloat(nextContent.startBeat) - Fraction.toFloat(content.startBeat);
    } else {
      isEnd = true;
      var beatsPerMeasure = 4;
      var measures = Fraction.toFloat(content.startBeat) / beatsPerMeasure;
      var numBeats = (Math.ceil(measures) - measures) * beatsPerMeasure;
      if (numBeats === 0) numBeats = beatsPerMeasure;
    }

    var tempo = 60000 / Metronome.getBeatsPerMinute();
    // current sound
    if (content.noteNumbers) {
      content.noteNumbers.forEach(function(noteNumber){
        PianoPlayer.play(noteNumber);
      });
    }
    var start = Fraction.toFloat(content.startBeat);
    var offset = Math.ceil(start) - start;
    for (var i = 0; i < numBeats; i++) {
      window.setTimeout(function(){
        DrumPlayer.play(50);
      }, (offset + i) * tempo);
    }

    // future sound
    var time = numBeats * tempo;
    var self = this;
    this.timeout = window.setTimeout(function(){
      if (isEnd) self.setCurrentBeatSyncIndex(Fraction.create(0));
      self.playAndSetPlay();
    }, time);
  }
}

isInt = function(num){
  return Math.ceil(num) - num === 0;
}