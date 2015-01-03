
Template.bassSheet.rendered = function(){
  BassSheetDrawer.init(BassEditor);
}

Template.bassSheet.destroyed = function(){
  BassSheetDrawer.destroy();
}