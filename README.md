# TerraFirmaEngineering

Сборка для Minecraft 1.21.1 на NeoForge 21.1.266. В основе TerraFirmaCraft, Create и Immersive Engineering. Рецепты, теги и переводы хранятся в `overrides/kubejs`, настройки модов — в `overrides/config`.

## Установка

1. Скачайте [TerraFirmaEngineering-1.0.0.zip](TerraFirmaEngineering-1.0.0.zip?raw=true) и импортируйте его в Prism Launcher или CurseForge как новый экземпляр.
2. Выберите Java 21. Лаунчер загрузит версии модов из `manifest.json`. Если загрузка мода ограничена его автором, воспользуйтесь ссылкой, которую покажет лаунчер.
3. При желании скачайте [TFC Ambiental Refreshed](https://www.curseforge.com/minecraft/texture-packs/tfc-ambiental-refreshed) для Minecraft 1.21.1, поместите его в `resourcepacks` и включите в настройках игры.

Из исходников ZIP можно собрать в PowerShell:

```powershell
Compress-Archive -LiteralPath manifest.json, overrides -DestinationPath TerraFirmaEngineering-1.0.0.zip
```
