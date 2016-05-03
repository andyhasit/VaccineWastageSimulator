
app.service('SafetyStockCalculations', function(MyMaths){
  var self = this;
      
  // end up with  [32, 12, 43, 23 ...]
  self.setVialsConsumedInSimulationPeriods = function(model) {
    
    var vialSize = Model.inputs.dosesPerVial;
    var simulationPeriods = Model.settings.simulationPeriods;
    var cumulativeProbabilities = Model.data.cumulativeProbabilities;
    var vialsConsumedInSimulationPeriods = Model.data.vialsConsumedInSimulationPeriods;    
    var sessionsInSupplyPeriod = WastageCalculations.maximumNumberOfSessionsPerSupplyInterval(
      model.inputs.supplyInterval, model.inputs.sessionsPerWeek);
      
    for (var i=1; i<=simulationPeriods; i++) {
      var vialsConsumedInThisPeriod = 0;
      for (var j=0; j <= sessionsInSupplyPeriod; j++) {
        var randomNumb = Math.random();
        var dosesAdministered = MyMaths.getSmallestIndexGreaterThan(cumulativeProbabilities, randomNumb);
        var dosesWasted = vialSize - (dosesAdministered % vialSize);
        var vialsConsumed = dosesAdministered + dosesWasted / vialSize;
        vialsConsumedInThisPeriod += vialsConsumed;
      }
      vialsConsumedInSimulationPeriods.push(vialsConsumedInThisPeriod);
    }
  };

  self.setProbabilitiesOfVialQuantitiesUsed = function(model) {
  
    var vialsUsedInPeriodRange = model.settings.vialsUsedInPeriodRange;
    var vialsConsumedInSimulationPeriods = model.data.vialsConsumedInSimulationPeriods;
    var numberOfSimulations = vialsConsumedInSimulationPeriods.length;
    var previousProbability = 0;
    
    var vialsUsedInPeriods = model.data.vialsUsedInPeriods;
    var probabiltyOfVialsUsedInPeriods = model.data.probabiltyOfVialsUsedInPeriods;
    var cumulativeProbabiltyOfVialsUsedInPeriods = model.data.cumulativeProbabiltyOfVialsUsedInPeriods;
    
    for (var i=0; i<=vialsUsedInPeriodRange; i++) {
      var vialsUsedInPeriod = i;
      var numberOfSupplyPeriodsWhereXvialsUsed = 0;
      angular.forEach(vialsConsumedInSimulationPeriods, function(vialsConsumedInThatPeriod) {
        if (vialsUsedInPeriod == vialsConsumedInThatPeriod) {
          numberOfSupplyPeriodsWhereXvialsUsed += 1;
        }
      });
      vialsUsedInPeriods.push(numberOfSupplyPeriodsWhereXvialsUsed);
      var probabilityOfUsingXvialsInPeriod = numberOfSupplyPeriodsWhereXvialsUsed / numberOfSimulations;
      probabiltyOfVialsUsedInPeriods.push(probabilityOfUsingXvialsInPeriod);
      
      cumulativeProbability = probabilityOfUsingXvialsInPeriod + previousProbability;
      cumulativeProbabiltyOfVialsUsedInPeriods.push(cumulativeProbability);
      previousProbability = cumulativeProbability;
    }
  };
  
  self.calculateSafetyStock  = function(model) {
    var cumulativeProbabilities = model.data.cumulativeProbabilities;
    var vialsConsumedInSimulationPeriods = model.data.vialsConsumedInSimulationPeriods;
    
    var upper99PercentLimit = MyMaths.getSmallestIndexGreaterThan(cumulativeProbabilities, 0.99);
    var expectedConsumption = MyMaths.average(vialsConsumedInSimulationPeriods);
    var safetyStock = MyMaths.roundUp(upper99PercentLimit - expectedConsumption);
      
    model.data.upper99PercentLimit = upper99PercentLimit;
    model.data.safetyStock = safetyStock;
    model.data.expectedConsumption = expectedConsumption;
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