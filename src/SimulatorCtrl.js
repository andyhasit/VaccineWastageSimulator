app.controller('SimulatorCtrl', function($scope, ChartService, Calculations) {
  $scope.inputs = Calculations.inputs;  
  
  $scope.$watch('inputs', reDrawCharts, true);
    
  function reDrawCharts() {
    ChartService.reDrawCharts();
  }
  reDrawCharts();
});


/*

TODO: 
format percentages
disallow -1
change y and calc probability.

larger dots, finer line.

Session size probability 
  y: probability

Avoid text waves or even.


5 hours at 30.

*/