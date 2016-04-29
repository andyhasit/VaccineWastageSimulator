
describe('MyMaths', function() {

  var MyMaths;
  
  beforeEach(module('app'));
  
  beforeEach(inject(function(_$rootScope_, _MyMaths_) {
    $rootScope = _$rootScope_;
    MyMaths = _MyMaths_;
  }));

  it('getSmallestIndexGreaterThan', function() {
    var items = [0.23, 0.34, 0.56, 0.45];
    expect(MyMaths.getSmallestIndexGreaterThan(items, 0.5)).toEqual(2);
    expect(MyMaths.getSmallestIndexGreaterThan(items, 35)).toEqual(null);
    expect(MyMaths.getSmallestIndexGreaterThan(items, 0.005)).toEqual(0);
  });
  
  
});