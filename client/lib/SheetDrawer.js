
SheetDrawer = {
  measuresPerLine: 4,
  beatsPerMeasure: 4,
  margin: 10,
  init: function(){
    this.computeDimensions();
    this.paper = new Raphael($('#sheet')[0], this.width - 2 * this.margin, this.height);

    var self = this;
    Tracker.autorun(function(){
      self.draw();
    });
  },
  destroy: function(){
    this.paper.remove();
  },

  computeDimensions: function(){
    this.width = $(window).width();
    this.height = $(window).height();
    this.measureWidth = Math.floor((this.width - 2 * this.margin) / this.measuresPerLine);
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
    var beat = Fraction.toFloat(Editor.getCurrentBeat());
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
    var contents = Editor.getContents();

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
      var textElt = this.paper.text(x, y, text);
      textElt.attr({
        'font-size': 15,
        'text-anchor': 'start',
      });
    }
  },
  drawMeasureBars: function(){
    var contents = Editor.getContents();
    var endContent = contents[contents.length - 1];
    var currentBeat = Fraction.toFloat(Editor.getCurrentBeat());
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
        var endY = y + this.measureHeight;
        var x = (width % lineWidth) + this.margin / 2;
        var pathString = 'M' + x + ',' + y + 'L' + x + ',' + endY;
        this.paper.path(pathString);
      }
    }

  },
}