
app.service('MonitorWastageCalculations', function(){
  var self = this;
  
  /*
// Safety stock
do i = 1, 10000 // loop over 10000 supply period simulations
	C(i) = 0 // number of vials consumed in this supply period simulation
	do j = 1, Nss // loop over sessions in the supply period
		generate a random real number in the range [0, 1]; r
		# doses administered = smallest k for which C(k) > r; a
		# doses wasted = V – mod(a, V); w
		# vials consumed = (a + w) / V ; c
		C(i) = C(i) + c
	enddo
enddo
*/

  self.f1 = function() { //? Name for this function?
      
    var sessionsInSupplyPeriod = x; //? how do I get this?
    var runs = 10000; // loop over 10000 supply period simulations
    for (var i=1; i <= runs; i++) {
      var vialsConsumedInPeriod = 0;
      
      for (var j=0; j <= sessionsInSupplyPeriod; j++) {
        var randomNumb = Math.random();
        var dosesAdministered = x; //? smallest k for which C(k) > r; a
        var dosesWasted = x; //?  V – mod(a, V); w    ---   what is V?
        var vialsConsumed = dosesAdministered + dosesWasted / v; //(a + w) / V ; c
        vialsConsumedInPeriod += vialsConsumed;
      }
    }
  }
/*

do i = 0, 100
	N(i)=0 // number of supply periods in which i vials are consumed
	do j = 1, 10000
		If ( C(j) = i ) N(i) = N(i) + 1
	enddo
  
	Pr(i) = N(i) / 10000 // probability of getting i vials consumed in a supply period (chart this)
	if (i = 0) then
    CuPr(i) = Pr(i)
	else
		CuPr(i) = CuPr(i-1) + Pr(i)
	endif
enddo
99% upper limit = smallest i for which CuPr(i) is greater than 0.99
expected consumption = average of C(i) for I = 1, 10000
safety stock = roundup(  99% upper limit – expected consumption)

*/

  self.f2 = function() { //? Name for this function?
    var runs = 10000;
    var maxVialsUsed = 100;
    for (var i=0; i <= maxVialsUsed; i++) {
      var vialsUsedInPeriod = i;
      var supplyPeriodsWhereXvialsUsed = 0;
      for (var j=1; j <= runs; j++) {
        if () { // ? If ( C(j) = i ) N(i) = N(i) + 1
          supplyPeriodsWhereXvialsUsed += 1;
        }
      }
      var probabilityOfUsingXvialsInPeriod = supplyPeriodsWhereXvialsUsed / runs;
      if (i == 0) {
        //CuPr(i) = Pr(i) //? cumulative?
        var cu = probability;
      } else {
        //CuPr(i) = CuPr(i-1) + Pr(i)
        var cu = (cu - 1) + probability; //? is this right, or do I need previous?
      }
    }
  }



});