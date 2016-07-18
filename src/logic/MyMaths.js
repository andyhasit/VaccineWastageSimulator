
app.service('MyMaths', function(Factorial){
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
  
  self.getRandomSessionTurnout = function(cumulativeProbabilities) {
    var randomNumb = Math.random();
    for (var i=0; i<cumulativeProbabilities.length; i++) {
      if (randomNumb <= cumulativeProbabilities[i]) {
        return i;
      }
    }
  };
  
  self.getIndexAtProbability = function(cumulativeProbabilities, probability) {
    for (var i=0; i<cumulativeProbabilities.length; i++) {
      if (probability <= cumulativeProbabilities[i]) {
        return i;
      }
    }
  };  
  
  self.getLargestIndexSmallerThan = function(items, val){
    var smallest = null;
    for (var i=0; i < items.length; i++) {
      if (items[i] > val) {
        smallest = i - 1;
        break;
      }
    }
    return smallest;
  };
  
  self.findFirst = function(items, func, reversed) {
    if (reversed === undefined) {
      reversed = false;
    }
    if (reversed) {
      for(var i=items.length - 1; i >= 0; i--){
        if (func(items[i])) {
          index = i;
          break;
        }
      }
    } else {
      for(var i=0; i< items.length; i++){
        if (func(items[i])) {
          index = i;
          break;
        }
      }
    }
    return index;
  };
  
  self.sumProduct = function(arr1, arr2){
    var sum = 0;
    for(var i=0; i< arr1.length; i++) {
      sum += arr1[i]*arr2[i];
    }
    return sum;
  };
  
  self.average = function(items) {
    var sum = 0.0;
    for(var i=0; i <items.length; i++){
       sum += items[i];
    }
    return sum / items.length;
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
    if (total > Number.MAX_SAFE_INTEGER) {
      c.log(total);
      c.log(k);
      c.log(n);
    }
    return total;
  }; 

  self.binomialDistribution = function(k, n, p) {
    /*
    k: turnout at session
    n : sessions per year
    p: probability
    
     https://support.microsoft.com/en-us/kb/827459
     https://en.wikipedia.org/wiki/Binomial_distribution
     returns the probability of k or fewer successes in n independent Bernoulli trials. 
     Each of the trials has an associated probability p of success (and probability 1-p of failure)
    */
    //var dividend = self.shortenedFactorial(n, k);
    return Factorial.compute(k, n, p);
    var dividend = math.factorial(n)/math.factorial(k)
    c.log(dividend);
    var binomialCoefficient = dividend / math.factorial(k);
    var result = binomialCoefficient * Math.pow(p, k) * Math.pow(1 - p, n - k);
    return result;
  };
  
  self.safeNum = function(value) {
    return isFinite(value)? value : 0;  
  }
  
});


app.service('Factorial', function(){
  var self = this;
  
  function LogGamma(Z) {
    with (Math) {
      var S=1+76.18009173/Z-86.50532033/(Z+1)+24.01409822/(Z+2)-1.231739516/(Z+3)+.00120858003/(Z+4)-.00000536382/(Z+5);
      var LG= (Z-.5)*log(Z+4.5)-(Z+4.5)+log(S*2.50662827465);
    }
    return LG
  }

  function Betinc(X,A,B) {
    var A0=0;
    var B0=1;
    var A1=1;
    var B1=1;
    var M9=0;
    var A2=0;
    var C9;
    while (Math.abs((A1-A2)/A1)>.00001) {
      A2=A1;
      C9=-(A+M9)*(A+B+M9)*X/(A+2*M9)/(A+2*M9+1);
      A0=A1+C9*A0;
      B0=B1+C9*B0;
      M9=M9+1;
      C9=M9*(B-M9)*X/(A+2*M9-1)/(A+2*M9);
      A1=A0+C9*A1;
      B1=B0+C9*B1;
      A0=A0/B1;
      B0=B0/B1;
      A1=A1/B1;
      B1=1;
    }
    return A1/A
  }

  self.compute = function (X, N, P) {
      /*
      X=eval(form.argument.value)
      N=eval(form.samplesize.value)
      P=eval(form.prob.value)
      */
      with (Math) {
      if (N<=0) {
        alert("sample size must be positive must be positive")
      } else if ((P<0)||(P>1)) {
        alert("probability must be between 0 and 1")
      } else if (X<0) {
        bincdf=0
      } else if (X>=N) {
        bincdf=1
      } else {
        X=floor(X);
        Z=P;
        A=X+1;
        B=N-X;
        S=A+B;
        BT=exp(LogGamma(S)-LogGamma(B)-LogGamma(A)+A*log(Z)+B*log(1-Z));
        if (Z<(A+1)/(S+2)) {
          Betacdf=BT*Betinc(Z,A,B)
        } else {
          Betacdf=1-BT*Betinc(1-Z,B,A)
        }
        bincdf=1-Betacdf;
      }
      bincdf=round(bincdf*100000)/100000;
    }
    return bincdf;
  }

});