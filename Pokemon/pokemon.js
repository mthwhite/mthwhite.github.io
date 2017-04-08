(function () {
    angular.module('bgFramework').component('pokemon', {
        templateUrl: '/Pokemon/pokemon.html',
        controller: pokemonController,
        controllerAs: '$ctrl',
        bindings: {
        }
    });

    pokemonController.$inject = [''];

    function pokemonController() {
        var vm = this;

        vm.display = "Hi";
    }
