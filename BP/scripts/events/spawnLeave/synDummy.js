import { world, system } from '@minecraft/server';
import { dummyId } from '../../function/dummyIds';

export function synDummy(player) {

    system.run(() => {

        const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
        const dummy = heldenSave.player[player.name]?.dummy

        if (dummy) {

            const entityId = dummyId(player.name).getId()

            if (entityId !== undefined) {

                const entity = world.getEntity(`${entityId}`);

                const dimension = entity.dimension

                const x = entity.location.x
                const y = entity.location.y
                const z = entity.location.z

                player.teleport({ x, y, z }, { dimension });

                entity.remove();

            } else {

                if (dummy?.kill == true) {

                    const showParticles = false;

                    const wd = world.getDimension('overworld');
                    const wx = world.getDefaultSpawnLocation().x
                    const wy = world.getDefaultSpawnLocation().y
                    const wz = world.getDefaultSpawnLocation().z

                    const x = player.getSpawnPoint()?.x || wx
                    const y = player.getSpawnPoint()?.y || wy
                    const z = player.getSpawnPoint()?.z || wz

                    const dimension = player.getSpawnPoint()?.dimension || wd

                    player.teleport({ x, y, z }, { dimension });

                    player.setOnFire(0);
                    player.runCommand('effect @s clear');
                    player.addEffect('minecraft:instant_health', 2, { amplifier: 255, showParticles });
                    player.addEffect('minecraft:saturation', 5, { amplifier: 255, showParticles });

                    if (dummy?.keepInventory === false) {

                        player.runCommand('clear @s');
                        player.addExperience(-2 ^ 24);
                    }

                } else {

                    const x = dummy.location.x
                    const y = dummy.location.y
                    const z = dummy.location.z

                    const dimension = world.getDimension(dummy.dimension);

                    player.teleport({ x, y, z }, { dimension });
                }

                delete heldenSave.player[player.name]?.dummy;

                world.setDynamicProperty('heldenSave', JSON.stringify(heldenSave));
            }
        }
    })
}