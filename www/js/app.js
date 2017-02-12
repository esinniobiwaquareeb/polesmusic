// angular.module is a global place for creating, registering and retrieving Angular modules
// 'musicapp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'musicapp.services' is found in services.js
// 'musicapp.controllers' is found in controllers.js
angular.module('musicapp', ['ionic', 'angularMoment', 'angularSoundManager', 'musicapp.controllers', 'musicapp.services'])

.run(function($ionicPlatform, $rootScope, $state, $ionicModal) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    $rootScope.isIOS = ionic.Platform.isIOS();
    $rootScope.isAndroid = ionic.Platform.isAndroid();

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });


  // Variables and functions for the music player

  $rootScope.currentTrack = null;
  $rootScope.currentTrackDetails = null;
  $rootScope.musicPlaying = false;
  $rootScope.musicPlayer = {};

  $rootScope.createModal = function(i, trackId){

    if(!$rootScope.musicPlayer.album){
      $rootScope.musicPlayer.title = $rootScope.musicPlayer.playlist[i].title.label;
    }else{
      $rootScope.musicPlayer.title = $rootScope.musicPlayer.playlist[i].trackName;
    }

    $rootScope.musicPlayer.trackId = trackId;

    $ionicModal.fromTemplateUrl('templates/music-modal.html', {
      scope: $rootScope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $rootScope.modal = modal;
      $rootScope.openModal();
    });
  }  

  $rootScope.openModal = function() {
    $rootScope.modal.show();
  };
  $rootScope.closeModal = function() {
    $rootScope.modal.hide();
  };


  $rootScope.hasFooter = function(){
    if($rootScope.musicPlaying){
      return 'has-footer'
    }
  }
})



.config(function($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $stateProvider



//first state starts here



//first state ends here




  // setup an abstract state for the tabs directive

    .state('tab', {
    url: '/tab',
  //  abstract: true,
    templateUrl: 'templates/tabs.html'
  })

.state('intro', {
    url: '/',
    templateUrl: 'intro.html',
    controller: 'IntroCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.music', {
    url: '/music',
    views: {
      'tab-music': {
        templateUrl: 'templates/tab-music.html',
        controller: 'MusicListCtrl'
      }
    }
  })


  .state('tab.musicchart', {
    url: '/musicchart',
    views: {
      'tab-musicchart': {
        templateUrl: 'templates/music-chart.html',
        controller: 'MusicChartCtrl'
      }
    }
  })

  .state('tab.musicplayer', {
    url: '/musicplayer',
    views: {
      'tab-musicplayer': {
        templateUrl: 'templates/music-player.html',
        controller: 'MusicPlayerCtrl'
      }
    }
  })


   .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    }
  })


   .state('login', {
    url: '/login',
    views: {
      'tab-search': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })


  .state('tab.new', {
      url: '/new',
      views: {
        'tab-new': {
          templateUrl: 'templates/tab-new.html',
          controller: 'NewCtrl'
        }
      }
    })

    .state('tab.new-album-detail', {
      url: '/new/album/:albumId',
      views: {
        'tab-new': {
          templateUrl: 'templates/album-detail.html',
          controller: 'AlbumDetailCtrl'
        }
      }
    })

    .state('tab.new-detail', {
      url: '/new/:trackId',
      views: {
        'tab-new': {
          templateUrl: 'templates/music-detail.html',
          controller: 'MusicDetailCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');


// $urlRouterProvider.otherwise('/tab/new');



});
