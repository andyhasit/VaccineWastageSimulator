
app.controller('GenericPageCtrl', function($scope, Model, DataRefreshController) {
  $scope.inputs = Model.inputs;
  
  $scope.$watch('inputs', onInputsChanged, true);
    
  function onInputsChanged() {
    DataRefreshController.onInputsChanged();
  }
  
  onInputsChanged();
});

