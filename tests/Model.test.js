/*
describe('Model', function() {

  var Model;
  
  beforeEach(module('app'));
  
  beforeEach(inject(function(_$rootScope_, _Model_) {
    $rootScope = _$rootScope_;
    Model = _Model_;
  }));
  
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
    //Just checking an issue with 170/171 cuttoff which cause a problem with shortenedFactorial.
    
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
*/