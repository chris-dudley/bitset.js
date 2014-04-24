/**
 *  @overview Implementation for a JavaScript bitset.
 *  @author Christopher Dudley <chris@terainsights.com>
 *  @copyright 2014 Tera Insights, LLC.
 *  @license MIT
 *
 *  Inspired by bitset.coffee by Tom de Grunt
 *  https://github.com/tdegrunt/bitset
 */

/**
 *  A class representing a bitset.
 *  @constructor
 *
 *  @param {Object.<String, number>} - Mapping of names to positions.
 *  @param {Array.<number>=} init - Initial value of the bitset.
 */
function BitSet(names, init) {
    init = init || [];

    /**
     *  The storage of the bitset.
     *  @member {Array.<number>}
     */
    this.store = init.concat();

    /**
     *  Mapping of names to positions in the bitset.
     *  @member {Object.<String, number>}
     */
    this.names = names;
}

/**
 *  The number of bits in each word of storage.
 */
BitSet.prototype.bitsPerWord = 32;

/**
 *  The number of bits used to address a bit within each word.
 */
BitSet.prototype.addressBitsPerWord = 5;

/**
 *  Bitmask for the overall word.
 */
BitSet.prototype.wordMask = 0xFFFFFFFF;

/**
 *  Bitmask for the address of a bit within a word.
 */
BitSet.prototype.addressMask = 0x1F;

/**
 *  Returns the position of the named bit in the BitSet.
 *
 *  @param {String} name - The name of the bit.
 *  @returns {number} The bit's position in the BitSet.
 *  @throws {RangeError} The given name did not correspond to a bit in the set.
 *
 */
BitSet.prototype.bitIndex = function(name) {
    if( Object.prototype.hasOwnProperty.call(this.names, name) ) {
        return this.names[name];
    } else {
        throw new RangeError('Name ' + name + ' not a member of this BitSet');
    }
};

/**
 *  Returns the index of the word containing the bit in position `pos`.
 *
 *  @param {number|String} pos - The bit position or name.
 *  @returns {number} The index of the word containing bit `pos`.
 */
BitSet.prototype.wordIndex = function(pos) {
    if( typeof pos === 'string' ) {
        pos = this.bitIndex(pos);
    }

    return pos >> this.addressBitsPerWord;
};

/**
 *  Sets the bit at the given position.
 *
 *  @param {number|String} pos - The bit position or name.
 *  @returns {BitSet} this
 */
BitSet.prototype.set = function(pos) {
    if( typeof pos === 'string' ) {
        pos = this.bitIndex(pos);
    }
    this.store[this.wordIndex(pos)] |= (1 << (pos & this.addressMask));

    return this;
};

/**
 *  Clears the bit at the given position.
 *
 *  @param {number|String} pos - The bit position or name.
 *  @returns {BitSet} this
 */
BitSet.prototype.clear = function(pos) {
    if( typeof pos === 'string' ) {
        pos = this.bitIndex(pos);
    }
    this.store[this.wordIndex(pos)] &= (this.wordMask ^ (1 << (pos & this.addressMask)));

    return this;
};

/**
 *  Returns whether or not the bit at the given position is set.
 *
 *  @param {number|String} pos - The bit position or name.
 *  @returns {boolean} Whether the bit is set.
 */
BitSet.prototype.get = function(pos) {
    if( typeof pos === 'string' ) {
        pos = this.bitIndex(pos);
    }
    return (this.store[this.wordIndex(pos)] & (1 << (pos & this.addressMask))) !== 0;
};

/**
 *  Returns the number of words in use for this BitSet.
 *
 *  @returns {number} The number of words in used for this BitSet.
 */
BitSet.prototype.wordLength = function() {
    var length = this.store.length;
    for( var pos = length - 1; pos >= 0; pos++ ) {
        if( this.store[pos] === 0 ) {
            length--;
        } else {
            break;
        }
    }

    return length;
};

/**
 *  Returns the logical lenth of this BitSet: the index of the highest set bit
 *  plus one.
 *
 *  @returns {number} The logical bit length. 0 if no bits set.
 */
BitSet.prototype.length = function() {
    var wordLength = this.wordLength();

    if( wordLength === 0 ) {
        return 0;
    } else {
        var length = wordLength * this.bitsPerWord;

        while( ! this.get(length - 1) ) {
            length--;
        }

        return length;
    }
};

/**
 *  Returns the cardinality of the BitSet, aka the number of bits which are set.
 *
 *  @returns {number}
 */
BitSet.prototype.cardinality = function() {
    var sum = 0;
    for( var pos = 0; pos < this.length(); pos++ ) {
        if( this.get(pos) ) {
            sum++;
        }
    }

    return sum;
};

/**
 *  Performs a logical OR of this BitSet and the argument BitSet.
 *
 *  @param {BitSet} set - The BitSet to or with.
 *  @returns {BitSet} this
 */
BitSet.prototype.or = function(set) {
    if( this === set ) {
        return this;
    }

    var oWordLength = set.wordLength();
    var wordsInCommon = Math.min(this.wordLength(), oWordLength);

    for( var pos = 0; pos < wordsInCommon; pos++ ) {
        this.store[pos] |= set.store[pos];
    }

    if( wordsInCommon < oWordLength ) {
        this.store = this.store.concat(set.store.slice(wordsInCommon, oWordLength));
    }

    return this;
};

/**
 *  Performs a logical AND of this BitSet and the argument BitSet.
 *
 *  @param {BitSet} set - The BitSet to AND with.
 *  @returns {BitSet} this
 */
