
Meteor.publish('song', function(songId){
  return Songs.find(songId);
});

Meteor.publish('allSongs', function(){
  return Songs.find({});
});