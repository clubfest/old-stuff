
Template.sheet.rendered = function(){
  SheetDrawer.init(Editor);
}

Template.sheet.destroyed = function(){
  SheetDrawer.destroy();
}