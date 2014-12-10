
Template.metronome.helpers({
  beatsPerMeasure: function(){
    return Metronome.getBeatsPerMeasure();
  },
  beatsPerMinute: function(){
    return Metronome.getBeatsPerMinute();
  },
  isStarted: function(){
    return Metronome.getIsStarted();
  },
});

Template.metronome.events({
  'click #metronome-toggle': function(){
    if (!Metronome.getIsStarted()) {
      Metronome.start();
    } else {
      Metronome.stop();
    }
  },
  'click #increase-tempo': function(){
    Metronome.setBeatsPerMinute(Metronome.getBeatsPerMinute() + 10);
  },
  'click #decrease-tempo': function(){
    var res = Metronome.getBeatsPerMinute() - 10;
    if (res > 0) {
      Metronome.setBeatsPerMinute(res);
    }
  },
  'click #increase-beats-per-measure': function(){
    Metronome.setBeatsPerMeasure(Metronome.getBeatsPerMeasure() + 1);
  },
  'click #decrease-beats-per-measure': function(){
    var res = Metronome.getBeatsPerMeasure() - 1;
    if (res > 0) {
      Metronome.setBeatsPerMeasure(res);
    }
  },
});