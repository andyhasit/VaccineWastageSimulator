var c = console;

app = angular.module('app', ['ui.router', 'ui.bootstrap']);
  
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/landing');

  $stateProvider
    .state('landing', {
      url: '/landing',
      templateUrl: './landing.html'
    })
    .state('simulator', {
      url: '/simulator',
      templateUrl: './simulator.html',
      controller: 'SimulatorCtrl'
    })
    .state('help', {
      url: '/help',
      templateUrl: './help.html'
    });
});

  

/*

      //function getHighest
      $scope.reCalculate = function() {
        $scope.dataReady = false;
        var dataSet = Calculations.getDataSet(
          $scope.dosesPerYear, $scope.sessionsPerWeek, $scope.dosesPerVial);
        $scope.data.mainDataSet = dataSet;
        var highest = Calculations.getHighestVal(dataSet, 'expectedSessions');
        highest = parseInt(highest) + 1;
        increment = (highest> 80)? 10 : 5;
        while (highest % increment !== 0) {
          highest++;
        }
        $scope.expectedSessionsOptions.axes.y.max = highest;
        $scope.dataReady = true;
      };
angular.module('d3app', []);

angular.module('d3app').controller('c1', ['$scope', function($scope) {

 
  $scope.count = 'abcdef';
   
  $scope.color = function() {
    var sizes = [4, 8, 15, 16, 23, 42, 42,42,42,];
    var x = d3.selectAll("b");
    console.log(Object.keys(x));
    d3.selectAll("b")
    .data(sizes)
    .style("font-size", function(d, i) { return sizes[i+2] + "px"; })
    
    
    .style("color", function() {
      return "hsl(" + Math.random() * 360 + ",100%,50%)";
    });
  }
  
}]);

*/