

app.service('MonitorWastageCalculations', function(WastageCalculations, MyMaths){
  
  var self = this;  
  
  self.rebuildReportingPeriodSimulationData = function(simulationPeriodsToCount, dosesPerVial, 
    sessionsInReportingPeriod, cumulativeProbabilities) {
    /*
    Build perReportingPeriodSimulationData which is a cluster of arrays where index of each 
    array equates to supply period simulation.
    */
    var data = {
      dosesConsumed: [],
      dosesWasted: [],
      wastageRate: [],
    };
    for (var i=1; i<=simulationPeriodsToCount; i++) {
      figures = getFiguresForPeriod(dosesPerVial, sessionsInReportingPeriod, cumulativeProbabilities);
      data.dosesConsumed.push(figures[0]);
      data.dosesWasted.push(figures[1]);
      data.wastageRate.push(figures[2]);
    }
    return data;
  };
  
  function getFiguresForPeriod(dosesPerVial, sessionsInReportingPeriod, cumulativeProbabilities){
    var dosesConsumedInThisPeriod = 0;
    var dosesWastedInThisPeriod = 0;
    for (var j=0; j<sessionsInReportingPeriod; j++) {
      var dosesAdministered = MyMaths.getRandomSessionTurnout(cumulativeProbabilities);
      var dosesWasted = dosesPerVial - (dosesAdministered % dosesPerVial);
      dosesWasted = (dosesWasted == dosesPerVial)? 0 : dosesWasted;
      var dosesConsumed = dosesAdministered + dosesWasted;
      dosesConsumedInThisPeriod += dosesConsumed;
      dosesWastedInThisPeriod += dosesWasted;
    }
    var wastageRate = dosesWastedInThisPeriod / dosesConsumedInThisPeriod;
    return [dosesConsumedInThisPeriod, dosesWastedInThisPeriod, wastageRate]
  }
  
  
  
  self.rebuildReportingPeriodWastageRateData = function(binsToCount, simulationPeriodsToCount,
    reportingPeriodWastageRates) {

    //reportingPeriodWastageRates: [0.03960880195599022, 0.03383084577114428, 0.03316831683168317...]
    var data = {
      lowerLimit : [],
      upperLimit : [],
      numberOfPeriods : [],
      probability : [],
      cumulativeProbability : [],
    };
    var previousProbability = 0;
    
    for (var i=1; i<=binsToCount; i++) {
      var numbersOfSessions = i;
      var lowerLimit = (numbersOfSessions - 1) / binsToCount;
      var upperLimit = numbersOfSessions / binsToCount;
      
      var numberOfPeriodsWithThisWastageRate = 0;
      for (var j=1; j<=simulationPeriodsToCount; j++) {
        var wastageRate = reportingPeriodWastageRates[j];
        if ((wastageRate > lowerLimit) && (wastageRate <= upperLimit)) {
          numberOfPeriodsWithThisWastageRate += 1;
        }
      }
      var probabilityOfWastageRate = numberOfPeriodsWithThisWastageRate / simulationPeriodsToCount;
      var cumulativeProbability = probabilityOfWastageRate + previousProbability;
      previousProbability = cumulativeProbability;
      
      data.lowerLimit.push(lowerLimit);
      data.upperLimit.push(upperLimit);
      data.numberOfPeriods.push(numberOfPeriodsWithThisWastageRate);
      data.probability.push(probabilityOfWastageRate);
      data.cumulativeProbability.push(cumulativeProbability); 
    }
    return data;
  };

  self.getAllowableWastageRates = function(cumulativeProbabilityArray, binsToCount) {
    var a = MyMaths.getLargestIndexSmallerThan(cumulativeProbabilityArray, 0.01);
    var b = MyMaths.getSmallestIndexGreaterThan(cumulativeProbabilityArray, 0.99) ;
    return {
      minAllowableWastageRate: a / binsToCount,
      maxAllowableWastageRate: (b) / binsToCount,
    }
  };
  
});
