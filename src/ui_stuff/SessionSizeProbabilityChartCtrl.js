

app.controller("SessionSizeProbabilityChartCtrl", function ($scope, Model) {
  
  $scope.labels = Model.charts.sessionSizeProbability.labels;  
  $scope.data = Model.charts.sessionSizeProbability.data;
  
  $scope.title = 'Session size probability';
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
            if ($scope.labels.length > 15){
              return ((value % 2) == 0) ? value : '';
            } else {
              return value; 
            }
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