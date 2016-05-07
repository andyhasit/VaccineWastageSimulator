/*
Controls the rebuilding of model and charts.
*/

app.service('Controller', function(Model, WastageCalculations, SafetyStockCalculations, MyMaths){
  var self = this;
  self.model = Model;//TODO: change to an instance
  
  self.refreshModel = function() {
    rebuildModelData();
    rebuildChartData();
  };
    
  function rebuildModelData() {
    if (!inputsHaveChangedSincePrevious(inputs)){
      return;
    }
    setPreviousInputs(inputs);
    
    // Localise some variables for easy access
    var inputs = Model.inputs;
    var dosesPerYear = inputs.dosesPerYear;
    var sessionsPerWeek = inputs.sessionsPerWeek;
    var dosesPerVial = inputs.dosesPerVial;
    var sessionTurnoutsToCount = inputs.sessionTurnoutsToCount;
    var reportingPeriod = inputs.reportingPeriod;
    var supplyInterval = inputs.supplyInterval;
    var simulationPeriodsToCount = inputs.simulationPeriodsToCount;
    var numberOfVialsConsumedInSupplyPeriodToCount = inputs.numberOfVialsConsumedInSupplyPeriodToCount;
    
    // Start building the model
    Model.perSessionTurnoutData = WastageCalculations.rebuildSessionTurnoutData(sessionTurnoutsToCount,
          sessionsPerWeek, dosesPerVial, dosesPerYear);
          
    var dosesAdministeredArray = Model.perSessionTurnoutData.dosesAdministered;
    var dosesWastedArray = Model.perSessionTurnoutData.dosesWasted;
    var probabilityArray = Model.perSessionTurnoutData.probability;
    var cumulativeProbabilityOfTurnoutsArray = Model.perSessionTurnoutData.cumulativeProbability;
    
    Model.wastageRate = WastageCalculations.calculateWastagePercentage(dosesAdministeredArray, 
          dosesWastedArray, probabilityArray);
    Model.expectedAnnualConsumption = WastageCalculations.calculateExpectedAnnualConsumption(
          dosesPerYear, Model.wastageRate);
    
    var sessionsInSupplyPeriod = WastageCalculations.maximumNumberOfSessionsPerSupplyInterval(
      supplyInterval, sessionsPerWeek);
      
    Model.perSupplyPeriodSimulationData = SafetyStockCalculations.rebuildSupplyPeriodSimulationData(
          simulationPeriodsToCount, dosesPerVial, sessionsInSupplyPeriod, cumulativeProbabilityOfTurnoutsArray);
    var vialsConsumedInSimulationPeriods = Model.perSupplyPeriodSimulationData.vialsConsumed;
    Model.perNumberOfVialsConsumedInSupplyPeriodData = SafetyStockCalculations.buildNumberOfVialsConsumedInSupplyPeriodData(
          numberOfVialsConsumedInSupplyPeriodToCount, vialsConsumedInSimulationPeriods);
    var cumulativeProbabilityVialsConsumedArray = Model.perNumberOfVialsConsumedInSupplyPeriodData.cumulativeProbability;
    Model.minimumSafetyStock = SafetyStockCalculations.calculateSafetyStock(vialsConsumedInSimulationPeriods,          
          cumulativeProbabilityVialsConsumedArray);
    c.log(Model.minimumSafetyStock);
  };
  
  function inputsHaveChangedSincePrevious(inputs) {
    return true;
  }
  
  function setPreviousInputs(inputs) {
    //TODO..
  }
  
  function rebuildChartData() {
    rebuildSessionSizeProbabilityChart();
    rebuildWastageRateChart();
    rebuildConsumptionInSupplyPeriodProbabilityChart();
  }
  
  function rebuildSessionSizeProbabilityChart() {
    var chart = Model.charts.sessionSizeProbability;
    angular.copy(Model.perSessionTurnoutData.dosesAdministered, chart.labels);
    chart.data[0] = Model.perSessionTurnoutData.probability.map(function(i){return i *100});
  }
  
  function rebuildWastageRateChart() {
    var chart = Model.charts.wastageRate;
    angular.copy(Model.perSessionTurnoutData.dosesAdministered, chart.labels);
    chart.data[0] = Model.perSessionTurnoutData.wastageRate.map(function(i){return i *100});
  }
  
  function rebuildConsumptionInSupplyPeriodProbabilityChart() {
    var chart = Model.charts.consumptionInSupplyPeriodProbability;
    var labels = [];
    var data = [];
    var probabilityArray = Model.perNumberOfVialsConsumedInSupplyPeriodData.probability;
    var startIndex = MyMaths.findFirst(probabilityArray, function(x) {return x > 0});
    var endIndex = MyMaths.findFirst(probabilityArray, function(x) {return x > 0}, true);
  
    for (var i=startIndex; i<=endIndex; i++) {
      var vialsUsedInPeriod = i;
      var probability = probabilityArray[i];
      labels.push(vialsUsedInPeriod);
      data.push(probability*100);
    }
    angular.copy(labels, chart.labels);
    chart.data[0] = data;
  }

});