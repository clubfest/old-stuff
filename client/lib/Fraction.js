
// all methods are immutable
// every public method should return a reduced fraction
Fraction = {
  create: function(numer, denom){
    if (denom === 0) throw new Error('Denominator cannot be 0');

    var ret = {};
    if (numer) {
      ret.numer = numer;
    } else {
      ret.numer = 0;
    }

    if (denom) {
      ret.denom = denom;
    } else {
      ret.denom = 1;
    }
    return Fraction.reduce(ret);
  },
  getNumerator: function(frac1){
    return frac1.numer;
  },
  getDenominator: function(frac1){
    return frac1.denom;
  },
  negate: function(frac1) {
    return this.create(-this.getNumerator(frac1), this.getDenominator(frac1));
  },
  invert: function(frac1){
    if (this.getNumerator(frac1) === 0) throw new Error('Numerator cannot be 0 when inverting.');
    return this.create(this.getDenominator(frac1), this.getNumerator(frac1));
  },
  plus: function(frac1, frac2) {
    var numer = this.getNumerator(frac1) * this.getDenominator(frac2) + this.getNumerator(frac2) * this.getDenominator(frac1);
    var denom = this.getDenominator(frac2) * this.getDenominator(frac1);
    var ret = this.create(numer, denom);
    return ret;
  },
  times: function(frac1, frac2) {
    var numer = frac1.numer * frac2.numer;
    var denom = frac1.denom * frac2.denom;
    var ret = this.create(numer, denom);
    return ret;
  },
  minus: function(frac1, frac2){
    return this.plus(frac1, this.negate(frac2));
  },
  dividedBy: function(frac1, frac2){
    return this.times(frac1, this.invert(frac2));
  },
  floor: function(frac1) {
    var numer = this.getNumerator(frac1);
    var denom = this.getDenominator(frac1);

    var isNegative = true;
    if (numer >= 0 && denom > 0 || numer <= 0 && denom < 0) {
      isNegative = false;
    }

    numer = Math.abs(numer);
    denom = Math.abs(denom);

    var change = numer % denom;
    if (change === 0) {
      return this.create(numer, denom);
    } else {
      numer -= change;
      if (isNegative) {
        numer = -numer - denom;
      }
      return this.create(numer, denom);
    }
  },
  reduce: function(frac1){
    var numer = this.getNumerator(frac1);
    var denom = this.getDenominator(frac1);
    var divisor = gcd(numer, denom);
    numer /= divisor;
    denom /= divisor;
    return {numer: numer, denom: denom};
  },
  toFloat: function(frac1){
    return this.getNumerator(frac1) / this.getDenominator(frac1);
  },
  greaterThan: function(frac1, frac2){
    return this.toFloat(frac1) > this.toFloat(frac2); 
  },
  equal: function(frac1, frac2) {
    return this.toFloat(frac1) === this.toFloat(frac2);
  },
  gte: function(frac1, frac2){
    return this.greaterThan(frac1, frac2) || this.equal(frac1, frac2); 
  },
}


function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (a > 0 && b > 0) {
    if (b >= a) {
      b = b % a;
    } else {
      a = a % b;
    }
  }
  return Math.max(a, b);

  // return b ? gcd(b, a % b) : a;
}

function testFraction(){
  var f1 = new Fraction(1, 2);
  var f2 = new Fraction(1, 4);
  var f3 = new Fraction(0, 2);
  var f4 = new Fraction(2, 6);
  var f5 = f1.plus(f2);
  if (f5.getNumerator() !== 3 || f5.getDenominator() !== 4) {
    console.log('plus is broken.');
  }
  if (f5.toFloat() !== 0.75 ) {
    console.log('toFloat is broken.');
  }
  var f6 = f1.minus(f2);
  if (f6.getNumerator() !== 1 || f6.getDenominator() !== 4) {
    console.log('minus is broken.');
  }
  var f7 = f3.times(f4);
  if (f7.getNumerator() !== 0 || f7.getDenominator() !== 1) {
    console.log('times is broken.');
  }
  var f8 = f4.dividedBy(f1);
  if (f8.getNumerator() !== 2 || f8.getDenominator() !== 3) {
    console.log('dividedBy is broken');
  }
}