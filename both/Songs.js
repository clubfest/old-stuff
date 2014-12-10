
Songs = new Ground.Collection('songs');

Meteor.methods({
  createSong: function(song){
    var songId = Songs.insert(song);
    if (this.isSimulation){
      Router.go('edit', {_id: songId});
    }
  },
  saveSong: function(songId, song){
    Songs.update(songId, {
      $set: song,
    });
  },
})