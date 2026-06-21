import { world, system } from '@minecraft/server';
import { heldenSave } from '../../function/heldenSave';
import { dummyId } from '../../function/dummyIds';

export function synDummy(player) {

    system.run(() => {

        const dummy = heldenSave().player[player.name]?.dummy

        if (dummy) {

            const entityId = dummyId(player.name).getId()

            if (entityId !== undefined) {

                const entity = world.getEntity(`${entityId}`);
                const { x, y, z } = entity.location
                const dimension = entity.dimension

                player.teleport({ x, y, z }, { dimension });

                dummyId(entity.nameTag).removeId();
                entity.remove();

            } else {

                if (dummy?.kill == true) {

                    const showParticles = false;

                    const wd = world.getDimension('overworld');

                    const { wx, wy, wz } = world.getDefaultSpawnLocation()

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

                    const { x, y, z } = dummy.location
                    const dimension = world.getDimension(dummy.dimension);

                    player.teleport({ x, y, z }, { dimension });
                }

                delete heldenSave().player[player.name]?.dummy;
            }
        }
    })
}