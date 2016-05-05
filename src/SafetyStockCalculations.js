
app.service('SafetyStockCalculations', function(MyMaths, WastageCalculations){
  var self = this;
      
  self.rebuildSupplyPeriodSimulationData = function(simulationPeriodsToCount, dosesPerVial, sessionsInSupplyPeriod, cumulativeProbabilityArray) {
    /*
    Build perSupplyPeriodSimulationData which is a cluster of arrays where index of each 
    array equates to supply period simulation.
    */
    //TODO: maybe revert back to simple array?
    var perSupplyPeriodSimulationData = {
      vialsConsumed: [],
    };
    
    for (var i=1; i<=simulationPeriodsToCount; i++) {
      var vialsConsumedInThisPeriod = 0;
      for (var j=0; j <= sessionsInSupplyPeriod; j++) {
        var randomNumb = Math.random();
        var dosesAdministered = MyMaths.getSmallestIndexGreaterThan(cumulativeProbabilityArray, randomNumb);
        var dosesWasted = dosesPerVial - (dosesAdministered % dosesPerVial);
        var vialsConsumed = dosesAdministered + dosesWasted / dosesPerVial;
        vialsConsumedInThisPeriod += vialsConsumed;
      }
      perSupplyPeriodSimulationData.vialsConsumed.push(vialsConsumedInThisPeriod);
    }
    return perSupplyPeriodSimulationData;
  };

  self.buildNumberOfVialsConsumedInSupplyPeriodData = function(numberOfVialsConsumedInSupplyPeriodToCount, vialsConsumedInSimulationPeriods) {
    /*
    Build perSupplyPeriodSimulationData which is a cluster of arrays where index of each 
    array equates to a NumberOfVialsConsumedInSupplyPeriod.
    */
    var perNumberOfVialsConsumedInSupplyPeriodData = {
      vialsConsumed: [],
      probability: [],
      cumulativeProbability: [],
    };
    
    var numberOfSimulations = vialsConsumedInSimulationPeriods.length;
    var previousProbability = 0;
    
    for (var i=0; i<=numberOfVialsConsumedInSupplyPeriodToCount; i++) {
      var vialsUsedInPeriod = i;
      var numberOfSupplyPeriodsWhereXvialsUsed = 0;
      for (var i=0; i<=numberOfSimulations; i++) {
        var vialsConsumedInThatPeriod = vialsConsumedInSimulationPeriods[i];
        if (vialsUsedInPeriod == vialsConsumedInThatPeriod) {
          numberOfSupplyPeriodsWhereXvialsUsed += 1;
        }
      }
      var probabilityOfUsingXvialsInPeriod = numberOfSupplyPeriodsWhereXvialsUsed / numberOfSimulations;
      var cumulativeProbability = probabilityOfUsingXvialsInPeriod + previousProbability;
      previousProbability = cumulativeProbability;
      
      perNumberOfVialsConsumedInSupplyPeriodData.vialsConsumed.push(numberOfSupplyPeriodsWhereXvialsUsed);
      perNumberOfVialsConsumedInSupplyPeriodData.probability.push(probabilityOfUsingXvialsInPeriod);
      perNumberOfVialsConsumedInSupplyPeriodData.cumulativeProbability.push(cumulativeProbability);
    }
    return perNumberOfVialsConsumedInSupplyPeriodData;
  };
  
  self.calculateSafetyStock = function(vialsConsumedInSimulationPeriods, cumulativeProbabilityArray) {
    
    var upper99PercentLimit = MyMaths.getSmallestIndexGreaterThan(cumulativeProbabilityArray, 0.99);
    var expectedConsumption = MyMaths.average(vialsConsumedInSimulationPeriods);
    var safetyStock = Math.round(upper99PercentLimit - expectedConsumption);
    return safetyStock;
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