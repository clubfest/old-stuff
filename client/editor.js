Template.edit.created = function(){
  Editor.init(this.data.songId);
}

Template.edit.destroyed = function(){
  Editor.destroy();  
}

Template.edit.rendered = function(){
}

Template.edit.helpers({
  currentBeat: function(){
    var beat = Editor.getCurrentBeat();
    if (beat) {
      return Fraction.toFloat(beat);
    }
  },
  chords: function(){
    return Editor.getHarmonicContents();
  },
  name: function(){
    return Editor.getName();
  },
});

Template.edit.events({
  'click #save': function(){
    Editor.save();
  },
  'click #set-name': function(){
    var name = prompt('Title');
    if (name) {
      Editor.setName(name);
    }
  },
})