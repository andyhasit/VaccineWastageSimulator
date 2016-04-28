

app.service('Navigation', function() {
   
   this.pages = [
       {sref: 'help', name: 'Help', controller: 'DefaultCtrl'},
       {sref: 'calculate_wastage', name: 'Calculate Wastage', controller: 'CalculateWastageCtrl'},
       //{sref: 'monitor_wastage', name: 'Calculate Wastage', controller: 'MonitorWastageCtrl'},
   ];
   
});

app.controller('DefaultCtrl', function($scope, Navigation) {
   
   $scope.pages = Navigation.pages;
});
