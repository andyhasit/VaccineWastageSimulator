
app.service('SafetyStockCalculations', function(MyMaths){
  var self = this;
  
  self.buildSimulatedVialConsumptionFigures = function(simulationPeriodsToCount, dosesPerVial,
    sessionsInSupplyPeriod, cumulativeProbabilityOfTurnoutsArray){
    simulatedVialConsumptionFigures = [];
    for (var i=1; i<=simulationPeriodsToCount; i++) {
      var simulatedValue = simulateNumberOfVialsConsumedInPeriod(dosesPerVial, sessionsInSupplyPeriod, cumulativeProbabilityOfTurnoutsArray);
      simulatedVialConsumptionFigures.push(simulatedValue);
    }
    return simulatedVialConsumptionFigures;
  };
  
  function simulateNumberOfVialsConsumedInPeriod(dosesPerVial, sessionsInSupplyPeriod, cumulativeProbabilityOfTurnoutsArray) {
    var vialsConsumedInThisPeriod = 0;
    for (var j=0; j <= sessionsInSupplyPeriod; j++) {
      var randomNumb = Math.random();
      var dosesAdministered = MyMaths.getSmallestIndexGreaterThan(cumulativeProbabilityOfTurnoutsArray, randomNumb);
      var dosesWasted = dosesPerVial - (dosesAdministered % dosesPerVial);
      dosesWasted = (dosesWasted == dosesPerVial)? 0 : dosesWasted;
      var vialsConsumed = (dosesAdministered + dosesWasted) / dosesPerVial;
      vialsConsumedInThisPeriod += vialsConsumed;
    }
    return vialsConsumedInThisPeriod;
  }

  
  self.buildNumberOfVialsConsumedInSupplyPeriodData = function(numberOfVialsConsumedInSupplyPeriodToCount, 
    simulatedVialConsumptionFigures) {
    /*
    Build perSupplyPeriodSimulationData which is a cluster of arrays where index of each 
    array equates to a NumberOfVialsConsumedInSupplyPeriod. NOT TRUE!
    */
    var perNumberOfVialsConsumedInSupplyPeriodData = {
      vialsConsumed: [],
      numberOfSessions: [], //where x vials consumed
      probability: [],
      cumulativeProbability: [],
    };
    
    var numberOfSimulations = simulatedVialConsumptionFigures.length;
    var previousProbability = 0;
    //MUST START AT 0 or index of array is no longer correct.
    for (var vialsUsedInPeriod=0; vialsUsedInPeriod<=numberOfVialsConsumedInSupplyPeriodToCount; vialsUsedInPeriod++) {
      var numberOfSupplyPeriodsWhereXvialsUsed = countSupplyPeriodsWhereXvialsUsed(vialsUsedInPeriod, numberOfSimulations, simulatedVialConsumptionFigures);
      
      var probabilityOfUsingXvialsInPeriod = numberOfSupplyPeriodsWhereXvialsUsed / numberOfSimulations;
      var cumulativeProbability = probabilityOfUsingXvialsInPeriod + previousProbability;
      previousProbability = cumulativeProbability;
      
      perNumberOfVialsConsumedInSupplyPeriodData.vialsConsumed.push(vialsUsedInPeriod);
      perNumberOfVialsConsumedInSupplyPeriodData.numberOfSessions.push(numberOfSupplyPeriodsWhereXvialsUsed);
      perNumberOfVialsConsumedInSupplyPeriodData.probability.push(probabilityOfUsingXvialsInPeriod);
      perNumberOfVialsConsumedInSupplyPeriodData.cumulativeProbability.push(cumulativeProbability);
    }
    return perNumberOfVialsConsumedInSupplyPeriodData;
  };
  
  function countSupplyPeriodsWhereXvialsUsed(vialsUsedInPeriod, numberOfSimulations, simulatedVialConsumptionFigures){
    //TODO: use a dictionary...faster.
    var numberOfSupplyPeriodsWhereXvialsUsed = 0;
    for (var j=0; j<=numberOfSimulations; j++) {
      var vialsConsumedInThatPeriod = simulatedVialConsumptionFigures[j];
      if (vialsUsedInPeriod === vialsConsumedInThatPeriod) {
        numberOfSupplyPeriodsWhereXvialsUsed += 1;
      }
    }
    return numberOfSupplyPeriodsWhereXvialsUsed;
  }
  
  self.calculateSafetyStock = function(simulatedVialConsumptionFigures, cumulativeProbabilityVialsConsumedArray) {
    /*      
    there should be 3 output variables; 
    expected consumption (1 decimal place; unit=vials), 
    maximum consumption (integer; unit=vials), 
    and minimum safety stock (difference rounded up to nearest integer; unit=vials)
    */
    var upper99PercentLimit = MyMaths.getSmallestIndexGreaterThan(cumulativeProbabilityVialsConsumedArray, 0.99);
    var expectedConsumption = MyMaths.average(simulatedVialConsumptionFigures); //TODO: why do I get 15.1 whereas you get 14?
    var minimumSafetyStock = Math.ceil(upper99PercentLimit - expectedConsumption);
    return {
      expectedConsumption: expectedConsumption,
      maximumConsumption: upper99PercentLimit,
      minimumSafetyStock: minimumSafetyStock
    };
  }
  
});

/*
  
  Produce graph:
      title: vials consumed probability
      x: Vials consumed per supply period.  (1000)
      Y: probability of that
      
      should be a bell curve
      
      Add 2 lines:
        expected consumption (call it expected value, or mean, average)
        99%upperlimit (
*/