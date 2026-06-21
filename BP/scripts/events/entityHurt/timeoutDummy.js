import { heldenSave } from '../../function/heldenSave';
import { dummyId } from '../../function/dummyIds';
import { system } from '@minecraft/server';

let dummyDesp = {}

export function timeoutDummy(entity) {

    if (entity.typeId === 'helden:dummy') {

        const combatTime = heldenSave().player[entity.nameTag]?.combatlog - Date.now();

        if (dummyDesp[entity.id]) {

            system.clearRun(dummyDesp[entity.id])
        }

        dummyDesp[entity.id] = system.runTimeout(() => {

            if (entity) {

                const dummySave = heldenSave().player[entity.nameTag]

                const dimension = entity.dimension.id

                const x = entity.location.x
                const y = entity.location.y
                const z = entity.location.z

                delete dummySave.combatlog

                dummySave.dummy = {

                    location: { x, y, z },
                    dimension
                }

                dummyId(entity.nameTag).removeId();
                entity.remove();
            }

        }, (combatTime / 50) - 10);
    }
}