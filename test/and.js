var BitSet = require('../dist/bitset');

describe('BitSet A with bit 0 set AND-ed with BitSet B with bit 32 set', function () {
	var bsa = new BitSet();
	bsa.set(0);

	var bsb = new BitSet();
	bsb.set(32);

	bsa.and(bsb);

	describe('BitSet A', function() {
		describe('#length()', function() {
			it('should return 0', function() {
				bsa.length().should.equal(0);
			});
		});

		describe('#wordLength()', function() {
			it('should return 0', function() {
				bsa.wordLength().should.equal(0);
			});
		});
		describe('#cardinality()', function() {
			it('should return 0', function() {
				bsa.cardinality().should.equal(0);
			});
		});
		describe('#get()', function() {
			it('should return false for bit 0', function() {
				bsa.get(0).should.equal(false);
			});
			it('should return false for bit 32', function() {
				bsa.get(32).should.equal(false);
			});
			it('should return false for other bits in [0, 64)', function() {
				for( var i = 0; i < 64; i++ ) {
					if( i === 0 || i === 32 ) {
						continue;
					}

					bsa.get(i).should.equal(false);
				}
			});
		});
		describe('#toString()', function() {
			it('should be equal to {}', function() {
				bsa.toString().should.eql('{}');
			})
		});

	});

	describe('BitSet B', function() {
		describe('#cardinality()', function() {
			it('should return 1', function() {
				bsb.cardinality().should.equal(1);
			});
		})

		describe('#get()', function() {
			it('should return true for bit 32', function() {
				bsb.get(32).should.equal(true);
			});
			it('should return false for bit 0', function() {
				bsb.get(0).should.equal(false);
			});
			it('should return false for other bits in [0, 64)', function() {
				for( var i = 0; i < 64; i++ ) {
					if( i === 0 || i === 32 ) {
						continue;
					}

					bsb.get(i).should.equal(false);
				}
			});
		});

		describe('#toString()', function() {
			it('should be equal to {32}', function() {
				bsb.toString().should.eql('{32}');
			})
		});
	});
});