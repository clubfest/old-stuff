

Template.edit.destroy = function(){
  Editor.destroy();
}

Template.edit.rendered = function(){
  Editor.init(this.data.songId);
}

Template.edit.helpers({
  currentBeat: function(){
    var beat = Editor.getCurrentBeat();
    if (beat) {
      return Fraction.toFloat(beat);
    }
  },
  chords: function(){
    return Editor.getContents();
  },
});

Template.edit.events({
  'click #save-chords': function(){
    Editor.save();
  }
})