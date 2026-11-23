// Metallic members of c:plates supplied by other mods in this pack.
const nonTfcmMetalPlates = new Set([
  'ad_astra:calorite_plate',
  'ad_astra:desh_plate',
  'ad_astra:iron_plate',
  'ad_astra:ostrum_plate',
  'ad_astra:steel_plate',
  'create:brass_sheet',
  'create:copper_sheet',
  'create:golden_sheet',
  'create:iron_sheet',
  'immersiveengineering:plate_aluminum',
  'immersiveengineering:plate_constantan',
  'immersiveengineering:plate_copper',
  'immersiveengineering:plate_electrum',
  'immersiveengineering:plate_gold',
  'immersiveengineering:plate_iron',
  'immersiveengineering:plate_lead',
  'immersiveengineering:plate_nickel',
  'immersiveengineering:plate_silver',
  'immersiveengineering:plate_steel',
  'immersiveengineering:plate_uranium',
  'immersivegeology:plate_bronze',
  'immersivegeology:plate_chromium',
  'immersivegeology:plate_cobalt',
  'immersivegeology:plate_hastelloy',
  'immersivegeology:plate_high_speed_steel',
  'immersivegeology:plate_magnesium',
  'immersivegeology:plate_manganese',
  'immersivegeology:plate_molybdenum',
  'immersivegeology:plate_neodymium',
  'immersivegeology:plate_osmium',
  'immersivegeology:plate_platinum',
  'immersivegeology:plate_rusty_metal',
  'immersivegeology:plate_stainless_steel',
  'immersivegeology:plate_thorium',
  'immersivegeology:plate_tin',
  'immersivegeology:plate_titanium',
  'immersivegeology:plate_tungsten',
  'immersivegeology:plate_tungsten_carbide',
  'immersivegeology:plate_unobtanium',
  'immersivegeology:plate_vanadium',
  'immersivegeology:plate_zinc',
  'immersivegeology:plate_zirconium'
])

const adAstraPlateAnvilTiers = { desh: 4, ostrum: 5, calorite: 6 }
const visibleAdAstraPlates = new Set(Object.keys(adAstraPlateAnvilTiers).map(metal => `ad_astra:${metal}_plate`))

function isMetalPlateId(id) {
  return typeof id === 'string' && (nonTfcmMetalPlates.has(id) || id.startsWith('tfcm:metal/plate/'))
}

function isMetalPlateResult(result) {
  if (typeof result === 'string') return isMetalPlateId(result)
  return result != null && (
    isMetalPlateId(result.id) ||
    isMetalPlateId(result.item) ||
    (typeof result.tag === 'string' && result.tag.startsWith('c:plates/') && result.tag !== 'c:plates/hop_graphite') ||
    (result.stack != null && isMetalPlateResult(result.stack))
  )
}

function addPlatePressRecipes(event, metal, ingredient, plate) {
  event.custom({
    type: 'create:pressing',
    ingredients: [ingredient],
    results: [{ id: plate }]
  }).id(`kubejs:metal_plates/${metal}/create_press`)

  event.custom({
    type: 'immersiveengineering:metal_press',
    energy: 2400,
    input: ingredient,
    mold: 'immersiveengineering:mold_plate',
    result: { id: plate }
  }).id(`kubejs:metal_plates/${metal}/ie_press`)
}

ServerEvents.recipes(event => {
  const tfcmAnvilPlates = []
  // Read the result fields directly to cover modded machines with no KubeJS recipe schema.
  event.forEachRecipe({}, recipe => {
    const json = recipe.originalJson || recipe.json
    if (json == null) return
    const data = JSON.parse(String(json))
    const recipeId = String(recipe.getId())
    if (data.type === 'tfc:anvil' && recipeId.startsWith('tfcm:anvil/metal/plate/')) {
      tfcmAnvilPlates.push(data)
      return
    }

    if (isMetalPlateResult(data.result) || isMetalPlateResult(data.output)) {
      recipe.remove()
      return
    }

    const changes = {}
    // Rhino treats block-scoped const declarations in repeated blocks as redeclarations.
    for (const field of ['result', 'results', 'output', 'outputs', 'item_outputs']) {
      var outputs = data[field]
      if (!Array.isArray(outputs) || !outputs.some(isMetalPlateResult)) continue

      if (recipeId === 'create:sequenced_assembly/precision_mechanism') {
        var goldSheet = outputs.find(result => result.id === 'create:golden_sheet' || result.id === 'tfcm:metal/plate/gold')
        if (goldSheet) goldSheet.id = 'minecraft:gold_ingot'
      }

      var remaining = outputs.filter(result => !isMetalPlateResult(result))
      if (remaining.length === 0) {
        recipe.remove()
        return
      }
      changes[field] = remaining
    }

    if (Object.keys(changes).length) recipe.merge(changes)
  })

  // Using loaded anvil recipes respects TFCM's enabled metals and mod conditions.
  tfcmAnvilPlates.forEach(data => {
    const plate = data.result.id
    addPlatePressRecipes(event, plate.split('/').pop(), data.ingredient, plate)
  })

  Object.keys(adAstraPlateAnvilTiers).forEach(metal => {
    const ingredient = { tag: `c:ingots/${metal}` }
    const plate = `ad_astra:${metal}_plate`
    event.custom({
      type: 'tfc:anvil',
      ingredient: ingredient,
      result: { id: plate },
      rules: ['hit_last', 'hit_second_last', 'hit_third_last'],
      tier: adAstraPlateAnvilTiers[metal]
    }).id(`kubejs:metal_plates/${metal}/anvil`)
    addPlatePressRecipes(event, metal, ingredient, plate)
  })
})

RecipeViewerEvents.removeEntries('item', event => {
  nonTfcmMetalPlates.forEach(item => {
    if (!visibleAdAstraPlates.has(item)) event.remove(item)
  })
})
