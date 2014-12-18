
Template.sheet.rendered = function(){
  console.log(this)
  SheetDrawer.init();
}

Template.sheet.destroyed = function(){
  SheetDrawer.destroy();
}