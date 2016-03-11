
app.service('ChartService', function(Calculations) {
  var self = this;
  self.googleChartsLoaded = false;
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(function(){
    self.googleChartsLoaded = true;
    self.reDrawCharts();
  });
  
  function range(count) {
    return Array.apply(null, Array(count)).map(function (_, i) {return i;});
  };
  
  function initiateCharts() {
    angular.forEach(['expectedTurnoutChart', 'wastageRateChart'], function(chartName) {
      var div = document.getElementById(chartName);
      self[chartName] = new google.visualization.LineChart(div);
    });
    self.expectedTurnoutChartOptions = {};
    self.wastageRateChartOptions = {};
    self.defaultOptions = {
      chartArea: {
        width: 260,
        left: 50
      },
      width: 320,
      height: 200,
      lineWidth: 1,
      pointSize: 4,
      curveType: 'none',
      legend: { position: 'none' },
      vAxis: {
      },
      hAxis: {
        title: 'Doses administered per session',
        ticks: range(21),
        slantedText: false,
        maxAlternation: 1
      }
    };
    configureExpectedTurnoutChart();
    configureWastageRateChart();
  }
  
  function configureWastageRateChart() {
    var extraOptions = {
      title: 'Wastage rate',
      series: {
        0: {color: 'red'},
      },
      vAxis: {
        title: 'Wastage rate',
        format: 'percent'
      },
    };
    angular.merge(self.wastageRateChartOptions, self.defaultOptions, extraOptions);
  }
  
  function configureExpectedTurnoutChart() {
    var extraOptions = {
      title: 'Session size probability',
      series: {
        0: {color: '#3366CC'},
      },
      vAxis: {
        title: 'probability',
        format: 'percent'
      }
    };
    angular.merge(self.expectedTurnoutChartOptions, self.defaultOptions, extraOptions);
  }
  
  function drawWastageChart(data) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('number', 'Doses Per Session');
    dataTable.addColumn('number', 'Wastage Rate');
    dataTable.addRows(data.map(function(entry) { 
      return [entry.dosesAdministered, entry.wastageRate]
    }));
    self.wastageRateChart.draw(dataTable, self.wastageRateChartOptions);
  }
  
  function drawExpectedTurnoutChart(data) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('number', 'Doses Per Session');
    dataTable.addColumn('number', 'probability');
    dataTable.addRows(data.map(function(entry) { 
      return [entry.dosesAdministered, entry.probability]
    }));
    self.expectedTurnoutChart.draw(dataTable, self.expectedTurnoutChartOptions);
  }
  
  self.reDrawCharts = function() {
    if (self.googleChartsLoaded){
      initiateCharts();
      var dataSet = Calculations.getDataSet();
      drawExpectedTurnoutChart(dataSet);
      drawWastageChart(dataSet);
    } else {
       c.log("Google charts not loaded");
    }
  }
  
});