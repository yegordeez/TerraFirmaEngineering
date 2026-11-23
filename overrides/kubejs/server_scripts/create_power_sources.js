ServerEvents.recipes(event => {
  event.remove({ output: 'create:water_wheel' })
  event.remove({ output: 'create:large_water_wheel' })
  event.remove({ output: 'create:windmill_bearing' })
  event.remove({ output: 'create:white_sail' })
  event.remove({ output: 'create:sail_frame' })
})
