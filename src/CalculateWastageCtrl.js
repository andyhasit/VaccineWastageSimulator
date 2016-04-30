
app.controller('CalculateWastageCtrl', function($scope, ChartService, Model) {
  $scope.inputs = Model.inputs;
  
  $scope.$watch('inputs', reDrawCharts, true);
    
  function reDrawCharts() {
    Model.calculateAll();
    ChartService.reDrawCharts();
    $scope.percentWastage = Model.percentWastage;
  }
  
  reDrawCharts();
});

