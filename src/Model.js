
/**
* This contains the data model, which gets rebuilt on demand, usually when a controller 
* instructs it to after changing the inputs.
*/

app.service('Model', function(Calculations){
    var self = this;
    
    self.inputs = { 
      dosesPerYear: 1000,
      sessionsPerWeek : 2,
      dosesPerVial: 5,
      reportingPeriod: 3, //In months, can be 1, 3, 6 or 12.
    };
    
    self.dosesAdministeredArray = [];
    self.dosesWastedArray = [];
    self.probabilityArray = [];
    self.percentWastage = null;
    self.minAllowableWastageRate = null;
    self.maxAllowableWastageRate = null;
    
    self.getDataSet = function() {
      return self.dataSet;
    };
    
    /*
    self.setInputs = function(newInputs) {
      angular.copy(newInputs, self.inputs);
      self.calculateAll();
    };
    */
    
    /**
     * Rebuilds the entire dataset based on inouts being changed.
     */
    self.calculateAll = function() {
      self.dataSet = [];
      self.dosesAdministeredArray = [];
      self.dosesWastedArray = [];
      self.probabilityArray = [];
      var generalProbability = 1 / (52 * self.inputs.sessionsPerWeek);
      //Run over 20 samples, this is arbitrary
      for (var i=0; i < 21; i++) {
        var dosesAdministered = i;
        var dosesWasted = Calculations.calculateVaccinesWastes(self.inputs.dosesPerVial, dosesAdministered);
        var probability = Calculations.calculateBinomialDistribution(dosesAdministered, self.inputs.dosesPerYear, generalProbability);
        var expectedSessions = Calculations.calculateExpectedSessions(probability, self.inputs.sessionsPerWeek);
        var wastageRate = Calculations.calculateWastageRate(dosesAdministered, dosesWasted);
        
        // Add to DataSet
        self.dataSet.push({
          dosesAdministered: dosesAdministered,  
          dosesWasted: Calculations.safeNum(dosesWasted),
          probability: Calculations.safeNum(probability),
          expectedSessions: Calculations.safeNum(expectedSessions),
          wastageRate: Calculations.safeNum(wastageRate)
        });
        //Add values to arrays
        self.dosesWastedArray.push(dosesWasted);
        self.probabilityArray.push(probability);
        self.dosesAdministeredArray.push(dosesAdministered);      
      }
      // Calculate percentage from arrays
      var sumProductA = Calculations.sumProduct(self.dosesWastedArray, self.probabilityArray);
      var sumProductB = Calculations.sumProduct(self.dosesAdministeredArray, self.probabilityArray);
      self.percentWastage = sumProductA / (sumProductB + sumProductA);
    };
    
    
    
});