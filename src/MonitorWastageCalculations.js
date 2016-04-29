app.service('MonitorWastageCalculations', function(){
    var self = this;
 
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
    self.f1 = function() { //? Name for this function?
    
      var sessionsInReportingPeriod = x; //? how do I get this?
      var runs = 10000; // loop over 10000 reporting period simulations
      for (var i=1; i <= runs; i++) {
        var vialsWasted = 0;
        var vialsConsumed = 0;
        
        for (var j=0; j <= sessionsInReportingPeriod; j++) {
          var randomNumb = Math.random();
          var dosesAdministered = x; //? smallest k for which C(k) > r; a
          var dosesWasted = x; //? what is V?
          var dosesConsumed = dosesAdministered + dosesWasted;
          vialsWasted += dosesWasted;
          vialsConsumed += dosesConsumed;
        }
        var wr = vialsWasted / vialsConsumed; //? What do I do with this? Risk of DivByZero?
      }
    }
    
/*
do i = 1, 1000
	x_low(i) = (i-1)/10 // wastage rate bin lower limit
	x_high(i) = i/10 // wastage rate bin higher limit
  N(i)=0 // number of reporting periods in which the wastage rate is in the ith bin 
	do j = 1, 10000
		If ( WR(j) > x_low(i) .AND. WR(j) <= x_high(i) ) N(i) = N(i) + 1
	enddo
	Pr(i) = N(i) / 10000 // probability of getting a wastage rate in the ith bin in a reporting period 
    (chart this)
	if (i = 1) then
      CuPr(i) = Pr(i)
	else
      CuPr(i) = CuPr(i-1) + Pr(i)
	endif
enddo

minimum wastage rate = largest i for which CuPr(i) is less than 0.01
maximum wastage rate = smallest i for which CuPr(i) is greater than 0.99

*/

    self.f2 = function() { //? Name for this function?
    
      var sessionsInReportingPeriod = x; //? how do I get this?
      var runs = 1000; // does this need to be same as runs above?
      for (var i=1; i<=runs+1; i++) {
        var lowLimit = (i - 1) / 10;
        var highLimit = i / 10;
        var count = 0; // number of reporting periods in which the wastage rate is in the ith bin 
        for (var j=0; j <= 10000; j++) {
          if () { //? what's this?
            count += 1;
          }
        }
        var probability = count / 10000; // probability of getting a wastage rate in the ith bin in a reporting period 
        if (i == 1) {
          //CuPr(i) = Pr(i) //? cumulative?
          var cu = probability;
        } else {
          //CuPr(i) = CuPr(i-1) + Pr(i)
          var cu = (cu - 1) + probability; //? is this right, or do I need previous?
        }
      }
    }
    
});