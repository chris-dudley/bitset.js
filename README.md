# Bitset.js

A bit-set implementation in pure JavaScript.

Inspired by, and based on, the Coffeescript bitset implementation by
Tom de Grunt (https://github.com/tdegrunt/bitset)

All bit positions are 0-based. That is, the least significant bit is bit 0.

Bit positions may be specified by either their index or their name, if the name
is defined in the names mapping.

## Construction

### Full Constructor

```js
var bs = new BitSet(names, bytes);
```

- **names** is an optional object mapping names to bit indicies.
- **bytes** is an optional array of 32-bit integers (words) specifying the
	initial contents of the BitSet. The least significant word should be
	at index 0.

### Factory

```js
var factory = BitSet.factory(names);
var bs = factory(bytes);
```

**names** and **bytes** serve the same role as in the full constructor.

This method of construction serves as a shortcut for creating many BitSets that
all share the same set of named bits.

## Methods

### ```bs.set(pos[, value])```

Sets the bit at **pos** to **value** or true, if value is ommitted.

Returns this

### ```bs.clear(pos)```

Clears the bit at **pos**. Equivalent to ```bs.set(pos, false)```.

Returns this

### ```bs.get(pos)```

Gets the value of the bit at **pos**.

Returns true if the bit is set, false otherwise.

### ```bs.toggle(pos)```

Toggles the state of the bit at **pos**.

Returns this

### ```bs.wordLength()```

Returns the number of words used by the BitSet to represent the bits.

### ```bs.length()```

Returns the logical length of the BitSet (i.e., the index of the highest
set bit + 1)

### ```bs.cardinality()```

Returns the number of bits which are set.

### ```bs.or(other)```

Performs a logical OR of this BitSet and the argument BitSet.

The result is stored in this BitSet.

Returns this.

### ```bs.and(other)```

Performs a logical AND of this BitSet and the argument BitSet.

The result is stored in this BitSet.

Returns this.

### ```bs.andNot(other)```

Performs a logical AND NOT of this BitSet and the argument BitSet.

The result is stored in this BitSet.

Returns this.

### ```bs.xor(other)```

Performs a logical XOR of this BitSet and the argument BitSet.

The result is stored in this BitSet.

Returns this.

### ```bs.intersects(other)```

Returns true if this BitSet and the argument BitSet have bits in common,
otherwise returns false.

### ```bs.empty()```

Returns true if this BitSet has no bits set (i.e., the cardinality is 0).

### ```bs.reset()```

Clears all bits in the BitSet.

Returns this.

### ```bs.equals(other)```

Returns true if this BitSet contains exactly the same bits as the
argument BitSet.

### ```bs.clone()```

Creates a copy of the BitSet which may be modified independently.

Returns the copy.

### ```bs.copy(other)```

Makes this BitSet a copy of the argument BitSet.

Returns this

### ```bs.toString()```

Returns a string representation of the BitSet.

Example: For a BitSet with bits 0, 5, and 8 set, toString() would return
"{0,5,8}"

### ```bs.toBinaryString()```

Returns a big-endian binary string representation of the BitSet.

### ```bs.toHexString()```

Returns a hexadecimal string representation of the BitSet.

