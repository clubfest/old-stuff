
Router.route('/', {
  name: 'home',
});

Router.route('/edit/:_id', {
  name: 'edit',
  data: function(){
    return {
      songId: this.params._id,
    };
  },
});