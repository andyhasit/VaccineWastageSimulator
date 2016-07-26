

app.service('ChartData', function(Model, MyMaths){
  var self = this;
  
  self.rebuild = function() {
    rebuildSessionSizeProbabilityChart();
    rebuildWastageRateByTurnoutChart();
    rebuildConsumptionInSupplyPeriodProbabilityChart();
    rebuildWastageRateProbabilityChart();
  }
  
  function rebuildSessionSizeProbabilityChart() {
    var chart = Model.charts.sessionSizeProbability;
    var labels = [];
    var data = [];
    var probabilityArray = Model.perSessionTurnoutData.probabilityArray;
    var startIndex = MyMaths.findFirst(probabilityArray, function(x) {return x > 0.0005}) - 2;
    var endIndex = MyMaths.findFirst(probabilityArray, function(x) {return x > 0.0005}, true) + 2;
    startIndex = startIndex < 0 ? 0 : startIndex; 
    var max =  Model.inputs.sessionTurnoutsToCount;
    endIndex = endIndex > max ? max: endIndex;
    for (var i=startIndex; i<=endIndex; i++) {
      labels.push(i);
      var probability = probabilityArray[i];
      data.push(probability*100);
    }
    angular.copy(labels, chart.labels);
    chart.data[0] = data;
  }
  
  function rebuildWastageRateByTurnoutChart() {
    var chart = Model.charts.wastageRateByTurnout;
    var labels = [];
    var data = [];
    var values = Model.perSessionTurnoutData.wastageRateArray;
    var startIndex = 0;
    var endIndex = 20;
  
    for (var i=startIndex; i<=endIndex; i++) {
      labels.push(i);
      data.push(values[i]*100);
    }
    angular.copy(labels, chart.labels);
    chart.data[0] = data;
  }
  
  function rebuildConsumptionInSupplyPeriodProbabilityChart() {
    var chart = Model.charts.consumptionInSupplyPeriodProbability;
    var labels = [];
    var data = [];
    var probabilityArray = Model.perNumberOfVialsConsumedInSupplyPeriodData.probability;
    var startIndex = MyMaths.findFirst(probabilityArray, function(x) {return x > 0}) - 2;
    var endIndex = MyMaths.findFirst(probabilityArray, function(x) {return x > 0}, true) + 2;
    
    startIndex = startIndex < 0 ? 0 : startIndex;
    
    for (var i=startIndex; i<=endIndex; i++) {
      var vialsUsedInPeriod = i;
      var probability = probabilityArray[i];
      labels.push(vialsUsedInPeriod);
      data.push(probability*100);
    }
    angular.copy(labels, chart.labels);
    chart.data[0] = data;
  }

  function rebuildWastageRateProbabilityChart() {
    var chart = Model.charts.wastageRateProbability;
    var labels = [];
    var data = [];
    var probabilityArray = Model.perReportingPeriodWastageData.probability;
    var startIndex = MyMaths.findFirst(probabilityArray, function(x) {return x > 0});
    var endIndex = MyMaths.findFirst(probabilityArray, function(x) {return x > 0}, true);
    
    for (var i=startIndex; i<=endIndex; i++) {
      var wastageRate = i;// - 0.5;
      var probability = probabilityArray[i];
      labels.push(wastageRate);
      data.push(probability*100);
    }
    angular.copy(labels, chart.labels);
    chart.data[0] = data;
  }
  
});
