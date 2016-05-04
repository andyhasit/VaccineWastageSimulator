
app.service('WastageCalculations', function(MyMaths){
  var self = this;
  
  self.buildWastageProbabilityData = function (model) {
    var previousProbability = 0;
    var generalProbability = 1 / (52 * model.inputs.sessionsPerWeek);
    var dosesAdministeredRange = model.settings.dosesAdministeredRange;
    
    for (var i=0; i<=dosesAdministeredRange; i++) {
      var dosesAdministered = i;
      var dosesWasted = self.calculateVaccinesWastes(model.inputs.dosesPerVial, dosesAdministered);
      var probability = MyMaths.binomialDistribution(dosesAdministered, model.inputs.dosesPerYear, generalProbability);
      var expectedSessions = self.calculateExpectedSessions(probability, model.inputs.sessionsPerWeek);
      var wastageRate = self.calculateWastageRate(dosesAdministered, dosesWasted);
      
      var cumulativeProbability = probability + previousProbability;
      previousProbability = cumulativeProbability;
    
      //Add values to arrays
      model.data.dosesAdministeredArray.push(dosesAdministered);
      model.data.dosesWastedArray.push(dosesWasted);
      model.data.probabilityArray.push(probability);
      model.data.expectedSessionsArray.push(expectedSessions);
      model.data.cumulativeProbabilities.push(cumulativeProbability);
      model.data.wastageRateArray.push(wastageRate);  
    }
  };
  
  self.calculateWastagePercentage = function (model) {
    var sumProductA = MyMaths.sumProduct(model.data.dosesWastedArray, model.data.probabilityArray);
    var sumProductB = MyMaths.sumProduct(model.data.dosesAdministeredArray, model.data.probabilityArray);
    model.data.percentWastage = sumProductA / (sumProductB + sumProductA);
  };
  
  self.calculateExpectedAnnualConsumption = function (model) {
    model.data.expectedAnnualConsumption = model.inputs.dosesPerYear * (model.data.percentWastage / (1 - model.data.percentWastage));
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
    return sessionsPerMonth * supplyIntervals;
  };

});
