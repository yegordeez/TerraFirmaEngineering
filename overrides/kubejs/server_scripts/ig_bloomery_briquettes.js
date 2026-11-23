const tfcmBriquetteHeatingId = /^tfcm:heating\/ore_processing\/briquet\/([^/]+)$/

ServerEvents.recipes(event => {
  event.remove({ type: 'immersivegeology:bloomery' })

  // Loaded TFCM heating recipes define the metal and respect ore and metal settings.
  event.forEachRecipe({ type: 'tfc:heating' }, recipe => {
    const match = tfcmBriquetteHeatingId.exec(String(recipe.getId()))
    if (!match) return

    const heating = JSON.parse(String(recipe.originalJson || recipe.json))
    const ingot = heating.result_fluid.id.replace(':metal/', ':metal/ingot/')
    event.custom({
      type: 'immersivegeology:bloomery',
      input: { basePredicate: heating.ingredient, count: 1 },
      result: { id: ingot, count: 1 },
      time: 400
    }).id(`kubejs:ig_bloomery/briquettes/${match[1]}`)
  })
})
