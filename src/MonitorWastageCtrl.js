
app.controller('MonitorWastageCtrl', function($scope, ChartService, Calculations) {
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
