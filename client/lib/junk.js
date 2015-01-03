

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