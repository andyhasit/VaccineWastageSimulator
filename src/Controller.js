/*
Inputs:
# doses administered per year = Ndy
# sessions per week = Nsw
Vial size (# doses per vial) = Ndv
Supply interval = Ts (1, 3, 6, 12 months)
Reporting period = Tr (1, 3, 6, 12 months)


Intermediate outputs:
Probability of each session size = P(s) = Binomial(s; Ndy, Nsw); s = 1, …, 100

Cumulative probability = C(s) = P(1) + P(2) + … + P(s); s = 1, …, 100
{
  [sessionSize] = cumProb
}

>> (almost s shaped, like a hill) just add.

Maximum number of sessions per supply interval = Nss = function(Nsw, Ts):
  for Ts = 1 month, (Nsw, Nss) = (1, 5), (2, 10), (3, 15), (4, 19), (5, 23), (6, 27), (7, 31);
  for Ts = 3 months, triple Nss, etc.
  
  Just static data, generate once or on demand. have all the data I need here.
>>> 2 pw, 1m = 8 sessions
  
Minimum number of sessions per reporting period = Nsr =f(Nsw, Tr):
  For Tr = 1 month, (Nsw, Nsr) = (1, 4), (2, 8), (3, 12), (4, 16), (5, 20), (6, 24), (7, 28)
  for Tr = 3 months, triple Nsr, etc.
>>>




Maybe make this the Model, which only 
*/

app.service('Controller', function(Model, WastageCalculations, SafetyStockCalculations){
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
    var cumulativeProbabilityArray = Model.perSessionTurnoutData.cumulativeProbability;
    
    Model.wastageRate = WastageCalculations.calculateWastagePercentage(dosesAdministeredArray, 
          dosesWastedArray, probabilityArray);
    Model.expectedAnnualConsumption = WastageCalculations.calculateExpectedAnnualConsumption(
          dosesPerYear, Model.wastageRate);
    
    var sessionsInSupplyPeriod = WastageCalculations.maximumNumberOfSessionsPerSupplyInterval(
      supplyInterval, sessionsPerWeek);
      
    Model.perSupplyPeriodSimulationData = SafetyStockCalculations.rebuildSupplyPeriodSimulationData(
          simulationPeriodsToCount, dosesPerVial, sessionsInSupplyPeriod, cumulativeProbabilityArray);
    var vialsConsumedInSimulationPeriods = Model.perSupplyPeriodSimulationData.vialsConsumed;
    Model.perNumberOfVialsConsumedInSupplyPeriodData = SafetyStockCalculations.buildNumberOfVialsConsumedInSupplyPeriodData(
          numberOfVialsConsumedInSupplyPeriodToCount, vialsConsumedInSimulationPeriods);
    var cumulativeProbabilityArray = Model.perNumberOfVialsConsumedInSupplyPeriodData.cumulativeProbability;
    Model.minimumSafetyStock = SafetyStockCalculations.calculateSafetyStock(vialsConsumedInSimulationPeriods, cumulativeProbabilityArray);
  };
  
  function inputsHaveChangedSincePrevious(inputs) {
    return true;
  }
  
  function setPreviousInputs(inputs) {
    //TODO..
  }
  
  function rebuildChartData() {
    angular.copy(Model.perSessionTurnoutData.dosesAdministered, Model.charts.sessionSizeProbability.labels);
    Model.charts.sessionSizeProbability.data[0] = Model.perSessionTurnoutData.probability.map(function(i){return i *100});
    
    angular.copy(Model.perSessionTurnoutData.dosesAdministered, Model.charts.wastageRate.labels);
    Model.charts.wastageRate.data[0] = Model.perSessionTurnoutData.wastageRate.map(function(i){return i *100});
    rebuildConsumptionInSupplyPeriodProbabilityChart();
  }
  
  function rebuildConsumptionInSupplyPeriodProbabilityChart() {
    var chart = Model.charts.consumptionInSupplyPeriodProbability;
    var labels = [];
    var data = [];
    var probabilityArray = Model.perNumberOfVialsConsumedInSupplyPeriodData.probability;
    var count = Model.inputs.numberOfVialsConsumedInSupplyPeriodToCount;
    for (var i=0; i<=count; i++) {
      var vialsUsedInPeriod = i;
      var probability = probabilityArray[i];
      if (probability > 0){
        labels.push(vialsUsedInPeriod);
        data.push(probability*100);
      }
    }
    angular.copy(labels, chart.labels);
    chart.data[0] = data;    
  };

});