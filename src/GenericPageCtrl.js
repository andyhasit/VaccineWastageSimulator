
app.controller('GenericPageCtrl', function($scope, Model, Controller) {
  $scope.inputs = Model.inputs;
  
  $scope.$watch('inputs', reDrawCharts, true);
    
  function reDrawCharts() {
    c.log(999);
    Controller.refreshModel();
  }
  
  reDrawCharts();
});

