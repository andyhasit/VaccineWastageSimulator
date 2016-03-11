app.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
}]);


app.controller('SimulatorCtrl', function($scope, ChartService, Calculations) {
  $scope.inputs = inputs = { 
    dosesPerYear: 1000,
    sessionsPerWeek : 2,
    dosesPerVial: 5
  };
  
  
  $scope.$watch('inputs', reDrawCharts, true);
    
  function reDrawCharts() {
    Calculations.setInputs($scope.inputs);
    ChartService.reDrawCharts();
    $scope.percentWastage = Calculations.getPercentWastage();
  }
  reDrawCharts();
});


/*

TODO:

fix no redraw after navigation
larger dots, finer line.
format percentages
rename landing page button and menu from simulator to simulate
renamed title an y axis of # session probability graph.


change y and calc probability.

=(SUMPRODUCT(C37:DM37,C38:DM38))/(SUMPRODUCT(C36:DM36,C38:DM38)+SUMPRODUCT(C37:DM37,C38:DM38))



Avoid text waves or even.


5 hours at 30.

*/