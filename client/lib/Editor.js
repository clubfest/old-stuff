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
    this.reset();
    this.handleNoteDown();
    this.handleKeyDown();
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
    contents.splice(index, 1);
    this.setContents(contents);
  },
  navigateLeft: function(){
    this.decrementCurrentBeat();
  },
  navigateRight: function(){
    this.incrementCurrentBeat();
  },

  handleKeyDown: function(){
    var self = this;
    $(window).off('keydown.Editor');
    $(window).on('keydown.Editor', function(evt){
      if (evt.shiftKey) {
        if (evt.which === 32) { // Shift + space is rest
          self.insertRest();
        } else if (evt.which === 8){ // Shift + backspace is delete
          self.deleteContent();
        }
      } else {
        if (evt.which === 37) { // left arrow
          self.navigateLeft();
        } else if (evt.which === 39) { // rigt arrow
          self.navigateRight();
        } else if (evt.which === 32) { // space is increment current beat
          evt.preventDefault();
          self.insertSpace();
        }
      }
      // todo:
      // Shift + z is undo
      // Shift + y is redo
      // console.log(evt.which);
    });
  },

  destroy: function(){
    // $(window).off('beatDown.Editor');
    $(window).off('noteDown.Editor');
    $(window).off('keyDown.Editor');
  },

  reset: function(){
    this.setContents([]);
    this.resetCreatedAt();
    this.resetCurrentBeat();
    this.setIncrementSize(Fraction.create(1));
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
    };
  },
  getCreatedAt: function(){
    return this.createdAt.get();
  },
  resetCreatedAt: function(){
    this.createdAt.set(new Date);
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
      content.noteNumbers.push(noteNumber);
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
  resetCurrentBeat: function(){
    this.setCurrentBeatSyncIndex(Fraction.create(0));
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

  insertSpace: function(){
    this.incrementCurrentBeat();
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