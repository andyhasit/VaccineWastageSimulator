
/*
  
  Produce graph:
      title: vials consumed probability
      x: Vials consumed per supply period.  (1000)
      Y: probability of that
      
      should be a bell curve
      
      Add 2 lines:
        expected consumption (call it expected value, or mean, average)
        99%upperlimit (

        
99% upper limit = smallest i for which CuPr(i) is greater than 0.99
expected consumption = average of C(i) for I = 1, 10000                      // TODO average out C...
safety stock = roundup(  99% upper limit – expected consumption)          //To nearest integer.

---

CuPr has 10,000 entries
find first index in cupr which is above 0.99 (will be close to 1000) upper99percentLimit /nr of vials.



*/


app.service('SafetyStockCalculations', function(MyMaths){
  var self = this;
      
  // end up with  [32, 12, 43, 23 ...]
  self.setVialsConsumedInSimulationPeriods = function(model) {
    
    var vialSize = Model.inputs.dosesPerVial;
    var simulationPeriods = Model.settings.simulationPeriods;
    var cumulativeProbabilities = Model.data.cumulativeProbabilities;
    var vialsConsumedInSimulationPeriods = Model.data.vialsConsumedInSimulationPeriods;
    vialsConsumedInSimulationPeriods.length = 0;
    
    var sessionsInSupplyPeriod = 31;
    var vialsConsumedInSimulationPeriods = [];
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
  
});