BitSet.prototype.and = function(set) {
    if( this === set ) {
        return this;
    }

    var pos;
    var m_wl = this.wordLength();
    var o_wl = set.wordLength();

    for( pos = m_wl; pos < o_wl; pos++ ) {
        this.store[pos] = 0;
    }

    for( pos = 0; pos < m_wl; pos++ ) {
        this.store[pos] &= set.store[pos];
    }

    return this;
};

/**
 *  Performs a logical AND NOT of this BitSet and the argument BitSet.
 *
 *  @param {BitSet} set - The BitSet to AND NOT with.
 *  @returns {BitSet} this
 */
BitSet.prototype.andNot = function(set) {
    var wCommon = Math.min(this.wordLength(), set.wordLength());

    for( var pos = 0; pos < wCommon; pos++ ) {
        this.store[pos] &= ~set.store[pos];
    }

    return this;
};

/**
 *  Performs a logical XOR of this BitSet and the argument BitSet.
 *
 *  @param {BitSet} set - The BitSet to XOR with.
 *  @returns {BitSet} this
 */
BitSet.prototype.xor = function(set) {
    if( this === set ) {
        return this;
    }

    for( var pos = 0; pos < this.wordLength(); pos++ ) {
        this.store[pos] ^= set.store[pos];
    }

    return this;
};

/**
 *  Create a copy of this BitSet.
 *
 *  @return {BitSet}
 */
BitSet.prototype.clone = function() {
    return new BitSet(this.names, this.store);
};

/**
 *  Returns a string representation of the bitset. For every bit set to true,
 *  it will include a decimal representation of the index.
 *
 *  @returns {String}
 */
BitSet.prototype.toString = function() {
    var result = [];
    for( var pos = 0; pos < this.length(); pos++ ) {
        if( this.get(pos) ) {
            result.push(pos);
        }
    }

    return '{' + result.join(',') + '}';
};

/**
 *  Returns a binary string representation of the BitSet.
 *
 *  @returns {String}
 */
BitSet.prototype.toBinaryString = function() {
    function lpad(str, padString, length) {
        while( str.length < length ) {
            str = padString + str;
        }
        return str;
    }

    var wl = this.wordLength();

    if( wl > 0 ) {
        var bin = [];
        for( var pos = 0; pos < wl; pos++ ) {
            bin.push(lpad(this.store[pos].toString(2), '0', this.bitsPerWord));
        }

        return bin.join('');
    } else {
        return lpad('', 0, this.bitsPerWord);
    }
};

/**
 * Returns a hex string representation of the BitSet.
 *
 * @returns {String}
 */
BitSet.prototype.toHexString = function() {
    function lpad(str, padString, length) {
        while( str.length < length ) {
            str = padString + str;
        }
        return str;
    }

    var hexWordLength = this.bitsPerWord / 4;
    var wl = this.wordLength();

    if( wl > 0 ) {
        var hex = [];
        for( var pos = 0; pos < wl; pos++ ) {
            hex.push(lpad(this.store[pos].toString(16), '0', hexWordLength));
        }

        return hex.join('');
    } else {
        return lpad('', 0, hexWordLength);
    }
};

///// Static Members /////

/**
 *  Constructs a new BitSet from a string representation as returned by
 *  BitSet.toString()
 *
 *  @param {Object.<String, number>} names - The named bit mapping.
 *  @param {String} str - The string to parse.
 */
BitSet.fromString = function(names, str) {
    // Remove brackets
    str = str.slice(1, str.length - 2);

    parts = str.split(',');

    var set = new BitSet(names);

    for( var i = 0; i < parts.length; i++ ) {
        var num = parseInt(parts[i], 10);
        set.set(num);
    }

    return set;
};

/**
 *  Constructs a new BitSet from a binary string.
 *
 *  @param {Object.<String, number>} names - The named bit mapping.
 *  @param {String} str - The string to parse.
 */
BitSet.fromBinaryString = function(names, str) {
    if( (str.length % 32) !== 0 ) {
        var nPad = 32 - (str.length % 32);
        while( nPad > 0 ) {
            str = '0' + str;
            nPad--;
        }
    }

    var nParts = str.length / 32;
    var init = [];

    for( var i = 0; i < nParts; i++ ) {
        var part = str.slice(32 * i, 32 * (i+1));

        init.push(parseInt(part, 2));
    }

    return new BitSet(names, init);
};

/**
 *  Constructs a new BitSet from a hex string.
 *
 *  @param {Object.<String, number>} names - The named bit mapping.
 *  @param {String} str - The string to parse.
 */
BitSet.fromHexString = function(names, str) {
    if( (str.length % 8) !== 0 ) {
        var nPad = 8 - (str.length % 8);
        while( nPad > 0 ) {
            str = '0' + str;
            nPad--;
        }
    }

    var nParts = str.length / 8;
    var init = [];

    for( var i = 0; i < nParts; i++ ) {
        var part = str.slice(8 * i, 8 * (i+1));

        init.push(parseInt(part, 16));
    }

    return new BitSet(names, init);
};

/**
 *  Creates a factory function to create new BitSets with a set of named
 *  bits.
 *
 *  @param {Object.<String, number>} names - The named bit mapping.
 *  @returns {function}
 */
BitSet.factory = function(names) {
    var ret = function() {
        var args = [names];

        // Forward other arguments
        for( var i = 0; i < arguments.length; i++ ) {
            args.push(arguments[i]);
        }

        // Create object and call constructor
        var obj = Object.create(BitSet.prototype);
        BitSet.apply(obj, args);
        return obj;
    };

    ret.fromString = function(str) {
        return BitSet.fromString(names, str);
    };

    ret.fromBinaryString = function(str) {
        return BitSet.fromBinaryString(names, str);
    };

    ret.fromHexString = function(str) {
        return BitSet.fromHexString(names, str);
    };

    return ret;
};