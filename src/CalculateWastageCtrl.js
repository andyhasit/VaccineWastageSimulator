
app.controller('CalculateWastageCtrl', function($scope, Model) {
  $scope.inputs = Model.inputs;
  
  $scope.$watch('inputs', reDrawCharts, true);
    
  function reDrawCharts() {
    Model.rebuildModel();
    //ChartService.reDrawCharts();
    $scope.percentWastage = Model.percentWastage;
  }
  $.plot($("#placeholder"), [ [[0, 0], [1, 1]] ], { yaxis: { max: 1 } });
  reDrawCharts();
});

