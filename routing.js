
Router.route('/', {
  name: 'home',
  data: function(){
    Meteor.subscribe('allSongs');
  },
});

Router.route('/edit/:_id', {
  name: 'edit',
  data: function(){
    var songId = this.params._id;
    Meteor.subscribe('song', songId);
    return {
      songId: songId,
    };
  },
});

Router.route('/play/:_id', {
  name: 'play',
  data: function(){
    var songId = this.params._id;
    Meteor.subscribe('song', songId);
    return {
      songId: songId,
    };
  },
});