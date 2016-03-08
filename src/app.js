var c = console;

angular
  .module('app', ['n3-line-chart'])
  .service('Calculations', function(){
    var self = this;
    
    self.calculateVaccinesWastes = function(dosesPerVial, dosesAdministered) {
       var div = dosesAdministered % dosesPerVial;
       if (dosesAdministered ==0 || div == 0) {
          return 0;
       } else {
         return dosesPerVial - div;
       }
    };
    
    self.limitedFactorial = function (n, k) {
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
       //var binomialCoefficient = fac(n) / (fac(k) * fac(n - k));
       var dividend = self.limitedFactorial(n, k);
       var binomialCoefficient = dividend / fac(k);
       c.log(fac(n - k));
       return binomialCoefficient * Math.pow(p, k) * Math.pow(1 - p, n - k);
    };
    
    self.getDataSet = function(dosesPerYear, sessionsPerWeek, dosesPerVial) {
      var entries = [];
      var probability = 1 / (52 * sessionsPerWeek);
      for (var dosesAdministered=1; dosesAdministered < 21; dosesAdministered++) {
          
        entry = {
          dosesAdministered: dosesAdministered,  
          dosesWasted: self.calculateVaccinesWastes(dosesPerVial, dosesAdministered),
          probability: self.calculateBinomialDistribution(dosesAdministered, dosesPerYear, probability),
        };
        entries.push();
      }
    };
    
  })  
  .controller('MainCtrl', function($scope, Calculations) {
      $scope.data = {
        dataset0: [
          {x: 0, val_0: 0, val_1: 0, val_2: 0, val_3: 0},
          {x: 1, val_0: 0.993, val_1: 3.894, val_2: 8.47, val_3: 14.347},
          {x: 2, val_0: 1.947, val_1: 7.174, val_2: 13.981, val_3: 19.991},
          {x: 3, val_0: 2.823, val_1: 9.32, val_2: 14.608, val_3: 13.509},
          {x: 4, val_0: 3.587, val_1: 9.996, val_2: 10.132, val_3: -1.167},
          {x: 5, val_0: 4.207, val_1: 9.093, val_2: 2.117, val_3: -15.136},
          {x: 6, val_0: 4.66, val_1: 6.755, val_2: -6.638, val_3: -19.923},
          {x: 7, val_0: 4.927, val_1: 3.35, val_2: -13.074, val_3: -12.625}
        ]
      };
      /*
      TODO:
        Figure out x and val above.
        
        
        w
        
        Build dataset of 
        For each number of doses per session (1 to 20)
            administered 
            wasted 
            probability
            expected # sessions
      */  
      
      $scope.options = {
        series: [
          {
            axis: "y",
            dataset: "dataset0",
            key: "val_0",
            label: "An area series",
            color: "#1f77b4",
            type: ['line', 'dot'],
            id: 'mySeries0'
          }
        ],
        axes: {x: {key: "x"}}
      };
    });


/*


angular.module('d3app', []);

angular.module('d3app').controller('c1', ['$scope', function($scope) {

 
  $scope.count = 'abcdef';
   
  $scope.color = function() {
    var sizes = [4, 8, 15, 16, 23, 42, 42,42,42,];
    var x = d3.selectAll("b");
    console.log(Object.keys(x));
    d3.selectAll("b")
    .data(sizes)
    .style("font-size", function(d, i) { return sizes[i+2] + "px"; })
    
    
    .style("color", function() {
      return "hsl(" + Math.random() * 360 + ",100%,50%)";
    });
  }
  
}]);

*/