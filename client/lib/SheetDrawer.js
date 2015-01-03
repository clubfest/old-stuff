
SheetDrawer = {
  measuresPerLine: 4,
  beatsPerMeasure: 4,
  margin: 10,
  init: function(editor){
    this.editor = editor
    this.computeDimensions();
    this.paper = new Raphael($('#sheet')[0], this.width, this.height);

    var self = this;
    this.drawComputation = Tracker.autorun(function(){
      self.draw();
    });
  },
  destroy: function(){
    this.drawComputation.stop();
    this.paper.remove();
  },

  computeDimensions: function(){
    this.width = $(window).width() - 2 * this.margin;
    this.height = $(window).height();
    this.measureWidth = Math.floor(this.width / this.measuresPerLine);
    this.beatWidth = Math.floor(this.measureWidth / this.beatsPerMeasure);
    this.measureHeight = 90;
  },

  draw: function(){
    this.paper.clear();
    this.drawContents();
    this.drawMeasureBars();
    this.drawPointer();

  },

  drawPointer: function(){
    var beat = Fraction.toFloat(this.editor.getCurrentBeat());
    var width = beat * this.beatWidth;
    var lineWidth = (this.beatsPerMeasure * this.measuresPerLine * this.beatWidth);
    var line = Math.floor(width / lineWidth);

    var y = line * this.measureHeight + 10;
    var endY = y + 20;
    var x = (width % lineWidth) + this.margin / 2;

    var pathString = 'M' + x + ',' + y + 'L' + x + ',' + endY;
    var path = this.paper.path(pathString);
    path.attr({
      'arrow-end': 'classic-wide-long',
      'stroke-width': 2,
    });

  },

  drawContents: function(){
    var contents = this.editor.getHarmonicContents();

    for (var i = 0; i < contents.length; i++) {
      var content = contents[i];
      var beat = Fraction.toFloat(content.startBeat);
      var width = beat * this.beatWidth;
      var lineWidth = (this.beatsPerMeasure * this.measuresPerLine * this.beatWidth);
      var line = Math.floor(width / lineWidth);

      var y = (line + 0.5) * this.measureHeight ;
      var x = (width % lineWidth) + this.margin / 2;

      var text = "";
      if (content.noteNumbers) {
        var noteNumbers = content.noteNumbers.slice();
        noteNumbers.sort(function(a,b){ return b - a; });
        noteNumbers.forEach(function(noteNumber){
          text += MIDI.noteToKey[noteNumber] + "\n";
        });
      } 
      if (content.type === 'rest') {
        text = 'R';
      }
      var textElt = this.paper.text(x, y, text);
      textElt.attr({
        'font-size': 15,
        'text-anchor': 'start',
      });
    }

    // resize height if y is too big
    if (y && y > this.height){
      this.height += this.measureHeight;
      this.paper.setSize(this.width, this.height);
    }
  },
  drawMeasureBars: function(){
    var contents = this.editor.getContents();
    var endContent = contents[contents.length - 1];
    var currentBeat = Fraction.toFloat(this.editor.getCurrentBeat());
    var endBeat = currentBeat + 4;
    if (endContent){
      var beat = Fraction.toFloat(endContent.startBeat);
      beat += 4;
      endBeat = Math.max(beat, endBeat);
    }

    for (var beat = 0; beat <= endBeat; beat++){
      if (beat % 4 === 0) {
        var width = beat * this.beatWidth;
        var lineWidth = (this.beatsPerMeasure * this.measuresPerLine * this.beatWidth);
        var line = Math.floor(width / lineWidth);
        var y = line * this.measureHeight + 10;
        var endY = y + this.measureHeight - 10;
        var x = (width % lineWidth) + this.margin / 2;
        var pathString = 'M' + x + ',' + y + 'L' + x + ',' + endY;
        this.paper.path(pathString);
      }
    }
  },
}

BassSheetDrawer = _.extend({}, SheetDrawer);

