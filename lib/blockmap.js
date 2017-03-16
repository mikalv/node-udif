/**
 * BlockMap (BLKX) data (aka Mish Data)
 * @constructor
 * @memberOf UDIF
 * @return {BlockMap}
 */
function BlockMap() {

  if( !(this instanceof BlockMap) )
    return new BlockMap()

  this.signature = 0x00000000
  this.version = 0x00000000
  this.sectorNumber = 0x0000000000000000
  this.sectorCount = 0x0000000000000000
  this.dataOffset = 0x0000000000000000
  this.buffersNeeded = 0x00000000
  this.blockDescriptorCount = 0x00000000
  this.reserved1 = 0x00000000
  this.reserved2 = 0x00000000
  this.reserved3 = 0x00000000
  this.reserved4 = 0x00000000
  this.reserved5 = 0x00000000
  this.reserved6 = 0x00000000
  this.checksumType = 0x00000000
  this.checksumSize = 0x00000000 // size in bits (0-1024 bits supported)
  this.checksum = '' // Buffer.alloc( 128, 0 )
  this.blockCount = 0x00000000
  this.blocks = []

}

/**
 * BlockMap data signature
 * @type {Number}
 */
BlockMap.signature = 0x6D697368

/**
 * BLKX Version (latest known == 1)
 * @type {Number}
 */
BlockMap.version = 0x00000001

BlockMap.Block = require( './block' )

/**
 * Parse BlockMap data from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {BlockMap}
 */
BlockMap.parse = function( buffer, offset ) {
  return new BlockMap().parse( buffer, offset )
}

/**
 * BlockMap prototype
 * @type {Object}
 * @ignore
 */
BlockMap.prototype = {

  constructor: BlockMap,

  /**
   * Parse BlockMap data from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {BlockMap}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.signature = buffer.readUInt32BE( offset + 0 )
    this.version = buffer.readUInt32BE( offset + 4 )
    this.sectorNumber = buffer.readUIntBE( offset + 8, 8 )
    this.sectorCount = buffer.readUIntBE( offset + 16, 8 )
    this.dataOffset = buffer.readUIntBE( offset + 24, 8 )
    this.buffersNeeded = buffer.readUInt32BE( offset + 32 )
    this.blockDescriptorCount = buffer.readUInt32BE( offset + 36 )
    this.reserved1 = buffer.readUInt32BE( offset + 40 )
    this.reserved2 = buffer.readUInt32BE( offset + 44 )
    this.reserved3 = buffer.readUInt32BE( offset + 48 )
    this.reserved4 = buffer.readUInt32BE( offset + 52 )
    this.reserved5 = buffer.readUInt32BE( offset + 56 )
    this.reserved6 = buffer.readUInt32BE( offset + 60 )
    this.checksumType = buffer.readUInt32BE( offset + 64 )
    this.checksumSize = buffer.readUInt32BE( offset + 68 )
    this.checksum = buffer.toString( 'hex', offset + 72, offset + 72 + this.checksumSize / 8 )
    this.blockCount = buffer.readUInt32BE( offset + 200 )
    this.blocks = []

    for( var i = 0; i < this.blockCount; i++ ) {
      this.blocks.push(
        BlockMap.Block.parse( buffer, offset + 204 + ( i * 40 ) )
      )
    }

    return this

  },

}

// Exports
module.exports = BlockMap