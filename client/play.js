
Template.play.created = function(){
  PlayEditor.init(this.data.songId);
}

Template.play.events({
  'click #start': function(){
    PlayEditor.start();
  },
  'click #stop': function(){
    PlayEditor.stop();
  },
});

Template.play.helpers({
  isStarted: function(){
    return PlayEditor.getIsStarted();
  },
});