BassSheetDrawer.drawContents = function(){
  var contents = this.editor.getHarmonicContents();

  for (var i = 0; i < contents.length; i++) {
    var content = contents[i];
    var beat = Fraction.toFloat(content.startBeat);
    var width = beat * this.beatWidth;
    var lineWidth = (this.beatsPerMeasure * this.measuresPerLine * this.beatWidth);
    var line = Math.floor(width / lineWidth);

    var y = (line + 0.4) * this.measureHeight ;
    var x = (width % lineWidth) + this.margin / 2;

    var text = "";
    if (content.noteNumbers) {
      var noteNumbers = content.noteNumbers.slice();
      noteNumbers.sort(function(a,b){ return b - a; });
      noteNumbers.forEach(function(noteNumber){
        text += MIDI.noteToKey[noteNumber] + "\n";
      });
    } 
    if (content.type === 'rest') {
      text = 'R';
    }
    var textElt = this.paper.text(x, y, text);
    textElt.attr({
      'font-size': 12,
      'text-anchor': 'start',
    });
  } 

  // resize height if y is too big
  if (y && y > this.height){
    this.height += this.measureHeight;
    this.paper.setSize(this.width, this.height);
  }

  contents = this.editor.getBassContents();

  for (var i = 0; i < contents.length; i++) {
    var content = contents[i];
    var beat = Fraction.toFloat(content.startBeat);
    var width = beat * this.beatWidth;
    var lineWidth = (this.beatsPerMeasure * this.measuresPerLine * this.beatWidth);
    var line = Math.floor(width / lineWidth);

    var y = (line + 0.9) * this.measureHeight ;
    var x = (width % lineWidth) + this.margin / 2;

    var text = "";
    if (content.noteNumbers) {
      var noteNumbers = content.noteNumbers.slice();
      noteNumbers.sort(function(a,b){ return b - a; });
      noteNumbers.forEach(function(noteNumber){
        text += MIDI.noteToKey[noteNumber] + "\n";
      });
    } 
    if (content.type === 'rest') {
      text = 'R';
    }
    var textElt = this.paper.text(x, y, text);
    textElt.attr({
      'font-size': 15,
      'text-anchor': 'start',
    });
  }

  // resize height if y is too big
  if (y && y > this.height){
    this.height += this.measureHeight;
    this.paper.setSize(this.width, this.height);
  }
}

PlaySheetDrawer = _.extend({}, SheetDrawer);

PlaySheetDrawer.drawContents = function(){
  var contents = this.editor.getHarmonicContents();
  var bassContents = this.editor.getBassContents();

  for (var i = 0; i < contents.length; i++) {
    var content = contents[i];
    var beat = Fraction.toFloat(content.startBeat);
    var width = beat * this.beatWidth;
    var lineWidth = (this.beatsPerMeasure * this.measuresPerLine * this.beatWidth);
    var line = Math.floor(width / lineWidth);

    var y = (line + 0.4) * this.measureHeight ;
    var x = (width % lineWidth) + this.margin / 2;

    var text = "";
    var recognized = false;
    for (var j = 0; j < bassContents.length; j++) {
      var bassContent = bassContents[j];
      var bassBeat = Fraction.toFloat(bassContent.startBeat);
      if (bassBeat === beat && bassContent.noteNumbers.length > 0) {
        var root = bassContent.noteNumbers[0];
        var chord = Chord.classify(root, content.noteNumbers);
        if (chord) {
          text = MIDI.noteToKey[root];
          text = text.slice(0, -1);
          text += chord;
          recognized = true;
        }
        break;
      } else if (bassBeat > beat) {
        break;
      }
    }
    if (!recognized && content.noteNumbers) {
      var noteNumbers = content.noteNumbers.slice();
      noteNumbers.sort(function(a,b){ return b - a; });
      noteNumbers.forEach(function(noteNumber){
        text += MIDI.noteToKey[noteNumber] + "\n";
      });
    } 
    
    var textElt = this.paper.text(x, y, text);
    textElt.attr({
      'font-size': 12,
      'text-anchor': 'start',
    });
  } 

  // resize height if y is too big
  if (y && y > this.height){
    this.height += this.measureHeight;
    this.paper.setSize(this.width, this.height);
  }
}
