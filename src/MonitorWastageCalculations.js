
app.service('MonitorWastageCalculations', function(WastageCalculations){
  
  var self = this;
  
  self.setVialsConsumedInReportingPeriods = function(model) {
    
    var vialSize = Model.inputs.dosesPerVial;
    var simulationPeriods = Model.settings.simulationPeriods;
    var cumulativeProbabilities = Model.data.cumulativeProbabilities;
    var vialsConsumedInReportingPeriods = Model.data.vialsConsumedInReportingPeriods;
    var vialsWastedInReportingPeriods = Model.data.vialsWastedInReportingPeriods;
    var sessionsInReportingPeriod = WastageCalculations.maximumNumberOfSessionsPerSupplyInterval(
      model.inputs.reportingPeriod, model.inputs.sessionsPerWeek);
      
    for (var i=1; i<=simulationPeriods; i++) {
      var vialsConsumedInThisPeriod = 0;
      var vialsWastedInThisPeriod = 0;
      for (var j=0; j <= sessionsInSupplyPeriod; j++) {
        var randomNumb = Math.random();
        var dosesAdministered = MyMaths.getSmallestIndexGreaterThan(cumulativeProbabilities, randomNumb);
        var dosesWasted = vialSize - (dosesAdministered % vialSize);
        var dosesConsumed = dosesAdministered + dosesWasted;
        vialsConsumedInThisPeriod += vialsConsumed;
        vialsWastedInThisPeriod += dosesWasted;
      }
      vialsConsumedInReportingPeriods.push(vialsConsumedInThisPeriod);
      vialsWastedInReportingPeriods.push(vialsWastedInThisPeriod);
      wastageRatesInReportingPeriods.push(vialsWastedInThisPeriod / vialsConsumedInThisPeriod);
    }
    
  };
 //? Does W(i) mean a single instance or in an array?
 
/*
do i = 1, 10000 // loop over 10000 reporting period simulations
	W(i) = 0 // number of vials wasted in this reporting period simulation
	C(i) = 0 // number of vials consumed in this reporting period simulation
	do j = 1, Nsr // loop over sessions in the reporting period
		generate a random real number in the range [0, 1]; r
		# doses administered = smallest k for which C(k) > r; a
		# doses wasted = V – mod(a, V); w
		# doses consumed = a + w ; c
		W(i) = W(i) + w
    C(i) = C(i) + c
	enddo
	WR(i) = W(i) / C(i)
enddo
*/ 
    
    
});