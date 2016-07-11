var c = console;

function logTime(msg) {
  if (window.startLogTime === undefined) {
    window.startLogTime = new Date().getTime();
  } else {
    var endLogTime = new Date().getTime();
    var timeLapsed = endLogTime - window.startLogTime;
    c.log('Execution time at ' + msg + ': ' + timeLapsed);
    window.startLogTime = endLogTime;
  }
};
  
  
app = angular.module('app', ['ui.router', 'ui.bootstrap', 'chart.js']);
  
app.config(function($stateProvider, $urlRouterProvider, ChartJsProvider, Pages) {
  $urlRouterProvider.otherwise('/home');
   
  ChartJsProvider.setOptions({
    elements: {
      line: { 
        borderWidth: 1,
        tension: 0,
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
      controller: 'GenericPageCtrl' //page.controller
    })
  })
});


app.run(function($rootScope, Model) {
  $rootScope.Model = Model;
});
