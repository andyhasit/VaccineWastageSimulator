
describe('Calculations', function() {

  var Model, Calculations;
  
  beforeEach(module('app'));
  
  beforeEach(inject(function(_$rootScope_, _Model_, _Calculations_) {
    $rootScope = _$rootScope_;
    Calculations = _Calculations_;
    Model = _Model_;
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
  
  it('getDataSet', function() {
    Model.inputs = { 
      dosesPerYear: 1456,
      sessionsPerWeek : 4,
      dosesPerVial: 10
    };
    Model.calculateAll();
    var dataSet = Model.getDataSet();
    var entry4 = dataSet[4];
    expect(entry4.dosesAdministered).toEqual(4);
    expect(entry4.dosesWasted).toEqual(6);
    expect(entry4.probability).toBeCloseTo(0.091068681, 5);
    expect(entry4.expectedSessions).toBeCloseTo(18.94228559, 5);
    expect(entry4.wastageRate).toEqual(0.6);
    
    var entry13 = dataSet[13];
    expect(entry13.dosesAdministered).toEqual(13);
    expect(entry13.dosesWasted).toEqual(7);
    expect(entry13.probability).toBeCloseTo(0.01407595, 5);
    expect(entry13.expectedSessions).toBeCloseTo(2.927797523, 5);
    expect(entry13.wastageRate).toEqual(0.35);
  });
  
  it('getDataSet random', function() {
    /*
    Just checking an issue with 170/171 cuttoff which cause a problem with shortenedFactorial.
    */
    Model.inputs = { 
      dosesPerYear: 169,
      sessionsPerWeek : 2,
      dosesPerVial: 5
    };
    Model.calculateAll();
    var dataSet = Model.getDataSet();
    Model.inputs = { 
      dosesPerYear: 170,
      sessionsPerWeek : 2,
      dosesPerVial: 5
    };
    Model.calculateAll();
    var dataSet = Model.getDataSet();
  });
   
  
});
