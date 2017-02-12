angular.module('musicapp.controllers', [])

.controller('MusicListCtrl', function($scope, $rootScope, $filter, MusicFac) {

  MusicFac.topSongs().then(function(data){
    $scope.filtered = $filter('orderBy')(data.feed.entry, 'title.label');
  })

  $scope.setAudio = function(i, trackId){
    $rootScope.musicPlayer.playlist = $scope.filtered;
    $rootScope.musicPlayer.index = i;
    $rootScope.musicPlayer.album = false;

    $rootScope.createModal(i, trackId);
  }

})


.controller('SearchCtrl', function($scope, $rootScope, $filter, MusicFac) {

  MusicFac.topSongs().then(function(data){
    $scope.filtered = $filter('orderBy')(data.feed.entry, 'title.label');
  })

  $scope.setAudio = function(i, trackId){
    $rootScope.musicPlayer.playlist = $scope.filtered;
    $rootScope.musicPlayer.index = i;
    $rootScope.musicPlayer.album = false;

    $rootScope.createModal(i, trackId);
  }

})


.controller('MusicPlayerCtrl', function($scope, $rootScope, $filter, MusicFac) {

  MusicFac.topSongs().then(function(data){
    $scope.filtered = $filter('orderBy')(data.feed.entry, 'title.label');
  })

  $scope.setAudio = function(i, trackId){
    $rootScope.musicPlayer.playlist = $scope.filtered;
    $rootScope.musicPlayer.index = i;
    $rootScope.musicPlayer.album = false;

    $rootScope.createModal(i, trackId);
  }

})


.controller('MusicChartCtrl', function($scope, $rootScope, $filter, MusicFac) {


  MusicFac.topAlbums().then(function(data){
    $scope.topAlbums = data.feed.entry;
  })

  MusicFac.topSongs().then(function(data){
    $scope.topSongs = data.feed.entry;
  })

  $scope.setAudio = function(i, trackId){
    $rootScope.musicPlayer.playlist = $scope.topSongs;
    $rootScope.musicPlayer.index = i;
    $rootScope.musicPlayer.album = false;

    $rootScope.createModal(i, trackId);
  }

})


//first transition starts here


.controller('IntroCtrl', function($scope, $state) {
 
  // Called to navigate to the main app
  var startApp = function() {
    $state.go('tab');

    // Set a flag that we finished the tutorial
    window.localStorage['didTutorial'] = true;
  };

  //No this is silly
  // Check if the user already did the tutorial and skip it if so
if(window.localStorage['didTutorial'] === "true") {
    console.log('Skip intro');
    startApp();
  }
  else{
  setTimeout(function () {
    navigator.splashscreen.hide();
  }, 750);
  }
  

  // Move to the next slide
  $scope.next = function() {
    $scope.$broadcast('slideBox.nextSlide');
  };

  // Our initial right buttons
  var rightButtons = [
    {
      content: 'Next',
      type: 'button-positive button-clear',
      tap: function(e) {
        // Go to the next slide on tap
        $scope.next();
      }
    }
  ];
  
  // Our initial left buttons
  var leftButtons = [
    {
      content: 'Skip Intro',
      type: 'button-positive button-clear',
      tap: function(e) {
        // Start the app on tap
        startApp();
      }
    }
  ];

  // Bind the left and right buttons to the scope
  $scope.leftButtons = leftButtons;
  $scope.rightButtons = rightButtons;


  // Called each time the slide changes
  $scope.slideChanged = function(index) {

    // Check if we should update the left buttons
    if(index > 0) {
      // If this is not the first slide, give it a back button
      $scope.leftButtons = [
        {
          content: 'Back',
          type: 'button-positive button-clear',
          tap: function(e) {
            // Move to the previous slide
            $scope.$broadcast('slideBox.prevSlide');
          }
        }
      ];
    } else {
      // This is the first slide, use the default left buttons
      $scope.leftButtons = leftButtons;
    }
    
    // If this is the last slide, set the right button to
    // move to the app
    if(index == 2) {
      $scope.rightButtons = [
        {
          content: 'Start using MyApp',
          type: 'button-positive',
          tap: function(e) {
            startApp();
          }
        }
      ];
    } else {
      // Otherwise, use the default buttons
      $scope.rightButtons = rightButtons;
    }
  };
})


//ends here


