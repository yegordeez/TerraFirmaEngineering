const hotOrNotTongMetals = [
  'bismuth',
  'bismuth_bronze',
  'black_bronze',
  'black_steel',
  'blue_steel',
  'brass',
  'bronze',
  'cast_iron',
  'copper',
  'gold',
  'nickel',
  'red_steel',
  'rose_gold',
  'silver',
  'steel',
  'sterling_silver',
  'tin',
  'wrought_iron',
  'zinc'
]

ServerEvents.recipes(event => {
  hotOrNotTongMetals.forEach(metal => {
    const recipeId = `tfchotornot:crafting/tongs/${metal}`
    event.remove({ id: recipeId })
    event.custom({
      type: 'tfchotornot:advanced_damage_inputs_shaped_crafting',
      pattern: ['PP', ' R'],
      key: {
        P: { item: `tfchotornot:tong_part/${metal}` },
        R: { tag: `c:rivets/${metal}` }
      },
      result: {
        stack: { id: `tfchotornot:tongs/${metal}`, count: 1 },
        modifiers: [{ type: 'tfc:copy_forging_bonus' }]
      }
    }).id(recipeId)
  })
})
