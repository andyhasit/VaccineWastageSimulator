
describe('Calculations', function() {

  var Calculations;
  
  beforeEach(module('app'));
  
  beforeEach(inject(function(_$rootScope_, _Calculations_) {
    $rootScope = _$rootScope_;
    Calculations = _Calculations_;
  }));

  it('calculateVaccinesWastes', function() {
    expect(Calculations.calculateVaccinesWastes(10, 0)).toEqual(0);
    expect(Calculations.calculateVaccinesWastes(10, 1)).toEqual(9);
    expect(Calculations.calculateVaccinesWastes(10, 2)).toEqual(8);
    expect(Calculations.calculateVaccinesWastes(10, 9)).toEqual(1);
    expect(Calculations.calculateVaccinesWastes(10, 10)).toEqual(0);
    expect(Calculations.calculateVaccinesWastes(10, 11)).toEqual(9);
    expect(Calculations.calculateVaccinesWastes(10, 14)).toEqual(6);
    expect(Calculations.calculateVaccinesWastes(4, 9)).toEqual(3);
  });
  
  it('shortenedFactorial', function() {
    expect(Calculations.shortenedFactorial(5, 2)).toEqual(20);
    expect(Calculations.shortenedFactorial(5, 1)).toEqual(5);
    expect(Calculations.shortenedFactorial(100, 2)).toEqual(9900);
  });
  
  it('calculateBinomialDistribution', function() {
    var probability = 0.004807692;
    var dosesPerYear = 1456;
    Calculations.decimalPoints = 6;
    expect(Calculations.calculateBinomialDistribution(1, dosesPerYear, probability)).toBeCloseTo(0.006306644, 5);
    expect(Calculations.calculateBinomialDistribution(2, dosesPerYear, probability)).toBeCloseTo(0.022164654, 5);
    expect(Calculations.calculateBinomialDistribution(5, dosesPerYear, probability)).toBeCloseTo(0.12776012, 5);
    expect(Calculations.calculateBinomialDistribution(12, dosesPerYear, probability)).toBeCloseTo(0.026231565, 5);
  });
  
});
