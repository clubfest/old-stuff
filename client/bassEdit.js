Template.bassEdit.created = function(){
  BassEditor.init(this.data.songId);
}

Template.bassEdit.destroyed = function(){
  BassEditor.destroy();  
}


Template.bassEdit.helpers({
  name: function(){
    return Editor.getName();
  },
});

Template.bassEdit.events({
  'click #save': function(){
    BassEditor.save();
  },
});