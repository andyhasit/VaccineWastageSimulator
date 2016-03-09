var c = console;

angular
  .module('app', ['n3-line-chart'])
  .service('Calculations', function(){
    var self = this;
    self.decimalPoints = 9;
    
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
    
    self.getDataSet = function(dosesPerYear, sessionsPerWeek, dosesPerVial) {
      var entries = [];
      var generalProbability = 1 / (52 * sessionsPerWeek);
      for (var i=0; i < 21; i++) {
        var dosesAdministered = i;
        var dosesWasted = self.calculateVaccinesWastes(dosesPerVial, dosesAdministered);
        var probability = self.calculateBinomialDistribution(dosesAdministered, dosesPerYear, generalProbability);
        var expectedSessions = self.calculateExpectedSessions(probability, sessionsPerWeek);
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
    
  })  
  .controller('MainCtrl', function($scope, Calculations) {

      $scope.data = {mainDataSet: []};
      $scope.dosesPerYear = 1456;
      $scope.sessionsPerWeek = 4;
      $scope.dosesPerVial= 10;
      
      $scope.expectedSessionsOptions = {
        series: [
          {
            axis: "y",
            dataset: "mainDataSet",
            key: "expectedSessions",
            label: "Number of doses administered per session",
            color: "red",
            type: ['line', 'dot'],
            id: 'expectedSessionsOptions'
          }
        ],
        axes: {
            x: {key: 'dosesAdministered'},
            y: {
                key: 'wastageRate',
                min: 0, 
                //max: 40,
            }
         }
      };
      
      $scope.wastageRateOptions = {
        series: [
          {
            axis: "y",
            dataset: "mainDataSet",
            key: "wastageRate",
            label: "Number of doses administered per session",
            color: "blue",
            type: ['line', 'dot'],
            id: 'wastageRateOptions'
          }
        ],
        axes: {
            x: {key: 'dosesAdministered'},
            y: {
                key: 'wastageRate',
                min: 0, 
                max: 1.0,
                tickFormat: function(tick) {
                    return '' + (tick * 100) + '%';
                }
            }
         }
      };
      
      //function getHighest
      $scope.reCalculate = function() {
        $scope.data.mainDataSet = Calculations.getDataSet(
          $scope.dosesPerYear, $scope.sessionsPerWeek, $scope.dosesPerVial);
        $scope.expectedSessionsOptions.axes.y.max = 42;
      };
      $scope.$watch('dosesPerYear', $scope.reCalculate);
      $scope.$watch('sessionsPerWeek', $scope.reCalculate);
      $scope.$watch('dosesPerVial', $scope.reCalculate);
      
      $scope.reCalculate();
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