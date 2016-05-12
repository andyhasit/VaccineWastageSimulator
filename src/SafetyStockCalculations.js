
app.service('SafetyStockCalculations', function(MyMaths, WastageCalculations){
  var self = this;
      
  self.rebuildSupplyPeriodSimulationData = function(simulationPeriodsToCount, dosesPerVial, sessionsInSupplyPeriod, 
      cumulativeProbabilityOfTurnoutsArray) {
    /*
    Build perSupplyPeriodSimulationData which is a cluster of arrays where index of each 
    array equates to supply period simulation.
    */
    var vialsConsumedArray = [];
    for (var i=1; i<=simulationPeriodsToCount; i++) {
      var vialsConsumedInThisPeriod = 0;
      for (var j=0; j <= sessionsInSupplyPeriod; j++) {
        var randomNumb = Math.random();
        var dosesAdministered = MyMaths.getSmallestIndexGreaterThan(cumulativeProbabilityOfTurnoutsArray, randomNumb);
        var dosesWasted = dosesPerVial - (dosesAdministered % dosesPerVial);
        var vialsConsumed = (dosesAdministered + dosesWasted) / dosesPerVial;
        vialsConsumedInThisPeriod += vialsConsumed;
      }
      vialsConsumedArray.push(vialsConsumedInThisPeriod);
    }
    return {vialsConsumed: vialsConsumedArray};
  };

  
  self.buildNumberOfVialsConsumedInSupplyPeriodData = function(numberOfVialsConsumedInSupplyPeriodToCount, vialsConsumedInSimulationPeriods) {
    /*
    Build perSupplyPeriodSimulationData which is a cluster of arrays where index of each 
    array equates to a NumberOfVialsConsumedInSupplyPeriod.
    */
    var perNumberOfVialsConsumedInSupplyPeriodData = {
      vialsConsumed: [],
      numberOfSessions: [], //where x vials consumed
      probability: [],
      cumulativeProbability: [],
    };
    
    var numberOfSimulations = vialsConsumedInSimulationPeriods.length;
    var previousProbability = 0;
    
    for (var i=0; i<=numberOfVialsConsumedInSupplyPeriodToCount; i++) {
      var vialsUsedInPeriod = i;
      var numberOfSupplyPeriodsWhereXvialsUsed = 0;
      
      //TODO: transform this into a dictionary outside of the loop.
      for (var j=0; j<=numberOfSimulations; j++) {
        var vialsConsumedInThatPeriod = vialsConsumedInSimulationPeriods[j];
        if (vialsUsedInPeriod === vialsConsumedInThatPeriod) {
          numberOfSupplyPeriodsWhereXvialsUsed += 1;
        }
      }
      //c.log(numberOfSupplyPeriodsWhereXvialsUsed);
      var probabilityOfUsingXvialsInPeriod = numberOfSupplyPeriodsWhereXvialsUsed / numberOfSimulations;
      //c.log(vialsUsedInPeriod);
      //c.log(probabilityOfUsingXvialsInPeriod);
      var cumulativeProbability = probabilityOfUsingXvialsInPeriod + previousProbability;
      previousProbability = cumulativeProbability;
      
      perNumberOfVialsConsumedInSupplyPeriodData.vialsConsumed.push(vialsUsedInPeriod);
      perNumberOfVialsConsumedInSupplyPeriodData.numberOfSessions.push(numberOfSupplyPeriodsWhereXvialsUsed);
      perNumberOfVialsConsumedInSupplyPeriodData.probability.push(probabilityOfUsingXvialsInPeriod);
      perNumberOfVialsConsumedInSupplyPeriodData.cumulativeProbability.push(cumulativeProbability);
    }
    return perNumberOfVialsConsumedInSupplyPeriodData;
  };
  
  self.calculateSafetyStock = function(vialsConsumedInSimulationPeriods, cumulativeProbabilityVialsConsumedArray) {
    /*      
    there should be 3 output variables; 
    expected consumption (1 decimal place; unit=vials), 
    maximum consumption (integer; unit=vials), 
    and minimum safety stock (difference rounded up to nearest integer; unit=vials)
    */
    var upper99PercentLimit = MyMaths.getSmallestIndexGreaterThan(cumulativeProbabilityVialsConsumedArray, 0.99);
    var expectedConsumption = MyMaths.average(vialsConsumedInSimulationPeriods);
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