
app.service('WastageCalculations', function(MyMaths){
  var self = this;
  
  self.rebuildSessionTurnoutData = function (sessionTurnoutsToCount, sessionsPerWeek, dosesPerVial, dosesPerYear) {
    /*
    Build perSessionTurnoutData which is a cluster of arrays where index of each 
    array equates to session turnout.
    */
    var perSessionTurnoutData = {
      dosesAdministered: [],
      expectedSessions: [],
      probability: [],
      cumulativeProbability: [],
      dosesWasted: [],
      wastageRate: [],
    };
    var previousProbability = 0;
    var generalProbability = 1 / (52 * sessionsPerWeek);
    
    for (var i=0; i<=sessionTurnoutsToCount; i++) {
      var dosesAdministered = i;
      var dosesWasted = self.calculateVaccinesWastes(dosesPerVial, dosesAdministered);
      var probability = MyMaths.binomialDistribution(dosesAdministered, dosesPerYear, generalProbability);
      var expectedSessions = self.calculateExpectedSessions(probability, sessionsPerWeek);
      var wastageRate = self.calculateWastageRate(dosesAdministered, dosesWasted);
      
      var cumulativeProbability = probability + previousProbability;
      previousProbability = cumulativeProbability;
    
      //Add values to arrays
      perSessionTurnoutData.dosesAdministered.push(dosesAdministered);
      perSessionTurnoutData.dosesWasted.push(dosesWasted);
      perSessionTurnoutData.probability.push(probability);
      perSessionTurnoutData.wastageRate.push(wastageRate); 
      perSessionTurnoutData.expectedSessions.push(expectedSessions);
      perSessionTurnoutData.cumulativeProbability.push(cumulativeProbability); 
    }
    //c.log(perSessionTurnoutData.probability);
    //c.log(perSessionTurnoutData.cumulativeProbability);
    return perSessionTurnoutData;
  };
  
  self.calculateWastagePercentage = function (dosesAdministeredArray, dosesWastedArray, probabilityArray) {
    var sumProductA = MyMaths.sumProduct(dosesWastedArray, probabilityArray);
    var sumProductB = MyMaths.sumProduct(dosesAdministeredArray, probabilityArray);
    return sumProductA / (sumProductB + sumProductA);
  };
  
  self.calculateExpectedAnnualConsumption = function (dosesPerYear, wastageRate) {
    return Math.round(dosesPerYear / (1 - wastageRate));
  };
  
  self.calculateVaccinesWastes = function(dosesPerVial, dosesAdministered) {
    var div = dosesAdministered % dosesPerVial;
    if (dosesAdministered ==0 || div == 0) {
      return 0;
    } else {
     return dosesPerVial - div;
    }
  };

  self.calculateExpectedSessions = function(probability, sessionsPerWeek) {
    return probability * sessionsPerWeek * 52;
  };

  self.calculateWastageRate = function(dosesAdministered, dosesWasted) {
    return dosesWasted / (dosesWasted + dosesAdministered);
  };
  
  //sessionsPerWeek: MaxPerMonth
  var maxSessionsForOneMonth = {
    1: 5,  
    2: 10,  
    3: 15,  
    4: 19,  
    5: 23,  
    6: 27,  
    7: 31,  
  };
  
  //sessionsPerWeek: MaxPerMonth
  var minSessionsForOneMonth = {
    1: 4,  
    2: 8,
    3: 12,
    4: 16,  
    5: 20,  
    6: 24,  
    7: 28,  
  };
  
  self.maximumNumberOfSessionsPerSupplyInterval = function(supplyIntervals, sessionsPerWeek) {
    var sessionsPerMonth = maxSessionsForOneMonth[sessionsPerWeek];
    return sessionsPerMonth * supplyIntervals;
  };
  
  self.minimumNumberOfSessionsPerReportingPeriod = function(reportingPeriod, sessionsPerWeek) {
    var sessionsPerMonth = minSessionsForOneMonth[sessionsPerWeek];
    return sessionsPerMonth * reportingPeriod;
  };

});
