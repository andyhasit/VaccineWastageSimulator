var c = console;

angular
  .module('app', ['ui.router', 'ui.bootstrap'])
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
    
    self.getDataTable = function(dosesPerYear, sessionsPerWeek, dosesPerVial) {
      var data = [['dosesAdministered', 'dosesWasted', 'probability', 'expectedSessions', 'wastageRate']];
      var generalProbability = 1 / (52 * sessionsPerWeek);
      for (var i=0; i < 21; i++) {
        var dosesAdministered = i;
        var dosesWasted = self.calculateVaccinesWastes(dosesPerVial, dosesAdministered);
        var probability = self.calculateBinomialDistribution(dosesAdministered, dosesPerYear, generalProbability);
        var expectedSessions = self.calculateExpectedSessions(probability, sessionsPerWeek);
        var wastageRate = self.calculateWastageRate(dosesAdministered, dosesWasted);
        data.push([dosesAdministered, safeNum(dosesWasted), safeNum(probability), 
            safeNum(expectedSessions), safeNum(wastageRate)]);
      }
      return data;
    };
    
    
    
  })  
  .controller('MainCtrl', function($scope, Calculations) {

      $scope.wastagePercentage = 0;
      $scope.data = {mainDataSet: []};
      $scope.dosesPerYear = 1456;
      $scope.sessionsPerWeek = 4;
      $scope.dosesPerVial= 10;
      
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(defineCharts);
      
      function range(count) {
        return Array.apply(null, Array(count)).map(function (_, i) {return i;});
      };
      
      function defineCharts() {        
        angular.forEach(['expectedTurnoutChart', 'wastageRateChart'], function(chartName) {
          $scope[chartName] = new google.visualization.LineChart(document.getElementById(chartName));
        });
        $scope.expectedTurnoutChartOptions = {};
        $scope.wastageRateChartOptions = {};
        $scope.defaultOptions = {
          vAxis: {
          },
          hAxis: {
            title: 'Doses administered per session',
            ticks: range(21)
          },
          pointSize : 3,
          curveType: 'none',
          legend: { position: 'none' }
        };
        configureExpectedTurnoutChart();
        configureWastageRateChart();
        reDrawCharts();
      }
      
      function configureWastageRateChart() {
        var extraOptions = {
          title: 'Expected # of sessions',
          vAxis: {
            title: 'Expected # of sessions'
          },
          hAxis: {
            color: 'red'
          },
          curveType: 'none',
          legend: { position: 'none' }
        };
        angular.merge($scope.wastageRateChartOptions, $scope.defaultOptions, extraOptions);
      }
      
      function configureExpectedTurnoutChart() {
        var extraOptions = {
          title: 'Expected # of sessions',
          vAxis: {
            title: 'Expected # of sessions'
          },
          hAxis: {
            color: 'red'
          },
          curveType: 'none',
          legend: { position: 'none' }
        };
        angular.merge($scope.expectedTurnoutChartOptions, $scope.defaultOptions, extraOptions);
      }
      
      function drawWastageChart(data) {
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn('number', 'Doses Per Session');
        dataTable.addColumn('number', 'Wastage Rate');
        dataTable.addRows(data.map(function(entry) { 
          return [entry.dosesAdministered, entry.wastageRate]
        }));
        
        c.log($scope.wastageRateChartOptions); 
        $scope.wastageRateChart.draw(dataTable, $scope.wastageRateChartOptions);
      }
      
      function drawExpectedTurnoutChart(data) {
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn('number', 'Doses Per Session');
        dataTable.addColumn('number', 'expected # of Sessions');
        dataTable.addRows(data.map(function(entry) { 
          return [entry.dosesAdministered, entry.expectedSessions]
        }));
        
        c.log($scope.expectedTurnoutChartOptions); 
        $scope.expectedTurnoutChart.draw(dataTable, $scope.expectedTurnoutChartOptions);
      }
      
      function reDrawCharts() {
        var dataSet = Calculations.getDataSet($scope.dosesPerYear, $scope.sessionsPerWeek, $scope.dosesPerVial);
        drawExpectedTurnoutChart(dataSet);
        drawWastageChart(dataSet);
      }
      
      //function getHighest
      $scope.reCalculate = function() {
        $scope.dataReady = false;
        var dataSet = Calculations.getDataSet(
          $scope.dosesPerYear, $scope.sessionsPerWeek, $scope.dosesPerVial);
        $scope.data.mainDataSet = dataSet;
        var highest = Calculations.getHighestVal(dataSet, 'expectedSessions');
        highest = parseInt(highest) + 1;
        increment = (highest> 80)? 10 : 5;
        while (highest % increment !== 0) {
          highest++;
        }
        $scope.expectedSessionsOptions.axes.y.max = highest;
        $scope.dataReady = true;
      };
      $scope.$watch('dosesPerYear', $scope.reDrawCharts);
      $scope.$watch('sessionsPerWeek', $scope.reDrawCharts);
      $scope.$watch('dosesPerVial', $scope.reDrawCharts);
      
      //$scope.reDrawCharts();
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