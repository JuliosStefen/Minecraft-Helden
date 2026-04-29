import { world, system } from '@minecraft/server';

world.afterEvents.playerDimensionChange.subscribe(({ player, fromDimension, toDimension }) => {

    system.run(() => {

        const risikoSave = JSON.parse(world.getDynamicProperty('heldenSave'));
        const toggles = risikoSave.settings;

        const wsp = world.getDefaultSpawnLocation()

        const x = player.getSpawnPoint()?.x ?? wsp.x
        const y = player.getSpawnPoint()?.y ?? wsp.y
        const z = player.getSpawnPoint()?.z ?? wsp.z

        if (toggles?.lockNether === undefined || toggles?.lockNether) {

            if (toDimension.id === 'minecraft:nether') {
                const dimension = world.getDimension(fromDimension.id);

                player.teleport({ x, y, z }, { dimension })
            }
        }

        if (toggles?.lockEnd === undefined || toggles?.lockEnd) {

            if (toDimension.id === 'minecraft:the_end') {
                const dimension = world.getDimension(fromDimension.id);

                player.teleport({ x, y, z }, { dimension })
            }
        }
    })
})