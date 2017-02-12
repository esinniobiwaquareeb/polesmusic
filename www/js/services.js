angular.module('musicapp.services', [])

.factory('MusicFac', function($http){
  return{
    topSongs: function(){
      return $http.get('https://itunes.apple.com/us/rss/topsongs/limit=15/explicit=true/json')
        .then(function (response){
          return (response.data)
        });
    },
    topAlbums: function(){
      return $http.get('https://itunes.apple.com/us/rss/topalbums/limit=15/explicit=true/json')
        .then(function (response){
          return (response.data)
        });
    },
    lookup: function(id) {
      return $http.jsonp('https://itunes.apple.com/us/lookup?id='+id+'&callback=JSON_CALLBACK')
        .then(function (response){
          return (response.data)
        });
    },
    lookupSongs: function(id) {
      return $http.jsonp('https://itunes.apple.com/us/lookup?id='+id+'&entity=song&callback=JSON_CALLBACK')
        .then(function (response){
          return (response.data)
        });
    }
  }
});
