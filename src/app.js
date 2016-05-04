var c = console;

app = angular.module('app', ['ui.router', 'ui.bootstrap', 'chart.js']);
  
app.config(function($stateProvider, $urlRouterProvider, ChartJsProvider, Pages) {
  $urlRouterProvider.otherwise('/home');
   
  ChartJsProvider.setOptions({
    elements: {
      line: { 
        borderWidth: 1,
      },
    },
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
  });
   
  angular.forEach(Pages, function(page) {
    $stateProvider.state(page.sref, {
      url: '/' + page.sref,
      templateUrl: './' + page.sref + '.html',
      controller: page.controller
    })
  })
});

