
app.controller('GenericPageCtrl', function($scope, Model) {
  $scope.inputs = Model.inputs;
  
  $scope.$watch('inputs', reDrawCharts, true);
    
  function reDrawCharts() {
    c.log(999);
    Model.refresh();
    $scope.percentWastage = Model.data.percentWastage;
  }
  
  reDrawCharts();
});

