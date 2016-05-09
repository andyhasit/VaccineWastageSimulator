
app.service('MonitorWastageCalculations', function(WastageCalculations, MyMaths){
  
  var self = this;  
  
/*
do i = 1, 10000 // loop over 10000 reporting period simulations
               W(i) = 0 // number of vials wasted in this reporting period simulation
               Nv(i) = 0 // number of vials consumed in this reporting period simulation
               do j = 1, Nsr // loop over sessions in the reporting period
                              generate a random real number in the range [0, 1]; r
                              # doses administered = smallest k for which C(k) > r; a
                              # doses wasted = V – mod(a, V); w
                              # doses consumed = a + w ; c
                              W(i) = W(i) + w
                              Nv(i) = Nv(i) + c
               enddo
               WR(i) = W(i) / Nv(i) // wastage rate in this reporting period simulation
enddo
*/
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
    
    for (var i=1; i<=simulationPeriodsToCount; i++) {
      var dosesConsumedInThisPeriod = 0;
      var dosesWastedInThisPeriod = 0;
      for (var j=0; j <= sessionsInReportingPeriod; j++) {
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

  
  self.rebuildReportingPeriodWastageRateData = function(sessionsInReportingPeriodToCount, simulationPeriodsToCount, reportingPeriodWastageRates) {

    var data = {
      lowerLimit : [],
      upperLimit : [],
      numberOfPeriods : [],
      probability : [],
      cumulativeProbability : [],
    };
    var previousProbability = 0;
    
    for (var i=0; i<=sessionsInReportingPeriodToCount; i++) {
      var numbersOfSessions = i;
      var lowerLimit = (numbersOfSessions - 1) / 10;
      var upperLimit = numbersOfSessions / 10;
      var numberOfPeriodsWithThisWastageRate = 0;
      for (var j=0; j<=simulationPeriodsToCount; j++) {
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
  /*
minimum wastage rate = largest i for which CuPr(i) is less than 0.01
maximum wastage rate = smallest i for which CuPr(i) is greater than 0.99
*/ 
  self.getAllowableWastageRates = function(cumulativeProbabilityArray) {
    return {
      minAllowableWastageRate: MyMaths.getLargestIndexSmallerThan(cumulativeProbabilityArray, 0.01),
      maxAllowableWastageRate: MyMaths.getSmallestIndexGreaterThan(cumulativeProbabilityArray, 0.99)
    }
  };
  
});