const createPowerSources = [
  'create:water_wheel',
  'create:large_water_wheel',
  'create:windmill_bearing'
]

const hiddenCreatePowerItems = createPowerSources.concat([
  'create:white_sail',
  'create:sail_frame'
])

RecipeViewerEvents.removeEntries('item', event => {
  hiddenCreatePowerItems.forEach(item => event.remove(item))
})

Ponder.registry(event => {
  event.remove(hiddenCreatePowerItems)
})

Ponder.tags(event => {
  const kineticSources = 'create:kinetic_sources'
  event.remove(kineticSources, createPowerSources)
  event.remove('create:movement_anchor', 'create:windmill_bearing')

  // Keep the original category and its translations while replacing the water wheel icon.
  const PonderJS = Java.loadClass('com.almostreliable.ponderjs.PonderJS')
  const PonderTag = Java.loadClass('net.createmod.ponder.foundation.PonderTag')
  const registry = PonderJS.getTagRegistryAccessor()
  const original = PonderJS.getTagByName(kineticSources).get()
  const icon = Item.of('create:hand_crank')
  const replacement = new PonderTag(original.getId(), null, icon, icon)
  const listedTags = registry.getListedTags()

  listedTags.set(listedTags.indexOf(original), replacement)
  registry.getRegisteredTags().put(original.getId(), replacement)
})
