
app.service('MyMaths', function(){
  var self = this;
  
  self.getSmallestIndexGreaterThan = function(items, val){
    var smallest = null;
    for (var i=0; i < items.length; i++) {
      if (items[i] > val) {
        smallest = i;
        break;
      }
    }
    return smallest;
  };
  
});
