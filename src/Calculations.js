/*
Inputs:
# doses administered per year = Ndy
# sessions per week = Nsw
Vial size (# doses per vial) = Ndv
Supply interval = Ts (1, 3, 6, 12 months)
Reporting period = Tr (1, 3, 6, 12 months)


Intermediate outputs:
Probability of each session size = P(s) = Binomial(s; Ndy, Nsw); s = 1, …, 100

Cumulative probability = C(s) = P(1) + P(2) + … + P(s); s = 1, …, 100
{
  [sessionSize] = cumProb
}

>> (almost s shaped, like a hill) just add.

Maximum number of sessions per supply interval = Nss = function(Nsw, Ts):
  for Ts = 1 month, (Nsw, Nss) = (1, 5), (2, 10), (3, 15), (4, 19), (5, 23), (6, 27), (7, 31);
  for Ts = 3 months, triple Nss, etc.
  
  Just static data, generate once or on demand. have all the data I need here.
>>> 2 pw, 1m = 8 sessions
  
Minimum number of sessions per reporting period = Nsr =f(Nsw, Tr):
  For Tr = 1 month, (Nsw, Nsr) = (1, 4), (2, 8), (3, 12), (4, 16), (5, 20), (6, 24), (7, 28)
  for Tr = 3 months, triple Nsr, etc.
>>>

*/

app.service('Calculations', function(){
    var self = this;
  
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
       returns the probability of k or fewer successes in n independent Bernoulli trials. 
       Each of the trials has an associated probability p of success (and probability 1-p of failure)
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

    /* Are these needed? */
    
    function round(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
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