.controller('MusicDetailCtrl', function($scope, $rootScope, $stateParams, $ionicSlideBoxDelegate, $ionicHistory, MusicFac){
  var trackId = $rootScope.musicPlayer.trackId;

  $scope.playTrack = function(track){

      if($rootScope.currentTrack != track.trackId){
        //Create New Sound
        $rootScope.musicPlayer.trackPosition = 0;
        $rootScope.musicPlayer.trackRange = 0;
        soundManager.destroySound($rootScope.currentTrack);

        $rootScope.mySound = soundManager.createSound({
            id: track.trackId.toString(),
            url: track.previewUrl,
            autoLoad: true,
            autoPlay: true,
            stream: true,
            onload: function(){

            },
            onplay: function() {
              $rootScope.currentTrack = this.id;
              $rootScope.currentTrackDetails = track;
              $rootScope.musicPlaying = true;
              
            },
            onpause: function(){
              $rootScope.musicPlaying = false;
            },
            whileplaying: function() {
              $rootScope.musicPlayer.trackRange = Math.round((this.position / this.duration) * 100);
              $rootScope.musicPlayer.trackPosition = this.position;
              $rootScope.musicPlayer.trackDuration= this.duration;
              $rootScope.$apply();
            },
            onfinish: function() {

              if($rootScope.activeSlide >= ($rootScope.musicPlayer.playlist.length -1) ){
                $rootScope.activeSlide = 0;
                $rootScope.$apply();
              }else{
                $rootScope.activeSlide = $rootScope.activeSlide + 1;
                $rootScope.$apply();
              }

            },
            volume: 90
          });

      }else{
        //Track already playing

      }
    }

    $scope.slideHasChanged = function(i){

      $rootScope.activeSlide = i;

      $rootScope.mySound.pause();

      if(!$rootScope.musicPlayer.album){
        var trackId = $rootScope.musicPlayer.playlist[i].id.attributes['im:id'];
        $rootScope.musicPlayer.title = $rootScope.musicPlayer.playlist[i].title.label;
      }else{
        var trackId = $rootScope.musicPlayer.playlist[i].trackId;
        $rootScope.musicPlayer.title = $rootScope.musicPlayer.playlist[i].trackName;
      }

      MusicFac.lookup(trackId).then(function(data){
        $scope.track = data.results[0];
        $scope.playTrack($scope.track);
      })
    }

    $scope.nextTrack = function(){

      if($rootScope.activeSlide >= ($rootScope.musicPlayer.playlist.length -1) ){
        $rootScope.activeSlide = 0;
      }else{
        $rootScope.activeSlide = $rootScope.activeSlide + 1;
      }

    }

    $scope.prevTrack = function(){

      if($rootScope.activeSlide <=0){
        $rootScope.activeSlide = ($rootScope.musicPlayer.playlist.length -1);
      }else{
        $rootScope.activeSlide = $rootScope.activeSlide - 1;
      }

    }

    $scope.playPause = function(){
      if($rootScope.musicPlaying){
        $rootScope.mySound.pause(); 
        $rootScope.musicPlaying = false;
      }else{
        $rootScope.mySound.play();
        $rootScope.musicPlaying = true;
      }
    }

    $scope.setPosition = function(val){
      var toVal = (val / 100) * $rootScope.musicPlayer.trackDuration;
      $rootScope.musicPlayer.trackPosition = toVal;
      soundManager.setPosition($rootScope.currentTrack, toVal);
    }

    $scope.getTrackDetails = function(){
      $rootScope.activeSlide = $rootScope.musicPlayer.index;
      MusicFac.lookup(trackId).then(function(data){
        $scope.track = data.results[0];
        $scope.playTrack($scope.track)
      })
    }

    $scope.getTrackDetails();


})

.controller('AlbumDetailCtrl', function($scope, $rootScope, $stateParams, $state, $filter, MusicFac){
  var albumId = $stateParams.albumId;

  MusicFac.lookup(albumId).then(function(data){
    $scope.album = data.results[0];
  })

  MusicFac.lookupSongs(albumId).then(function(data){
    $scope.tracks = data.results;

    //Remove first track from iTunes result that is not a song.
    $scope.tracks.shift();
  })

  $scope.lookup = function(id, url, i){
    if(url){
      //$state.go('tab.new-detail', {trackId: id});
      $rootScope.musicPlayer.playlist = $scope.tracks;
      $rootScope.musicPlayer.index = i;
      $rootScope.musicPlayer.album = true;

      $rootScope.createModal(i, id);
    }
  }

})

.controller('NewCtrl', function($scope, $rootScope, $filter, MusicFac) {


  MusicFac.topAlbums().then(function(data){
    $scope.topAlbums = data.feed.entry;
  })

  MusicFac.topSongs().then(function(data){
    $scope.topSongs = data.feed.entry;
  })

  $scope.setAudio = function(i, trackId){
    $rootScope.musicPlayer.playlist = $scope.topSongs;
    $rootScope.musicPlayer.index = i;
    $rootScope.musicPlayer.album = false;

    $rootScope.createModal(i, trackId);
  }


//first page controller



  //ends here

});
