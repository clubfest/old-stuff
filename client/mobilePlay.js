
Template.mobilePlay.created = function(){
  PlayEditor.init(this.data.songId);
}

Template.mobilePlay.rendered = function(){
  GuitarGui.init();
}

Template.mobilePlay.destroyed = function(){
  GuitarGui.destroy();
}