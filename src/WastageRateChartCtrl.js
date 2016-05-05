

app.controller("WastageRateChartCtrl", function ($scope, Model) {
 
  $scope.labels = Model.data.dosesAdministeredArray;  
  $scope.data = Model.data.wastageRateChartData;
  $scope.title = 'Wastage rate';
  $scope.colors = [{
    pointBackgroundColor: 'red',
    pointHoverBorderColor: 'red',
    borderColor: 'red',
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
          labelString: 'Doses administered per session',
          fontSize: 12,
          fontStyle: 'italic'
        },          
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Wastage rate',
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