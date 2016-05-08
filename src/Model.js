
/*
This contains the data model, which gets rebuilt on demand, usually when a controller 
instructs it to after changing the inputs.

Build session turn out and wastage data.


Then wastageRate


*/


app.service('Model', function(){
  var self = this;
  
  self.inputs = { 
    dosesPerYear: 1000,
    sessionsPerWeek: 2,
    dosesPerVial: 5,
    reportingPeriod: 3, //In months, can be 1, 3, 6 or 12.
    supplyInterval: 3, //In months, can be 1, 3, 6 or 12.
    simulationPeriodsToCount: 10000,
    numberOfVialsConsumedInSupplyPeriodToCount: 1000,
    sessionsInReportingPeriodToCount: 1000,
    sessionTurnoutsToCount: 20,
    safetyStockTicks: 100, //How many ticks to show on x axis, as numberOfVialsConsumedInSupplyPeriodToCount is too large
  };
  
  self.perSessionTurnoutData = null;
  self.wastageRate = null;
  self.expectedAnnualConsumption = null;  
  self.minAllowableWastageRate = null;
  self.maxAllowableWastageRate = null;
  
  self.perSupplyPeriodSimulationData = null;
  self.perNumberOfVialsConsumedInSupplyPeriodData = null;
  self.minimumSafetyStock = null;
      
  self.perReportingPeriodSimulationData = null;
  
  /* what about these?
  
  
  model.data.upper99PercentLimit = upper99PercentLimit;
  model.data.safetyStock = safetyStock;
  model.data.expectedConsumption = expectedConsumption;
  */
  
  
  self.charts = {
    sessionSizeProbability: {
      labels: [],
      data: [],
    },
    wastageRate: {
      labels: [],
      data: [],
    },
    consumptionInSupplyPeriodProbability: {
      labels: [],
      data: [],
    },
  };
  
});