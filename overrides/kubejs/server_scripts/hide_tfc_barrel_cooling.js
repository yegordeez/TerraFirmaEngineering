// Both recipe viewers receive these display filters from the server.
RecipeViewerEvents.removeRecipes(event => {
  event.remove('tfc:barrel/water_cooling')
  event.remove('tfc:barrel/salt_water_cooling')
  event.remove('tfc:barrel/canola_oil_cooling')
  event.remove('tfc:barrel/olive_oil_cooling')
})
