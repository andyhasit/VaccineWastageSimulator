

app.service('MonitorWastageCalculations', function(WastageCalculations, MyMaths){
  
  var self = this;  
  
  self.rebuildReportingPeriodSimulationData = function(simulationPeriodsToCount, dosesPerVial, sessionsInReportingPeriod, 
    cumulativeProbabilities) {
    /*
    Build perReportingPeriodSimulationData which is a cluster of arrays where index of each 
    array equates to supply period simulation.
    */
    c.log(cumulativeProbabilities);
    var perReportingPeriodSimulationData = {
      dosesConsumed: [],
      dosesWasted: [],
      wastageRate: [],
    };
    for (var i=1; i<=simulationPeriodsToCount; i++) {
      var dosesConsumedInThisPeriod = 0;
      var dosesWastedInThisPeriod = 0;
      
      for (var j=1; j <= sessionsInReportingPeriod; j++) {
        var randomNumb = Math.random();
        var dosesAdministered = MyMaths.getSmallestIndexGreaterThan(cumulativeProbabilities, randomNumb);
        var dosesWasted = dosesPerVial - (dosesAdministered % dosesPerVial);
        var dosesConsumed = dosesAdministered + dosesWasted;
        dosesConsumedInThisPeriod += dosesConsumed;
        dosesWastedInThisPeriod += dosesWasted;
        if (i < 3 && j < 5) {
          c.log(randomNumb + ' >>> ' + dosesAdministered);
        }
      }
      
      var wastageRate = dosesWastedInThisPeriod / dosesConsumedInThisPeriod;
      perReportingPeriodSimulationData.dosesConsumed.push(dosesConsumedInThisPeriod);
      perReportingPeriodSimulationData.dosesWasted.push(dosesWastedInThisPeriod);
      perReportingPeriodSimulationData.wastageRate.push(wastageRate);
      var x = dosesConsumedInThisPeriod - dosesWastedInThisPeriod;
      //c.log('con: ' + dosesConsumedInThisPeriod  + ' wasted: ' +  dosesWastedInThisPeriod + ' administered: ' + x + ' rate: ' + wastageRate);
    }
    return perReportingPeriodSimulationData;
  };
  
  //self.determineDoseUsageForPeriod(
  
  self.rebuildReportingPeriodWastageRateData = function(binsToCount, simulationPeriodsToCount, reportingPeriodWastageRates) {

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
        //c.log('a: ' + wastageRate + 'b: ' + lowerLimit + 'c: ' + upperLimit);
        if ((wastageRate > lowerLimit) && (wastageRate <= upperLimit)) {
          numberOfPeriodsWithThisWastageRate += 1;
        }
      }
      //c.log('lower: ' + lowerLimit + ' upper: ' + upperLimit + ' number: ' + numberOfPeriodsWithThisWastageRate);
      var probabilityOfWastageRate = numberOfPeriodsWithThisWastageRate / simulationPeriodsToCount;
      var cumulativeProbability = probabilityOfWastageRate + previousProbability;
      previousProbability = cumulativeProbability;
      
      data.lowerLimit.push(lowerLimit);
      data.upperLimit.push(upperLimit);
      data.numberOfPeriods.push(numberOfPeriodsWithThisWastageRate);
      data.probability.push(probabilityOfWastageRate);
      data.cumulativeProbability.push(cumulativeProbability); 
    }
    /*
    c.log("reportingPeriodWastageRates");
    c.log(reportingPeriodWastageRates); // from simulation
    c.log("\nlowerLimits:");
    c.log(data.lowerLimit);
    c.log("\nupperLimits:");
    c.log(data.upperLimit);
    c.log("\nnumberOfPeriods matching that rate:");
    c.log(data.numberOfPeriods);
    c.log("\nprobability of that number:");
    c.log(data.probability);
    */
    return data;
  };

  self.getAllowableWastageRates = function(cumulativeProbabilityArray, binsToCount) {
    var a = MyMaths.getLargestIndexSmallerThan(cumulativeProbabilityArray, 0.01);
    var b = MyMaths.getSmallestIndexGreaterThan(cumulativeProbabilityArray, 0.99) ;
    return {
      minAllowableWastageRate: a /binsToCount,
      maxAllowableWastageRate: (b-1) / binsToCount,
    }
  };
  
});

/*

    //rebuildRandomNumbersIfNeeded(simulationPeriodsToCount * sessionsInReportingPeriod);
  var randomNumbersArray = [];
  function rebuildRandomNumbersIfNeeded(quantity) {
    //Rebuilds random numbers to size required if not at that size already.
    if (randomNumbersArray.length < quantity) {
      var qtyToAdd = quantity - randomNumbersArray.length;
      for (var i=1; i<=qtyToAdd; i++) {
        randomNumbersArray.push(Math.random());
      }
    }
  }
  */