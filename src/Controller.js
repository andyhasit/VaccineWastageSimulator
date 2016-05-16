/*
Controls the rebuilding of model and charts.
*/

app.service('Controller', function(Model, WastageCalculations, SafetyStockCalculations, MonitorWastageCalculations, MyMaths){
  var self = this;
  
  var previousInputs = {};
  self.refreshModel = function() {
    var inputs = Model.inputs;
    if (inputsHaveChanged(Model.inputs)){
      //(JSON.stringify(previousInputs) !== JSON.stringify(Model.inputs))
      document.body.style.cursor='wait';
      angular.copy(Model.inputs, previousInputs);
      rebuildModelData();
      rebuildChartData();
      document.body.style.cursor='default';
    }
  };
  
  function inputsHaveChanged(newinputs) {
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
  
  function rebuildModelData() {
    // Localise some variables for easy access
    var inputs = Model.inputs;
    var annualBirths = inputs.annualBirths;
    var dosesPerRecipient = inputs.dosesPerRecipient;
    var targetCoverage = inputs.targetCoverage;
    Model.dosesPerYear = annualBirths * dosesPerRecipient * targetCoverage / 100;
    var dosesPerYear = Model.dosesPerYear;
    var sessionsPerWeek = inputs.sessionsPerWeek;
    var dosesPerVial = inputs.dosesPerVial;
    var sessionTurnoutsToCount = inputs.sessionTurnoutsToCount;
    var reportingPeriod = inputs.reportingPeriod;
    var supplyInterval = inputs.supplyInterval;
    var simulationPeriodsToCount = inputs.simulationPeriodsToCount;
    var numberOfVialsConsumedInSupplyPeriodToCount = inputs.numberOfVialsConsumedInSupplyPeriodToCount;
    var sessionsInReportingPeriodToCount = inputs.sessionsInReportingPeriodToCount;
    var binsToCount = inputs.binsToCount;
    
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
    var sessionsInReportingPeriod = WastageCalculations.minimumNumberOfSessionsPerReportingPeriod(
      reportingPeriod, sessionsPerWeek);
    
    // SafetyStockCalculations     
    Model.perSupplyPeriodSimulationData = SafetyStockCalculations.rebuildSupplyPeriodSimulationData(
          simulationPeriodsToCount, dosesPerVial, sessionsInSupplyPeriod, cumulativeProbabilityOfTurnoutsArray);
    var vialsConsumedInSimulationPeriods = Model.perSupplyPeriodSimulationData.vialsConsumed;
    Model.perNumberOfVialsConsumedInSupplyPeriodData = SafetyStockCalculations.buildNumberOfVialsConsumedInSupplyPeriodData(
          numberOfVialsConsumedInSupplyPeriodToCount, vialsConsumedInSimulationPeriods);
    var cumulativeProbabilityVialsConsumedArray = Model.perNumberOfVialsConsumedInSupplyPeriodData.cumulativeProbability;
    var safetyStockTotals = SafetyStockCalculations.calculateSafetyStock(vialsConsumedInSimulationPeriods,          
          cumulativeProbabilityVialsConsumedArray);
    
    Model.expectedConsumptionInSupplyInterval = safetyStockTotals.expectedConsumption;
    Model.maximumConsumptionInSupplyInterval = safetyStockTotals.maximumConsumption;
    Model.minimumSafetyStockForSupplyInterval = safetyStockTotals.minimumSafetyStock;
   
    // MonitorWastageCalculations
    Model.perReportingPeriodSimulationData = MonitorWastageCalculations.rebuildReportingPeriodSimulationData(simulationPeriodsToCount, 
          dosesPerVial, sessionsInReportingPeriod, cumulativeProbabilityVialsConsumedArray);     
    var reportingPeriodWastageRates = Model.perReportingPeriodSimulationData.wastageRate;    
    Model.perReportingPeriodWastageData = MonitorWastageCalculations.rebuildReportingPeriodWastageRateData(binsToCount, 
          simulationPeriodsToCount, reportingPeriodWastageRates);
    
    var allowableRates = MonitorWastageCalculations.getAllowableWastageRates(Model.perReportingPeriodWastageData.cumulativeProbability, binsToCount); 
    Model.minAllowableWastageRate = allowableRates.minAllowableWastageRate;
    Model.maxAllowableWastageRate = allowableRates.maxAllowableWastageRate;
    c.log(allowableRates);
  };
  
  function rebuildChartData() {
    rebuildSessionSizeProbabilityChart();
    rebuildWastageRateByTurnoutChart();
    rebuildConsumptionInSupplyPeriodProbabilityChart();
    rebuildWastageRateProbabilityChart();
  }
  
  function rebuildSessionSizeProbabilityChart() {
    var chart = Model.charts.sessionSizeProbability;
    var labels = [];
    var data = [];
    var probabilityArray = Model.perSessionTurnoutData.probability;
    var startIndex = MyMaths.findFirst(probabilityArray, function(x) {return x > 0.005});
    var endIndex = MyMaths.findFirst(probabilityArray, function(x) {return x > 0.005}, true);
  
    for (var i=startIndex; i<=endIndex; i++) {
      labels.push(i);
      var probability = probabilityArray[i];
      data.push(probability*100);
    }
    angular.copy(labels, chart.labels);
    chart.data[0] = data;
  }
  
  function rebuildWastageRateByTurnoutChart() {
    var chart = Model.charts.wastageRateByTurnout;
    angular.copy(Model.perSessionTurnoutData.dosesAdministered, chart.labels);
    chart.data[0] = Model.perSessionTurnoutData.wastageRate.map(function(i){return i * 100});
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

  function rebuildWastageRateProbabilityChart() {
    var chart = Model.charts.wastageRateProbability;
    var labels = [];
    var data = [];
    var probabilityArray = Model.perReportingPeriodWastageData.probability;
    //c.log(probabilityArray);
    var startIndex = MyMaths.findFirst(probabilityArray, function(x) {return x > 0});
    var endIndex = MyMaths.findFirst(probabilityArray, function(x) {return x > 0}, true);
  
    for (var i=startIndex; i<=endIndex; i++) {
      var wastageRate = i;
      var probability = probabilityArray[i];
      labels.push(wastageRate);
      data.push(probability*100);
    }
    angular.copy(labels, chart.labels);
    chart.data[0] = data;
    //c.log(labels);
    //c.log(data);
  }
  
});