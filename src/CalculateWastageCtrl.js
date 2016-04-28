
app.controller('CalculateWastageCtrl', function($scope, ChartService, Model) {
  $scope.inputs = Model.inputs;
  
  $scope.$watch('inputs', reDrawCharts, true);
    
  function reDrawCharts() {
    Model.calculateAll();
    ChartService.reDrawCharts();
    $scope.percentWastage = Model.percentWastage;
  }
  
  reDrawCharts();
});


app.controller("LineCtrl", function ($scope, Model) {
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
  
  $scope.soptions = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        },
        ticks: {
          maxTicksLimit: 20
        }
    }
});