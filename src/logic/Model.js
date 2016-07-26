
/*
This contains the data model, which gets rebuilt on demand, usually when inputs have changed.
*/

app.service('Model', function(WastageCalculations, SafetyStockCalculations, MonitorWastageCalculations, MyMaths){
  var self = this;
  
  self.settings = {
    coverageRange: [],
    dosesPerRecipientRange: [1, 2, 3, 4, 5],
    sessionsPerWeekRange: [1, 2, 3, 4, 5, 6, 7],
    dosesPerVialRange :[1, 2, 5, 10, 20],
    reportingPeriodRange: [1, 3, 6, 12],
    supplyPeriodRange: [1, 3, 6, 12],
  };
  
  for (var i=0; i<=100; i++) {
    self.settings.coverageRange.push(i);
  }
  
  self.inputs = { 
    annualBirths: 500,
    dosesPerRecipient: 1,
    targetCoverage: 100,
    sessionsPerWeek: 2,
    dosesPerVial: 10,
    reportingPeriod: 3, //In months, can be 1, 3, 6 or 12.
    supplyInterval: 1, //In months, can be 1, 3, 6 or 12.
    simulationPeriodsToCount: 10000,
    numberOfVialsConsumedInSupplyPeriodToCount: 1000,
    sessionTurnoutsToCount: 100,
    safetyStockTicks: 100, //How many ticks to show on x axis, as numberOfVialsConsumedInSupplyPeriodToCount is too large
    binsToCount: 100,
  };
  
  self.dosesPerYear = null;
  self.perSessionTurnoutData = null;
  self.wastageRate = null;
  self.expectedAnnualConsumption = null;  
  self.minAllowableWastageRate = null;
  self.maxAllowableWastageRate = null;
  
  self.perSupplyPeriodSimulationData = null;
  self.perNumberOfVialsConsumedInSupplyPeriodData = null;
  
  self.expectedConsumptionInSupplyInterval;
  self.maximumConsumptionInSupplyInterval;
  self.minimumSafetyStockForSupplyInterval;
      
  self.perReportingPeriodSimulationData = null;
  
  /* what about these?
  
  model.data.upper99PercentLimit = upper99PercentLimit;
  model.data.safetyStock = safetyStock;
  model.data.expectedConsumption = expectedConsumption;
  */
  
  //TODO: move to chart data?
  self.charts = {
    sessionSizeProbability: {
      labels: [],
      data: [],
    },
    wastageRateByTurnout: {
      labels: [],
      data: [],
    },
    consumptionInSupplyPeriodProbability: {
      labels: [],
      data: [],
    },
    wastageRateProbability: {
      labels: [],
      data: [],
    },
  };
  
  self.rebuild = function() {
    wastageCalculations();
    safetyStockCalculations();
    monitorWastageCalculations();
  };
  
  function wastageCalculations() {
    var inputs = self.inputs;
    inputs.dosesPerYear = inputs.annualBirths * inputs.dosesPerRecipient * inputs.targetCoverage / 100;
    self.perSessionTurnoutData = WastageCalculations.rebuildSessionTurnoutData(
        inputs.sessionTurnoutsToCount,
        inputs.sessionsPerWeek, 
        inputs.dosesPerVial, 
        inputs.dosesPerYear
        );
    self.wastageRate = WastageCalculations.calculateWastagePercentage(
        self.perSessionTurnoutData.dosesAdministeredArray, 
        self.perSessionTurnoutData.dosesWastedArray, 
        self.perSessionTurnoutData.probabilityArray
        );
    self.expectedAnnualConsumption = WastageCalculations.calculateExpectedAnnualConsumption(
        inputs.dosesPerYear, 
        self.wastageRate
        );
  }
  
  function safetyStockCalculations() {
    var inputs = self.inputs;
    var sessionsInSupplyPeriod = WastageCalculations.maximumNumberOfSessionsPerSupplyInterval(
        inputs.supplyInterval, 
        inputs.sessionsPerWeek
        );    
    self.simulatedVialConsumptionFigures = SafetyStockCalculations.buildSimulatedVialConsumptionFigures(
       inputs.simulationPeriodsToCount,
       inputs.dosesPerVial, 
       sessionsInSupplyPeriod, 
       self.perSessionTurnoutData.cumulativeProbabilityArray
       );
    self.perNumberOfVialsConsumedInSupplyPeriodData = SafetyStockCalculations.buildNumberOfVialsConsumedInSupplyPeriodData(
       inputs.numberOfVialsConsumedInSupplyPeriodToCount, 
       self.simulatedVialConsumptionFigures
       );
    var safetyStockTotals = SafetyStockCalculations.calculateSafetyStock(
        self.simulatedVialConsumptionFigures,          
        self.perNumberOfVialsConsumedInSupplyPeriodData.cumulativeProbability
        );
    self.expectedConsumptionInSupplyInterval = safetyStockTotals.expectedConsumption;
    self.maximumConsumptionInSupplyInterval = safetyStockTotals.maximumConsumption;
    self.minimumSafetyStockForSupplyInterval = safetyStockTotals.minimumSafetyStock;
  }
  
  function monitorWastageCalculations() {
    var inputs = self.inputs;
     var sessionsInReportingPeriod = WastageCalculations.minimumNumberOfSessionsPerReportingPeriod(
        inputs.reportingPeriod, 
        inputs.sessionsPerWeek
        );
    self.perReportingPeriodSimulationData = MonitorWastageCalculations.rebuildReportingPeriodSimulationData(
        inputs.simulationPeriodsToCount, 
        inputs.dosesPerVial, 
        sessionsInReportingPeriod, 
        self.perSessionTurnoutData.cumulativeProbabilityArray
        );     
    var reportingPeriodWastageRates = self.perReportingPeriodSimulationData.wastageRate;    
    self.perReportingPeriodWastageData = MonitorWastageCalculations.rebuildReportingPeriodWastageRateData(
        inputs.binsToCount, 
        inputs.simulationPeriodsToCount, 
        self.perReportingPeriodSimulationData.wastageRate
        );
    var allowableRates = MonitorWastageCalculations.getAllowableWastageRates(
        self.perReportingPeriodWastageData.cumulativeProbability, 
        inputs.binsToCount
        ); 
    self.minAllowableWastageRate = allowableRates.minAllowableWastageRate;
    self.maxAllowableWastageRate = allowableRates.maxAllowableWastageRate;
  }
  
  
});