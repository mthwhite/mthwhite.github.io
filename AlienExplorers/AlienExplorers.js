var AE = angular.module('alienExplorers', [
        'ae.currentPlayerBoard',
		'ae.gameBoard',
		'ae.market',
		'ae.statsTable',
		'ae.statsTesting',
		'ae.timeCards'
 ]);
 

 angular.module('ae.currentPlayerBoard', []);
 angular.module('ae.gameBoard', []);
 angular.module('ae.market', []);
 angular.module('ae.statsTable', []);
 angular.module('ae.statsTesting', []);
 angular.module('ae.timeCards', []);

 AE.component('ae.currentPlayerBoard', {
     controller: 'currentPlayerBoardCtrl as $ctrl',
     parent: 'AlienExplorers',
     templateUrl: 'gamePages/AE.currentPlayerBoard.template.html',
     url: '/currentPlayerBoard'
 });
  AE.component('ae.gameBoard', {
     controller: 'gameBoardCtrl as $ctrl',
     parent: 'bgFull',
     templateUrl: 'gamePages/AE.gameBoard.template.html',
     url: '/gameBoard'
 });
