var BitSet = require("../dist/bitset");

describe('An empty BitSet', function() {
    var bs = new BitSet();

    describe('#length()', function() {
        it('should return 0', function() {
            bs.length().should.eql(0);
        });
    });

    describe('#wordLength()', function() {
        it('should return 0', function() {
            bs.wordLength().should.eql(0);
        });
    });

    describe('#bitsPerWord', function() {
        it('should be 32', function() {
            bs.bitsPerWord.should.eql(32);
        });
    });

    describe('#toBinaryString()', function() {
        var binStr = bs.toBinaryString();
        it('should have length of 32', function() {
            binStr.length.should.eql(32);
        });
        it('should be equal to 00000000000000000000000000000000', function() {
            binStr.should.eql('00000000000000000000000000000000');
        });
    });

    describe('#toHexString()', function() {
        var hexStr = bs.toHexString();
        it('should have a length of 8', function() {
            hexStr.length.should.eql(8);
        });
        it('should be equal to 00000000', function() {
            hexStr.should.eql('00000000');
        });
    });

    describe('#toString()', function() {
        it('should be {}', function() {
            bs.toString().should.eql('{}');
        });
    });
});

describe('BitSet with bit 1 set', function() {
    var bs = new BitSet();
    bs.set(1);

    describe('#length()', function() {
        it('should return 2', function() {
            bs.length().should.eql(2);
        });
    });

    describe('#wordLength()', function() {
        it('should return 1', function() {
            bs.wordLength().should.eql(1);
        });
    });

    describe('#cardinality()', function() {
        it('should return 1', function() {
            bs.cardinality().should.eql(1);
        });
    });

    describe('#get()', function() {
        it('should return true for bit 1', function() {
            bs.get(1).should.eql(true);
        });

        it('should return false for other bits', function() {
            for( var i = 0; i < 32; i++ ) {
                if( i == 1 ) {
                    continue;
                }

                bs.get(i).should.eql(false);
            }
        });
    });

    describe('#bitsPerWord', function() {
        it('should be 32', function() {
            bs.bitsPerWord.should.eql(32);
        });
    });

    describe('#toBinaryString()', function() {
        var binStr = bs.toBinaryString();
        it('should have length of 32', function() {
            binStr.length.should.eql(32);
        });
        it('should be equal to 00000000000000000000000000000010', function() {
            binStr.should.eql('00000000000000000000000000000010');
        });
    });

    describe('#toHexString()', function() {
        var hexStr = bs.toHexString();
        it('should have a length of 8', function() {
            hexStr.length.should.eql(8);
        });
        it('should be equal to 00000002', function() {
            hexStr.should.eql('00000002');
        });
    });

    describe('#toString()', function() {
        it('should be {1}', function() {
            bs.toString().should.eql('{1}');
        });
    });
});

describe('BitSet with bit 1 set and cleared', function() {
    var bs = new BitSet();
    bs.set(1);
    bs.clear(1);

    describe('#length()', function() {
        it('should return 0', function() {
            bs.length().should.eql(0);
        });
    });

    describe('#wordLength()', function() {
        it('should return 0', function() {
            bs.wordLength().should.eql(0);
        });
    });

    describe('#cardinality()', function() {
        it('should return 0', function() {
            bs.cardinality().should.eql(0);
        });
    });

    describe('#get()', function() {
        it('should return false for bit 1', function() {
            bs.get(1).should.equal(false);
        });
        it('should return false for other bits in the first word', function() {
            for( var i = 0; i < bs.bitsPerWord; i++ ) {
                if( i === 1 ) continue;
                bs.get(i).should.equal(false);
            }
        });
        it('should return false for bits in the second word', function() {
            for( var i = bs.bitsPerWord; i < bs.bitsPerWord * 2; i++ ) {
                bs.get(i).should.equal(false);
            }
        });
    });

    describe('#toHexString()', function() {
        var hexStr = bs.toHexString();
        it('should have a length of 8', function () {
            hexStr.length.should.eql(8);
        });
        it('should be equal to 00000000', function() {
            hexStr.should.eql('00000000');
        });
    });

    describe('#toString()', function() {
        var str = bs.toString();
        it('should be equal to {}', function() {
            str.should.eql('{}');
        });
    });
});

describe('BitSet with bit 0 and 32 set', function() {
    var bs = new BitSet();
    bs.set(0);
    bs.set(32);

    describe('#length()', function() {
        it('should return 33', function() {
            bs.length().should.eql(33);
        });
    });

    describe('#wordLength()', function() {
        it('should return 2', function() {
            bs.wordLength().should.eql(2);
        });
    });

    describe('#cardinality()', function() {
        it('should return 2', function() {
            bs.cardinality().should.eql(2);
        });
    });

    describe('#get()', function() {
        it('should return true for bit 1', function() {
            bs.get(0).should.equal(true);
        });
        it('should return true for bit 32', function() {
            bs.get(32).should.equal(true);
        });
        it('should return false for other bits in [0, 64)', function() {
            for( var i = 0; i < 64; i++ ) {
                if( i === 0 || i === 32 ) {
                    continue;
                }

                bs.get(i).should.equal(false);
            }
        });
    });

    describe('#toHexString()', function() {
        var hexStr = bs.toHexString();
        it('should have a length of 16', function() {
            hexStr.length.should.equal(16);
        });
        it('should be equal to 0000000100000001', function() {
            hexStr.should.eql('0000000100000001');
        });
    });

    describe('#toString()', function()  {
        var str = bs.toString();
        it('should be equal to {0,32}', function() {
            str.should.eql('{0,32}');
        });
    });
});