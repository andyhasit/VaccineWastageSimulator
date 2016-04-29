
app.service('MyMaths', function(){
  var self = this;
  
  self.getSmallestIndexGreaterThan = function(items, val){
    var smallest = null;
    for (var i=0; i < items.length; i++) {
      if (items[i] > val) {
        smallest = i;
        break;
      }
    }
    return smallest;
  };
  
  self.sumProduct = function(arr1, arr2){
    var sum = 0;
    for(var i=0; i< arr1.length; i++) {
      sum += arr1[i]*arr2[i];
    }
    return sum;
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

  self.binomialDistribution = function(k, n, p) {
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
  
  self.safeNum = function(value) {
    return isFinite(value)? value : 0;  
  }
  
});
