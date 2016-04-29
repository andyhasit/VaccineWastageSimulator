/*
What value is displayed?

*/


app.service('SafetyStockCalculations', function(MyMaths){
  var self = this;

  // end up with  [32, 12, 43, 23 ...]
  self.buildVialsConsumedInSimulationPeriods = function(vialSize, simulationPeriods, cumulativeProbabilities) {
    var sessionsInSupplyPeriod = 31;
    var vialsConsumedInAllPeriods = [];
    for (var i=1; i<=simulationPeriods; i++) {
      var vialsConsumedInThisPeriod = 0;
      for (var j=0; j <= sessionsInSupplyPeriod; j++) {
        var randomNumb = Math.random();
        var dosesAdministered = MyMaths.getSmallestIndexGreaterThan(cumulativeProbabilities, randomNumb);
        var dosesWasted = vialSize - (dosesAdministered % vialSize);
        var vialsConsumed = dosesAdministered + dosesWasted / vialSize;
        vialsConsumedInPeriod += vialsConsumed;
      }
      vialsConsumedInAllPeriods.push(vialsConsumedInThisPeriod);
    }
    return vialsConsumedInAllPeriods;
  };
  
  
});