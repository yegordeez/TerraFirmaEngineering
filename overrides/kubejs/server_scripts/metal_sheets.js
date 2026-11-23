const crossoverSheetMetals = ['aluminum', 'constantan', 'electrum', 'lead', 'uranium']
const retainedSheetAnvilId = /^(tfc|tfcm|firmalife):anvil\/metal\/sheet\/[^/]+$/

ServerEvents.recipes(event => {
  crossoverSheetMetals.forEach(metal => {
    event.remove({ id: `tfc_ie_addon:anvil/metal/sheet/${metal}` })
    event.remove({ id: `tfc_ie_addon:metalpress/sheet_${metal}` })
  })

  // Use the loaded anvil recipes to respect TFCM's metal enablement conditions.
  event.forEachRecipe({ type: 'tfc:anvil' }, recipe => {
    const anvilId = String(recipe.getId())
    if (!retainedSheetAnvilId.test(anvilId)) return

    const anvil = JSON.parse(String(recipe.originalJson || recipe.json))
    const [namespace, sheetPath] = anvil.result.id.split(':')
    const metal = sheetPath.split('/').pop()
    const recipePrefix = `kubejs:metal_sheets/${namespace}/${metal}`

    // Replace Crossover's original recipes so each metal has one IE press recipe.
    event.remove({ id: `tfc_ie_addon:metalpress/sheet_${metal}` })

    event.custom({
      type: 'create:pressing',
      ingredients: [anvil.ingredient],
      results: [anvil.result]
    }).id(`${recipePrefix}/create_press`)

    event.custom({
      type: 'immersiveengineering:metal_press',
      energy: 2400,
      input: {
        basePredicate: { tag: `c:ingots/${metal}` },
        count: 2
      },
      mold: 'tfc_ie_addon:mold_sheet',
      result: anvil.result
    }).id(`${recipePrefix}/ie_press`)
  })
})

RecipeViewerEvents.removeEntries('item', event => {
  crossoverSheetMetals.forEach(metal => event.remove(`tfc_ie_addon:metal/sheet/${metal}`))
})
