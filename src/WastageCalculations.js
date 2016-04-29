
app.service('WastageCalculations', function(MyMaths){
  var self = this;
  
  self.buildWastageProbabilityData = function (model) {
    var previousProbability = 0;
    var generalProbability = 1 / (52 * model.inputs.sessionsPerWeek);
    var dosesAdministeredRange = model.settings.dosesAdministeredRange;
    
    for (var i=0; i<=dosesAdministeredRange; i++) {
      var dosesAdministered = i;
      var dosesWasted = Calculations.calculateVaccinesWastes(model.inputs.dosesPerVial, dosesAdministered);
      var probability = Calculations.calculateBinomialDistribution(dosesAdministered, model.inputs.dosesPerYear, generalProbability);
      var expectedSessions = Calculations.calculateExpectedSessions(probability, model.inputs.sessionsPerWeek);
      var wastageRate = Calculations.calculateWastageRate(dosesAdministered, dosesWasted);
      
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
    var sumProductA = Calculations.sumProduct(model.data.dosesWastedArray, model.data.probabilityArray);
    var sumProductB = Calculations.sumProduct(model.data.dosesAdministeredArray, model.data.probabilityArray);
    model.data.percentWastage = sumProductA / (sumProductB + sumProductA);
  };
  
  self.calculateExpectedAnnualConsumption = function (model) {
    model.data.expectedAnnualConsumption = model.data.inputs.dosesPerYear * (model.data.percentWastage / (1 - model.data.percentWastage));
  };
  
});
