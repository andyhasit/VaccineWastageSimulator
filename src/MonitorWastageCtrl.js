
app.controller('MonitorWastageCtrl', function($scope, Model) {
  $scope.inputs = Model.inputs;
  
  $scope.$watch('inputs', reDrawCharts, true);
    
  function reDrawCharts() {
    Model.rebuildModel();
    $scope.percentWastage = Model.percentWastage;
  }
  
  reDrawCharts();
});

