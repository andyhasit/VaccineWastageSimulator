app.service('Calculations', function(){
    var self = this;
  
    function round(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }
    
    self.sumProduct = function(arr1, arr2){
      var sum = 0;
      for(var i=0; i< arr1.length; i++) {
        sum += arr1[i]*arr2[i];
      }
      return sum;
    };

    self.calculateVaccinesWastes = function(dosesPerVial, dosesAdministered) {
       var div = dosesAdministered % dosesPerVial;
       if (dosesAdministered ==0 || div == 0) {
          return 0;
       } else {
         return dosesPerVial - div;
       }
    };

    self.shortenedFactorial = function (n, k) {
      if (k == 0) {
        return math.factorial(0);
      }
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
      n : sessions per year
      k: turnout at session
      p: probability
      
       https://support.microsoft.com/en-us/kb/827459
       https://en.wikipedia.org/wiki/Binomial_distribution
       returns the probability of k or fewer successes in n independent Bernoulli trials. Each of the trials has an associated probability p of success (and probability 1-p of failure)
      */
      var dividend = self.shortenedFactorial(n, k);
      var binomialCoefficient = dividend / math.factorial(k);
      var result = binomialCoefficient * Math.pow(p, k) * Math.pow(1 - p, n - k);
      return result;
    };
    
    self.calculateExpectedSessions = function(probability, sessionsPerWeek) {
      return probability * sessionsPerWeek * 52;
    };

    self.calculateWastageRate = function(dosesAdministered, dosesWasted) {
      return dosesWasted / (dosesWasted + dosesAdministered);
    };

    self.safeNum = function(value) {
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
    };

});