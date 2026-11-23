const geologyGearMetals = [
  'aluminum', 'bronze', 'chromium', 'cobalt', 'copper', 'gold', 'iron',
  'lead', 'manganese', 'magnesium', 'neodymium', 'nickel', 'osmium',
  'platinum', 'hastelloy', 'high_speed_steel', 'silver', 'steel',
  'stainless_steel', 'tin', 'titanium', 'tungsten', 'unobtanium',
  'vanadium', 'zinc', 'zirconium', 'tungsten_carbide'
]
const pneumaticGear = 'pneumaticcraft:compressed_iron_gear'
const retainedGearAnvilId = /^(tfc|tfcm|firmalife):anvil\/metal\/gear\/[^/]+$/

ServerEvents.recipes(event => {
  event.remove({ id: pneumaticGear })

  event.forEachRecipe({ type: 'immersivegeology:foundry' }, recipe => {
    if (String(recipe.getId()).startsWith('immersivegeology:foundry/gear_')) recipe.remove()
  })
  event.forEachRecipe({ type: 'immersiveengineering:metal_press' }, recipe => {
    if (String(recipe.getId()).startsWith('immersiveengineering:metalpress/gear_')) recipe.remove()
  })

  // Generate a matching press recipe for each enabled anvil recipe.
  event.forEachRecipe({ type: 'tfc:anvil' }, recipe => {
    if (!retainedGearAnvilId.test(String(recipe.getId()))) return
    const anvil = JSON.parse(String(recipe.originalJson || recipe.json))
    const [namespace, path] = anvil.result.id.split(':')
    const metal = path.split('/').pop()

    event.custom({
      type: 'immersiveengineering:metal_press',
      energy: 2400,
      input: { basePredicate: { tag: `c:ingots/${metal}` }, count: 4 },
      mold: 'immersiveengineering:mold_gear',
      result: anvil.result
    }).id(`kubejs:metal_gears/${namespace}/${metal}/ie_press`)
  })

  // These machines use the exact PneumaticCraft item instead of the common gear tag.
  const pneumaticMachines = ['flux_compressor', 'pneumatic_dynamo', 'solar_compressor']
  pneumaticMachines.forEach(machine => {
    event.replaceInput({ id: `pneumaticcraft:${machine}` }, pneumaticGear, 'tfcm:metal/gear/compressed_iron')
  })
})

RecipeViewerEvents.removeEntries('item', event => {
  geologyGearMetals.forEach(metal => event.remove(`immersivegeology:gear_${metal}`))
  event.remove(pneumaticGear)
})
