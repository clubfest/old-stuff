
Metronome = {
  beatsPerMinute: new ReactiveVar,
  beatsPerMeasure: new ReactiveVar,
  isStarted: new ReactiveVar,
  swing: new ReactiveVar,
  init: function(){
    this.setBeatsPerMinute(60);
    this.setBeatsPerMeasure(4);
    this.getIsStarted(false);
  },
  setBeatsPerMinute: function(arg){
    this.beatsPerMinute.set(arg);
  },
  setBeatsPerMeasure: function(arg){
    this.beatsPerMeasure.set(arg);
  },
  getBeatsPerMinute: function(){
    return this.beatsPerMinute.get();
  },
  getBeatsPerMeasure: function(){
    return this.beatsPerMeasure.get();
  },
  setIsStarted: function(arg){
    this.isStarted.set(arg);
  },
  getIsStarted: function(){
    return this.isStarted.get();
  },

  start: function(){
    if (!this.getIsStarted()) {
      this.isStarted.set(true);
      this.clickAndSetClick();
    }
  },
  stop: function(){
    window.clearTimeout(this.timeout);
    this.setIsStarted(false);
  },
  clickAndSetClick: function(){
    var tempo = 60000 / this.getBeatsPerMinute();
    var beats = this.getBeatsPerMeasure();
    for (var i = 0; i < beats; i++) {
      window.setTimeout(function(){
        DrumPlayer.play(50);
      }, i * tempo);
    }

    // window.setTimeout(function(){
    //   DrumPlayer.play(50);
    // }, (beats - 0.3) * tempo);

    var self = this;
    this.timeout = window.setTimeout(function(){
      self.clickAndSetClick();
    }, beats * tempo);
  },
}