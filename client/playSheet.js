
Template.playSheet.rendered = function(){
  PlaySheetDrawer.init(PlayEditor);
}

Template.playSheet.destroyed = function(){
  PlaySheetDrawer.destroy();
}