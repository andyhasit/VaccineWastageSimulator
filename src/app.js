var c = console;

app = angular.module('app', ['ui.router', 'ui.bootstrap']);
  
app.config(function($stateProvider, $urlRouterProvider, Pages) {
  $urlRouterProvider.otherwise('/home');
   
  angular.forEach(Pages, function(page) {
    $stateProvider.state(page.sref, {
      url: '/' + page.sref,
      templateUrl: './' + page.sref + '.html',
      controller: page.controller
    })
  })
});

