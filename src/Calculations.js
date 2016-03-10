app.service('Calculations', function(){
    var self = this;
    
    self.inputs = { 
      dosesPerYear: 1000,
      sessionsPerWeek : 2,
      dosesPerVial: 5
    };
    
    function round(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    self.calculateVaccinesWastes = function(dosesPerVial, dosesAdministered) {
       var div = dosesAdministered % dosesPerVial;
       if (dosesAdministered ==0 || div == 0) {
          return 0;
       } else {
         return dosesPerVial - div;
       }
    };

    self.shortenedFactorial = function (n, k) {
      var total = 1;
      var stop = n - k + 1;
      for (var i=0; i<n; i++) {
        var nextNumber = n - i;
        total = total * nextNumber;
        if (nextNumber == stop) {
          break;
        }
      }
      return total;
    }; 

    self.calculateBinomialDistribution = function(k, n, p) {
      /*
       https://support.microsoft.com/en-us/kb/827459
       https://en.wikipedia.org/wiki/Binomial_distribution
       returns the probability of k or fewer successes in n independent Bernoulli trials. Each of the trials has an associated probability p of success (and probability 1-p of failure)
      */
      var fac = math.factorial;
      var dividend = self.shortenedFactorial(n, k);
      var binomialCoefficient = dividend / fac(k);
      var result = binomialCoefficient * Math.pow(p, k) * Math.pow(1 - p, n - k);
      return result;
    };
    self.calculateExpectedSessions = function(probability, sessionsPerWeek) {
      return probability * sessionsPerWeek * 52;
    };

    self.calculateWastageRate = function(dosesAdministered, dosesWasted) {
      return dosesWasted / (dosesWasted + dosesAdministered);
    };

    function safeNum(value) {
      return isFinite(value)? value : 0;  
    }

    self.getHighestVal = function(dataSet, key) {
      var highest = 0;
      angular.forEach(dataSet, function(entry) {
        var test = entry[key];
        if (isFinite(test) && (test > highest)) {
          highest = test;
        }
      });
      return highest;
    }

    self.getDataSet = function() {
      var entries = [];
      var generalProbability = 1 / (52 * self.inputs.sessionsPerWeek);
      for (var i=0; i < 21; i++) {
        var dosesAdministered = i;
        var dosesWasted = self.calculateVaccinesWastes(self.inputs.dosesPerVial, dosesAdministered);
        var probability = self.calculateBinomialDistribution(dosesAdministered, self.inputs.dosesPerYear, generalProbability);
        var expectedSessions = self.calculateExpectedSessions(probability, self.inputs.sessionsPerWeek);
        var wastageRate = self.calculateWastageRate(dosesAdministered, dosesWasted);
        entries.push({
          dosesAdministered: dosesAdministered,  
          dosesWasted: safeNum(dosesWasted),
          probability: safeNum(probability),
          expectedSessions: safeNum(expectedSessions),
          wastageRate: safeNum(wastageRate)
        });
      }
      return entries;
    };

});