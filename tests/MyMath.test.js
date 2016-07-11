
describe('MyMaths', function() {

  var MyMaths;
  
  beforeEach(module('app'));
  
  beforeEach(inject(function(_$rootScope_, _MyMaths_) {
    $rootScope = _$rootScope_;
    MyMaths = _MyMaths_;
  }));
  
  
  it('findFirst', function() {
    var items = [0, 0, 0, 0.34, 0.56, 0.45, 0, 0, 0, 0, 0];
    var func = function(x) {return x > 0};
    expect(MyMaths.findFirst(items, func)).toEqual(3);
    expect(MyMaths.findFirst(items, func, true)).toEqual(5);
  });
  
  it('getSmallestIndexGreaterThan', function() {
    var items = [0.23, 0.34, 0.56, 0.75];
    expect(MyMaths.getSmallestIndexGreaterThan(items, 0.5)).toEqual(2);
    expect(MyMaths.getSmallestIndexGreaterThan(items, 35)).toEqual(null);
    expect(MyMaths.getSmallestIndexGreaterThan(items, 0.005)).toEqual(0);
  });
  
  it('getLargestIndexSmallerThan', function() {
    var items = [0.23, 0.34, 0.56, 0.75];
    expect(MyMaths.getLargestIndexSmallerThan(items, 0.5)).toEqual(1);
    expect(MyMaths.getLargestIndexSmallerThan(items, 35)).toEqual(null);
    expect(MyMaths.getLargestIndexSmallerThan(items, 0.005)).toEqual(0);
  });
  
  it('shortenedFactorial', function() {
    expect(MyMaths.shortenedFactorial(5, 2)).toEqual(20);
    expect(MyMaths.shortenedFactorial(5, 1)).toEqual(5);
    expect(MyMaths.shortenedFactorial(100, 2)).toEqual(9900);
  });
  
  it('binomialDistribution', function() {
    var probability = 0.004807692;
    var dosesPerYear = 1456;
    expect(MyMaths.binomialDistribution(1, dosesPerYear, probability)).toBeCloseTo(0.006306644, 5);
    expect(MyMaths.binomialDistribution(2, dosesPerYear, probability)).toBeCloseTo(0.022164654, 5);
    expect(MyMaths.binomialDistribution(5, dosesPerYear, probability)).toBeCloseTo(0.12776012, 5);
    expect(MyMaths.binomialDistribution(12, dosesPerYear, probability)).toBeCloseTo(0.026231565, 5);
  });
});