var bg = angular.module('bgFramework', [
    'ui.router',
    'alienExplorers'
]).config(
    ($stateProvider, $locationProvider) => {
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('alienExplorers', {
                url: '/AlienExplorers',
                views: {
                   '': {
                     templateUrl: 'AlienExplorers/AlienExplorers.html',
                     controller: 'alienExplorersCtrl'

                   },
        });
});
