
app.service('MonitorWastageCalculations', function(WastageCalculations, MyMaths){
  
  var self = this;  
  
  self.rebuildReportingPeriodSimulationData = function(simulationPeriodsToCount, dosesPerVial, sessionsInReportingPeriod, 
    cumulativeProbabilities) {
    /*
    Build perReportingPeriodSimulationData which is a cluster of arrays where index of each 
    array equates to supply period simulation.
    */
    var perReportingPeriodSimulationData = {
      dosesConsumed: [],
      dosesWasted: [],
      wastageRate: [],
    };
    //rebuildRandomNumbersIfNeeded(simulationPeriodsToCount * sessionsInReportingPeriod);
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
      }
      perReportingPeriodSimulationData.dosesConsumed.push(dosesConsumedInThisPeriod);
      perReportingPeriodSimulationData.dosesWasted.push(dosesWastedInThisPeriod);
      perReportingPeriodSimulationData.wastageRate.push(dosesWastedInThisPeriod / dosesConsumedInThisPeriod);
    }
    return perReportingPeriodSimulationData;
  };
  
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
  
  
  /*
do i = 1, 1000
     x_low(i) = (i-1)/10 // wastage rate bin lower limit
     x_high(i) = i/10 // wastage rate bin higher limit
     N(i)=0 // number of reporting periods in which the wastage rate is in the ith bin
     do j = 1, 10000
        If ( WR(j) > x_low(i) .AND. WR(j) <= x_high(i) )
            N(i) = N(i) + 1
     enddo
     Pr(i) = N(i) / 10000 // probability of getting a wastage rate in the ith bin in a reporting period
(chart this)
     if (i = 1) then
CuPr(i) = Pr(i)
     else
                    CuPr(i) = CuPr(i-1) + Pr(i)
     endif
enddo
minimum wastage rate = largest i for which CuPr(i) is less than 0.01
maximum wastage rate = smallest i for which CuPr(i) is greater than 0.99
*/ 

  
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
    c.log(reportingPeriodWastageRates);
    
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
      
      var probabilityOfWastageRate = numberOfPeriodsWithThisWastageRate / simulationPeriodsToCount;
      var cumulativeProbability = probabilityOfWastageRate + previousProbability;
      previousProbability = cumulativeProbability;
      
      data.lowerLimit.push(lowerLimit);
      data.upperLimit.push(upperLimit);
      data.numberOfPeriods.push(numberOfPeriodsWithThisWastageRate);
      data.probability.push(probabilityOfWastageRate);
      data.cumulativeProbability.push(cumulativeProbability); 
    }
    c.log(data);
    return data;
  };
  /*
minimum wastage rate = largest i for which CuPr(i) is less than 0.01
maximum wastage rate = smallest i for which CuPr(i) is greater than 0.99
*/ 
  self.getAllowableWastageRates = function(cumulativeProbabilityArray, binsToCount) {
    var a = MyMaths.getLargestIndexSmallerThan(cumulativeProbabilityArray, 0.01);
    var b = MyMaths.getSmallestIndexGreaterThan(cumulativeProbabilityArray, 0.99) ;
    return {
      minAllowableWastageRate: a /binsToCount,
      maxAllowableWastageRate: (b-1) / binsToCount,
    }
  };
  
});