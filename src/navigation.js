
app.constant('Pages', [
    {sref: 'home', name: 'Home', controller: 'DefaultCtrl'},
    {sref: 'calculate_wastage', name: 'Calculate Wastage', controller: 'CalculateWastageCtrl'},
    {sref: 'forecast_need', name: 'Forecast Need', controller: 'ForecastNeedCtrl'},
    {sref: 'monitor_wastage', name: 'Monitor Wastage', controller: 'MonitorWastageCtrl'},
    {sref: 'safety_stock', name: 'Safety Stock', controller: 'SafetyStockCtrl'},
    {sref: 'help', name: 'Help', controller: 'DefaultCtrl'}, 
]);

app.controller('DefaultCtrl', function($scope, Pages) {
    $scope.pages = Pages;
});
