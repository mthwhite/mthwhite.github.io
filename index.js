angular.module('bgFramework', [/*'Injector.Service'*/]);

// (function () {
//     angular
//         .module('bgFramework')
//         .config(ConfigureModule);
//
//     ConfigureModule.$inject = ['$stateProvider'];
//
//     function ConfigureModule($stateProvider) {
//         $stateProvider
//             .state('alienExplorers', {
//                 controller: 'alienExplorersCtrl as $ctrl',
//                 parent: 'bgFramework',
//                 templateUrl: '/AlienExplorers/alienExplorers.html',
//                 title: 'Alien Explorers',
//                 url: '/alienExplorers'
//             })
//             .state('pokemon', {
//                 controller: 'pokemonCtrl as $ctrl',
//                 parent: 'bgFramework',
//                 templateUrl: '/Pokemon/pokemon.html',
//                 title: 'Pokemon',
//                 url: '/pokemon'
//             });
//     }
// }());

(function () {
    angular
        .module('bgFramework')
        .controller('bgCtrl', bgController);

    bgController.$inject = [];

    function bgController() {
        var vm = this;

        vm.display = "this";
    }
}());
