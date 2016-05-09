

app.controller("WastageRateProbabilityChartCtrl", function ($scope, Model) {
  
  $scope.labels = Model.charts.wastageRateProbability.labels;  
  $scope.data = Model.charts.wastageRateProbability.data;
  
  $scope.title = 'Wastage rate probability';
  $scope.colors = [{
    pointBackgroundColor: 'rgb(51, 102, 204)',
    pointHoverBorderColor: 'rgb(51, 102, 204)',
    borderColor: 'rgb(51, 102, 204)',
    fill: false, 
  }];
  
  $scope.options = {
    scales: {
      xAxes: [{
        ticks: {
          maxRotation:0,
          fontSize: 10,
          fontStyle: 'bold',
          callback: function(value) {
            var newValue = ((value % 2) == 0) ? value : '';
            return newValue; 
          }
        },
        scaleLabel: {
          display: true,
          labelString: 'Reporting period wastage rate',
          fontSize: 12,
          fontStyle: 'italic'
        },          
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Probability',
          fontSize: 12,
          fontStyle: 'italic'
        },
        ticks: {
            callback: function(value) {
              return value + '%'; 
            },
            fontSize: 10,
            fontStyle: 'bold'
          }
      }]
    }
  };
  
});