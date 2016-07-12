/*
Controls the rebuilding of model and charts.
*/

app.service('DataRefreshController', function(Model, ChartData){
  var self = this;
  var previousInputs = {};
  
  self.onInputsChanged = function() {
    var inputs = Model.inputs;
    if (areInputsDifferent(Model.inputs)){
      //(JSON.stringify(previousInputs) !== JSON.stringify(Model.inputs))
      document.body.style.cursor='wait';
      angular.copy(Model.inputs, previousInputs);
      Model.rebuild();
      ChartData.rebuild();
      document.body.style.cursor='default';
    }
  };
  
  function areInputsDifferent(newinputs) {
    for (var property in newinputs) {
      if (previousInputs.hasOwnProperty(property)) {
        if (previousInputs[property] !== newinputs[property]){
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  }
  
});