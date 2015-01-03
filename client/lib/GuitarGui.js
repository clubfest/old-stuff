
GuitarGui = {  
  TRANSPARENT_OPACITY: 0.2,
  MURKY_OPACITY: 0.6,
  chordElt: [],
  arrow: null,
  menuOptions: [
    {
      name: 'Start',
      action: function(){
        PlayEditor.start();
      },
    }, {
      name: 'Stop',
      action: function(){
        PlayEditor.stop();
      },
    }, {
      name: 'Home',
      action: function(){
        Router.go('home');
      },
    },
    {
      name: 'Lower',
      action: function(){
        GuitarGui.setSmallestNoteNumber(GuitarGui.getSmallestNoteNumber() - GuitarGui.getJump());
        GuitarGui.setKeyColumnOffset(GuitarGui.getKeyColumnOffset() - 1);
        GuitarGui.refillKeyColumns();
      },
    }, {
      name: 'Higher',
      action: function(){
        GuitarGui.setSmallestNoteNumber(GuitarGui.getSmallestNoteNumber() + GuitarGui.getJump());
        GuitarGui.setKeyColumnOffset(GuitarGui.getKeyColumnOffset() + 1);
        GuitarGui.refillKeyColumns();
      },
    },
  ],

  init: function(info){

    this.setSmallestNoteNumber(54);
    this.setJump(4);
    this.setMenuOffset(0);
    this.setKeyColumnOffset(0);

    this.setKeyWidth(45);
    this.setKeyHeight(45);
    this.computeDimensions();
    this.paper = new Raphael(0, 0, this.width, this.height); // 1
    this.draw(); // 2
    // this.onKeyDragHandler.initDisplay(); // 3
    
    $(window).on('resize.GuitarGui', _.bind(this.reinit, this));
  },

  resetKeyTouchElement: function(){
    this.keyTouchElements = {};
  },
  addKeyTouchElement: function(row, col, elt){
    this.keyTouchElements[row + ',' + col] = elt;
  },
  getKeyTouchElement: function(row, col){
    var id = row + ',' + col;
    return this.keyTouchElements[id];
  },
  resetKeyTextElement: function(){
    this.keyTextElements = {};
  },
  addKeyTextElement: function(row, col, elt){
    this.keyTextElements[row + ',' + col] = elt;
  },
  getKeyTextElement: function(row, col){
    var id = row + ',' + col;
    return this.keyTextElements[id];
  },

  resetContentTextElements: function(){
    this.contentTextElements = [];
  },
  addContentTextElement: function(elt){
    this.contentTextElements.push(elt);
  },
  getContentTextElement: function(col){
    return this.contentTextElements[col];
  },
  resetContentTouchElements: function(){
    this.contentTouchElements = [];
  },
  addContentTouchElement: function(elt){
    this.contentTouchElements.push(elt);
  },
  getContentTouchElement: function(col){
    return this.contentTouchElements[col];
  },
  getContentLength: function(){
    return this.contentTextElements.length;
  },

  forEachKeyTextElement: function(callback){
    for (var prop in this.keyTextElements){
      callback(this.keyTextElements[prop]);
    }
  },

  resetMenuTextElements: function(){
    this.menuTextElements = [];
  },
  addMenuTextElement: function(elt){
    this.menuTextElements.push(elt);
  },
  getMenuTextElement: function(row){
    return this.menuTextElements[row];
  },
  resetMenuTouchElements: function(){
    this.menuTouchElements = [];
  },
  addMenuTouchElement: function(elt){
    this.menuTouchElements.push(elt);
  },
  getMenuTouchElement: function(row){
    return this.menuTouchElements[row];
  },
  getMenuLength: function(){
    return this.menuTextElements.length;
  },

  setMenuOffset: function(arg){
    this.menuOffset = arg;
  },
  getMenuOffset: function(){
    return this.menuOffset || 0;
  },

  reinit: function(){
    this.computeDimensions();
    this.paper.remove();
    this.arrow.remove();
    this.paper = new Raphael(0, 0, this.width, this.height); // 1
    this.arrow = this.paper.path("");
    this.draw(); // 2
    this.onKeyDragHandler.initDisplay(); // 3
  },

  setPositionToGetChords: function(arg){
    this.positionToGetChords = arg;
  },
  getGetChord: function(x, y){
    return this.positionToGetChords[x + ',' + y];
  },
  forEachGetChord: function(callback){
    for (var prop in this.positionToGetChords){
      var res = {};
      res.x = parseInt(prop.split(',')[0]);
      res.y = parseInt(prop.split(',')[1]);
      res.getChord = this.positionToGetChords[prop];
      callback(res);
    }
  },

  displayContentText: function(col, text){
    var elt = this.getContentTextElement(col);
    elt.attr({text: text});
  },

  displayMenuText: function(col, text){
    var elt = this.getMenuTextElement(col);
    elt.attr({text: text});
  },
  displayChord: function(content){
    this.chordElt = [];
    var start = this.getKeyTouchElement(content.startRow, content.startCol);    
    start.attr({fill: '#bce'});
    this.chordElt.push(start);

    if (content.rowDiff !== 0 || content.colDiff !== 0){
      var end = this.getKeyTouchElement(content.startRow - content.rowDiff, content.startCol + content.colDiff);
      var pathString = 'M' + start.data('x') + ',' + start.data('y')
      pathString += 'L' + end.data('x') + ',' + end.data('y');
      this.arrow.attr({
        path: pathString,
        'arrow-end': 'classic-wide-long',
        'stroke-width': 3,
      });
    }
  },
  undisplayChords: function(){
    var self = this;
    this.chordElt.forEach(function(elt){
      elt.attr({fill: self.getKeyFills(elt.data('col'))});
    });
    this.arrow.attr({'arrow-end': "none",});
    this.arrow.attr({path: "",});
  },

  annotateContentTouch: function(col, data){
    var touchElt = this.getContentTouchElement(col);
    if (touchElt) {
      touchElt.data('annotation', data); 
    }
  },

  displayKeyText: function(row, col, text){
    var elt = this.getKeyTextElement(row, col);
    if (elt) {
      elt.attr({text: text});
    }
  },
  clearKeyTexts: function(){
    this.forEachKeyTextElement(function(elt){
      elt.attr({text: ""});
    });
  },

  clearContentTextAndTouchElements: function(){
    for (var col = 0; col < this.getNumCols(); col++) {
      this.displayContentText(col, "");
      this.annotateContentTouch(col, null); // todo: replace
    }
  },

  setJump: function(arg){
    this.jump = arg;
  },
  getJump: function(){
    return this.jump;
  },

  setKeyWidth: function(arg){ this.keyWidth = arg; },
  setKeyHeight: function(arg) { this.keyHeight = arg; },
  getKeyWidth: function(){ return this.keyWidth; },
  getKeyHeight: function(){ return this.keyHeight; },

  setSmallestNoteNumber: function(arg){
    this.smallestNoteNumber = arg;
  },
  getSmallestNoteNumber: function(arg){
    return this.smallestNoteNumber;
  },
  destroy: function(){
    this.paper.remove();
    $(window).off('resize.GuitarGui')
  },

  computeDimensions: function(){
    this.width = $(window).width();
    this.height = $(window).height();
    this.numCols = Math.floor(this.width / this.keyWidth);
    this.numRows = Math.floor(this.height / this.keyHeight);
  },

  getNumCols: function(){
    return this.numCols;
  },
  getNumRows: function(){
    return this.numRows;
  },

  draw: function(){
    this.drawKeys();
    this.handleContentTouch();
    this.resetMenuOptionHandlers();
  },

  handleContentTouch: function(){
    var self = this;
    for (var i = 0; i < this.getContentLength(); i++){
      var touchElt = this.getContentTouchElement(i);
      touchElt.undrag();
      var onMove = function(){};
      var onStart = function(){
        this.attr({'fill-opacity': self.MURKY_OPACITY});
      };
      var onEnd = function(){
        SongManager.handleContentTouch(this.data('annotation'));
        this.attr({'fill-opacity': self.TRANSPARENT_OPACITY});
      };
      touchElt.drag(onMove, onStart, onEnd);
    }
  },

  resetMenuOptionHandlers: function(){
    var self = this;
    var length = this.getMenuLength();

    for (var i = 0; i < length; i++) {
      this.displayMenuText(i, "");
      this.getMenuTouchElement(i).undrag();
    }

    if (this.menuOptions.length > length - 1) {
      this.displayMenuText(length - 1, 'More');
      var touchElt = this.getMenuTouchElement(length - 1);
      var onMove = function(){};
      var onStart = function(){
        this.attr({'fill-opacity': self.MURKY_OPACITY});
      };
      var onEnd = function(){
        self.rotateMenu();
        this.attr({'fill-opacity': self.TRANSPARENT_OPACITY});
      };
      touchElt.drag(onMove, onStart, onEnd);
    }

    this.menuOptions.forEach(function(option, i){
      var j = i - self.getMenuOffset();
      if (j >= 0 && j < length - 1) {
        var touchElt = self.getMenuTouchElement(j);
        self.displayMenuText(j, option.name);
        var onMove = function(){};
        var onStart = function(){
          this.attr({'fill-opacity': self.MURKY_OPACITY});
        };
        var onEnd = function(){
          this.attr({'fill-opacity': self.TRANSPARENT_OPACITY});
          option.action();
        };
        touchElt.drag(onMove, onStart, onEnd);
      }
    });
  },

  // 3 colors for the strings
  getKeyFills: function(col) {
    var dict = { 
      0: '#e60',
      1: '#e90',
      2: '#fa2',
    };
    col = (col + this.getKeyColumnOffset()) % 3;
    if (col < 0) col += 3;

    return dict[col];
  },
  getKeyColumnOffset: function(){
    return this.stringOffset || 0;
  },
  setKeyColumnOffset: function(arg){
    this.stringOffset = arg;
  },
  refillKeyColumns: function(){
    for (var k = 0; k < this.numCols - 1; k++) {
      for (var i = 0; i < this.numRows - 1; i++) {
        var touchElt = this.getKeyTouchElement(i, k);
        touchElt.attr({fill: this.getKeyFills(k)});
      }
    }
  },

  drawKeys: function(){
    var self = this;
    this.resetKeyTextElement();
    this.resetKeyTouchElement();
    this.resetContentTextElements();
    this.resetContentTouchElements();
    this.resetMenuTextElements();
    this.resetMenuTouchElements();

    for (var i = 0; i < this.numRows; i++){
      for (var k = 0; k < this.numCols; k++){
        var x = k * this.keyWidth;
        var y = i * this.keyHeight;

        // 1: text elements
        if (i === self.numRows - 1) { // bottom row is content
          var textElt = this.paper.text(x + this.keyWidth / 2, y + this.keyHeight / 2, "");
          textElt.attr({'font-size': 11});
          this.addContentTextElement(textElt)

        } else if (k === self.numCols - 1){ // right column is menu
          var textElt = this.paper.text(x + this.keyWidth / 2, y + this.keyHeight / 2, "");
          textElt.attr({'font-size': 10});
          this.addMenuTextElement(textElt);

        } else { // everything else is a key
          var textElt = this.paper.text(x + this.keyWidth / 2, y + this.keyHeight / 2, "");
          textElt.attr({
            'font-size': 8,
          });
          this.addKeyTextElement(i, k, textElt);
        }

        // 2: touch elements
        var touchElt = this.paper.rect(x, y, this.keyWidth, this.keyHeight); 
        touchElt.data('row', i).data('col', k)
          .data('x', x + this.keyWidth / 2)
          .data('y', y + this.keyHeight / 2);

        if (i === self.numRows - 1) { // bottom row is content
          touchElt.attr({
            'fill-opacity': this.TRANSPARENT_OPACITY,
            fill: '#fff',
          });
          this.addContentTouchElement(touchElt);
        } else if (k === self.numCols - 1){ // right column is menu
          touchElt.attr({
            'fill-opacity': this.TRANSPARENT_OPACITY,
            fill: '#fff',
          });
          this.addMenuTouchElement(touchElt);
        } else { // everything else is a key
          touchElt.attr({
            'fill-opacity': this.MURKY_OPACITY,
            fill: this.getKeyFills(k),
          });
          touchElt.data('fill', this.getKeyFills(k)); // todo: remove this;

          var noteNumber = self.positionToNoteNumber(i, k);
          var hasNote = typeof MIDI.noteToKey[noteNumber] !== 'undefined';
          if (hasNote) {
            // todo: remove noteNumber data
            var onMove = function(){};
            var onStart = function(){
              var row = this.data('row');
              var col = this.data('col');
              LoudPianoPlayer.play(self.positionToNoteNumber(row, col));
            };
            var onEnd = function(){};

            touchElt.data('noteNumber', noteNumber)
              .drag(onMove, onStart, onEnd);
          }
        }
        this.addKeyTouchElement(i, k, touchElt)
      }
    }
  },

  rotateMenu: function(){
    var offset = this.getMenuOffset();
    var length = this.getMenuLength();
    if (offset + length  - 1 >= this.menuOptions.length){
      this.setMenuOffset(0);
    } else {
      this.setMenuOffset(offset + length - 1);
    }
    this.reinit();
    // this.resetMenuOptionHandlers();
  },

  


  setTouchElements: function(arg){
    this.keys = arg;
  },

  positionToNoteNumber: function(row, col){
    return this.getSmallestNoteNumber() + col * this.getJump() + row;
  },


}

function fixedFromCharCode (codePt) {
    if (codePt > 0xFFFF) {
        codePt -= 0x10000;
        return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
    }
    else {
        return String.fromCharCode(codePt);
    }
}