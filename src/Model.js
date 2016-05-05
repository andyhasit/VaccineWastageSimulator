
/*
This contains the data model, which gets rebuilt on demand, usually when a controller 
instructs it to after changing the inputs.

Build session turn out and wastage data.


Then wastageRate


*/


app.service('Model', function(Calculations, WastageCalculations, SafetyStockCalculations){
  var self = this;
  
  self.inputs = { 
    dosesPerYear: 1000,
    sessionsPerWeek: 2,
    dosesPerVial: 5,
    reportingPeriod: 3, //In months, can be 1, 3, 6 or 12.
    supplyInterval: 3, //In months, can be 1, 3, 6 or 12.
    simulationPeriodsToCount: 10000,
    numberOfVialsConsumedInSupplyPeriodToCount: 1000,
    sessionTurnoutToCount: 20,
    safetyStockTicks: 100, //How many ticks to show on x axis, as numberOfVialsConsumedInSupplyPeriodToCount is too large
  };
    
  /*
  Where index of each array equates to session turnout.
  */
  self.forSessionTurnout = {
    expectedSessions: [],
    dosesWasted: [],
    probability: [],
    cumulativeProbability: [],
  };
  
  /*
  Where index of each array equates to supply period simulation.
  */
  self.forSupplyPeriodSimulation = {
    vialsConsumed = [],
  };
  
  /*
  Where index of each array equates to NumberOfVialsConsumedInSupplyPeriod.
  */
  self.forNumberOfVialsConsumedInSupplyPeriod = {
    vialsConsumed = [],
  };
      
  self.wastageRate: null; // The percentage
  
    simulatedVialConsumptionInSupplyPeriod: [], // 10, 000, each represents a random possible quantity of vials used in a supply period.
    vialsConsumedInSupplyPeriod: [], // 1000, each representing a hypothetical quantity of vials used in a supply period.
    
  self.minAllowableWastageRate: null;
  self.maxAllowableWastageRate: null;
  self.expectedAnnualConsumption: null;
    
  /*
    
    self.data = {
      vialsConsumedInSimulationPeriods: [],
      vialsConsumedInReportingPeriods: [],
      vialsWastedInReportingPeriods: [],
      cumulativeProbabilities: [],
      dosesAdministeredArray: [],
      dosesWastedArray: [],
      probabilityArray: [],
      expectedSessionsArray: [],
      wastageRateArray: [],
      vialsUsedInPeriods: [],
      probabiltyOfVialsUsedInPeriods: [],
      cumulativeProbabiltyOfVialsUsedInPeriods: [],
      percentWastage: null,
      minAllowableWastageRate: null,
      maxAllowableWastageRate: null,
      expectedAnnualConsumption: null,
      sessionSizeProbabilityChartData: [],
      wastageRateChartData: [],
    };
  */
  
  self.refresh = function() {
    rebuildModel();
    rebuildChartData();
  };
    
  function rebuildModel() {
    resetData();
    // This order must be preserved.
    WastageCalculations.buildWastageProbabilityData(self);
    WastageCalculations.calculateWastagePercentage(self);
    WastageCalculations.calculateExpectedAnnualConsumption(self);
    SafetyStockCalculations.setVialsConsumedInSimulationPeriods(self);
    SafetyStockCalculations.setProbabilitiesOfVialQuantitiesUsed(self);
    SafetyStockCalculations.calculateSafetyStock(self);
  };
    
    
    function rebuildChartData() {
      self.data.sessionSizeProbabilityChartData[0] = self.data.probabilityArray.map(function(i){return i *100});
      self.data.wastageRateChartData[0] = self.data.wastageRateArray.map(function(i){return i *100});
      
      
      model.data.vialsConsumedInSimulationPeriods;
    };
    
    
    // -----------------------------------------------------------------------------
    
    self.dosesAdministeredArray = [];
    self.dosesWastedArray = [];
    self.probabilityArray = [];
    self.percentWastage = null;
    self.minAllowableWastageRate = null;
    self.maxAllowableWastageRate = null;
    
    self.expectedAnnualConsumption = null;
    // doses administered per year * (expected wastage rate / [1 – expected wastage rate])

    self.getDataSet = function() {
      return self.dataSet;
    };
    
    /*
    self.setInputs = function(newInputs) {
      angular.copy(newInputs, self.inputs);
      self.calculateAll();
    };
    */
    
    /**
     * Rebuilds the entire dataset based on inouts being changed.
     */
    self.calculateAll = function() {
      self.dataSet = [];
      self.dosesAdministeredArray = [];
      self.dosesWastedArray = [];
      self.probabilityArray = [];
      // TODO add cumulative.
      var generalProbability = 1 / (52 * self.inputs.sessionsPerWeek);
      //Run over 20 samples, this is arbitrary
      for (var i=0; i < 21; i++) {
        var dosesAdministered = i;
        var dosesWasted = Calculations.calculateVaccinesWastes(self.inputs.dosesPerVial, dosesAdministered);
        var probability = Calculations.calculateBinomialDistribution(dosesAdministered, self.inputs.dosesPerYear, generalProbability);
        var expectedSessions = Calculations.calculateExpectedSessions(probability, self.inputs.sessionsPerWeek);
        var wastageRate = Calculations.calculateWastageRate(dosesAdministered, dosesWasted);
        
        // Add to DataSet
        self.dataSet.push({
          dosesAdministered: dosesAdministered,  
          dosesWasted: Calculations.safeNum(dosesWasted),
          probability: Calculations.safeNum(probability),
          expectedSessions: Calculations.safeNum(expectedSessions),
          wastageRate: Calculations.safeNum(wastageRate)
        });
        //Add values to arrays
        self.dosesWastedArray.push(dosesWasted);
        self.probabilityArray.push(probability);
        self.dosesAdministeredArray.push(dosesAdministered);      
      }
      // Calculate percentage from arrays
      var sumProductA = Calculations.sumProduct(self.dosesWastedArray, self.probabilityArray);
      var sumProductB = Calculations.sumProduct(self.dosesAdministeredArray, self.probabilityArray);
      self.percentWastage = sumProductA / (sumProductB + sumProductA);
      
      self.expectedAnnualConsumption = self.inputs.dosesPerYear * (self.percentWastage / (1 - self.percentWastage));
      //c.log(self.expectedAnnualConsumption)
    };

    
});