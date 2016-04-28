var c = console;

app = angular.module('app', ['ui.router', 'ui.bootstrap']);
  
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/landing');
  /*
  $stateProvider
    .state('landing', {
      url: '/landing',
      templateUrl: './landing.html'
    })
    .state('calculate_wastage', {
      url: '/calculate_wastage',
      templateUrl: './simulator.html',
      controller: 'CalculateWastageCtrl'
    })
    .state('help', {
      url: '/help',
      templateUrl: './help.html'
    });
    */
   pages = [
       {sref: 'help', name: 'Help', controller: 'DefaultCtrl'},
       {sref: 'calculate_wastage', name: 'Calculate Wastage', controller: 'CalculateWastageCtrl'},
       //{sref: 'monitor_wastage', name: 'Calculate Wastage', controller: 'MonitorWastageCtrl'},
   ];
   
  angular.forEach(pages, function(page) {
    $stateProvider.state(page.sref, {
      url: '/' + page.sref,
      templateUrl: './' + page.sref + '.html',
      controller: page.controller
    })
  })
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