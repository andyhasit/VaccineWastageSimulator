

app.controller("SessionSizeProbabilityChartCtrl", function ($scope, Model) {
 
  $scope.labels = Model.dosesAdministeredArray;  
  $scope.data = [Model.probabilityArray.map(function(i){return i *100}), ];
  //$scope.data = data;
  $scope.colors = [{
    pointBackgroundColor: 'rgb(51, 102, 204)',
    pointHoverBorderColor: 'rgb(51, 102, 204)',
    borderColor: 'rgb(51, 102, 204)',
    backgroundColor: '#fff', //not needed as fill: false, just to show.
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
          labelString: 'probability',
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