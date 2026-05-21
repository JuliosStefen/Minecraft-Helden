import { system, world } from '@minecraft/server';

let dummyDesp = {}

export function timeoutDummy(entity) {

    if (entity.typeId === 'helden:dummy') {

        const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
        const combatTime = heldenSave.player[entity.nameTag].combatlog - Date.now();

        if (dummyDesp[entity.id]) {

            system.clearRun(dummyDesp[entity.id])
        }

        dummyDesp[entity.id] = system.runTimeout(() => {

            if (entity) {

                const helden = JSON.parse(world.getDynamicProperty('heldenSave'));
                const dummySave = helden.player[entity.nameTag]

                const dimension = entity.dimension.id

                const x = entity.location.x
                const y = entity.location.y
                const z = entity.location.z

                dummySave.combatlog = 'xxx';

                dummySave.dummy = {

                    location: { x, y, z },
                    dimension
                }

                world.setDynamicProperty('heldenSave', JSON.stringify(helden));

                entity.remove();
            }

        }, (combatTime / 50) - 10);
    }
}