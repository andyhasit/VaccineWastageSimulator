




app.controller("SessionSizeProbabilityChartCtrl", function ($scope, Model) {
  /*$scope.series = ['A'];
  $scope.labels = [2,3,4,5,6];
  $scope.data =  [2,3,4,5,6];
  
  $scope.labels = Model.dosesAdministeredArray;
  $scope.data = Model.probabilityArray;
  c.log(Model.dosesAdministeredArray);
  c.log(Model.probabilityArray);
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  
  var data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40],
        }
    ]
};

chart-options="options"


  */
  
 
  $scope.labels = Model.dosesAdministeredArray;  
  $scope.data = [Model.probabilityArray.map(function(i){return i *100}), ];
  $scope.options = {
    scales: {
      xAxes: [
        {
          ticks: {
            maxRotation:0,
            callback: function(value) {
              var newValue = ((value % 2) == 0) ? value : '';
              return newValue; 
            }
          }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'probability'
        },
        ticks: {
            callback: function(value) {
              return value + '%'; 
            }
          }
      }]
    }
  };
  
  
  
});