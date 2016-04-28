

app.service('Model', function(Calculations){
    var self = this;
    
    var inputs = { 
      dosesPerYear: 1000,
      sessionsPerWeek : 2,
      dosesPerVial: 5
    };
    
    self.getDataSet = function() {
      return self.dataSet;
    };
    
    self.getPercentWastage = function() {
      return self.percentWastage;
    };
    
    self.setInputs = function(newInputs) {
      angular.copy(newInputs, inputs);
      self.calculateAll();
    };
    
    self.calculateAll = function() {
      self.dataSet = [];
      var dosesAdministeredArray = [];
      var dosesWastedArray = [];
      var probabilityArray = [];
      var generalProbability = 1 / (52 * inputs.sessionsPerWeek);
      for (var i=0; i < 21; i++) {
        var dosesAdministered = i;
        var dosesWasted = Calculations.calculateVaccinesWastes(inputs.dosesPerVial, dosesAdministered);
        var probability = Calculations.calculateBinomialDistribution(dosesAdministered, inputs.dosesPerYear, generalProbability);
        var expectedSessions = Calculations.calculateExpectedSessions(probability, inputs.sessionsPerWeek);
        var wastageRate = Calculations.calculateWastageRate(dosesAdministered, dosesWasted);
        self.dataSet.push({
          dosesAdministered: dosesAdministered,  
          dosesWasted: Calculations.safeNum(dosesWasted),
          probability: Calculations.safeNum(probability),
          expectedSessions: Calculations.safeNum(expectedSessions),
          wastageRate: Calculations.safeNum(wastageRate)
        });
        dosesWastedArray.push(dosesWasted);
        probabilityArray.push(probability);
        dosesAdministeredArray.push(dosesAdministered);      
      }
      //36: administered    37: wasted    38: probability
      //=(SUMPRODUCT(C37:DM37,C38:DM38))/(SUMPRODUCT(C36:DM36,C38:DM38)+SUMPRODUCT(C37:DM37,C38:DM38))
      var sumProductA = Calculations.sumProduct(dosesWastedArray, probabilityArray);
      var sumProductB = Calculations.sumProduct(dosesAdministeredArray, probabilityArray);
      self.percentWastage = sumProductA / (sumProductB + sumProductA);
    };
    
});