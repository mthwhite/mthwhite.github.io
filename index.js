var bg = angular.module('bgFramework', [
    'alienExplorers'
]);

bg.component('alienExplorers', {
    controller: 'AEController as $ctrl',
    parent: 'bgFramework',
    templateUrl: 'AlienExplorers/AlienExplorers.html',
    url: '/AlienExplorers'
});

// .config(
//     ($stateProvider, $locationProvider) => {
//         $locationProvider.html5Mode(true);
//         $stateProvider
//             .state('alienExplorers', {
//                 url: '/AlienExplorers',
//                 views: {
//                    '': {
//                          templateUrl: 'AlienExplorersgi.html',
//                          controller: 'alienExplorersCtrl'
//                        }
//                    }
// 			   }
//             );
// });
