

app.controller('CalculateWastageCtrl', function($scope, ChartService, Model) {
  $scope.inputs = inputs = { 
    dosesPerYear: 1000,
    sessionsPerWeek : 2,
    dosesPerVial: 5
  };
  
  $scope.$watch('inputs', reDrawCharts, true);
    
  function reDrawCharts() {
    Model.setInputs($scope.inputs);
    ChartService.reDrawCharts();
    $scope.percentWastage = Model.getPercentWastage();
  }
  reDrawCharts();
});
