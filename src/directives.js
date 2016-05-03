app.directive('dosesPerYear', function(constants) {
  return{
    restrict: 'AE',
    controller: 'SectionItemsController',
    scope: {
      section: '=section',
      type: '=type',
      items: '=items',
    },
    templateUrl: constants.templatesDir + 'section-items-template.html',
  }
});
