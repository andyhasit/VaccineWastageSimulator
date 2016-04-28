
app.constant('Pages', [
    {sref: 'home', name: 'Home', controller: 'DefaultCtrl'},
    {sref: 'calculate_wastage', name: 'Calculate Wastage', controller: 'CalculateWastageCtrl'},
    {sref: 'monitor_wastage', name: 'Monitor Wastage', controller: 'MonitorWastageCtrl'},
    {sref: 'help', name: 'Help', controller: 'DefaultCtrl'},
    
]);

app.controller('DefaultCtrl', function($scope, Pages) {
    $scope.pages = Pages; //Navigation.pages;
});
