import { world, system } from '@minecraft/server';
import { dummyId } from '../function/dummyIds';

function entityFunktion(entity) {

    if (entity.typeId === 'helden:dummy') {

        system.run(() => {

            const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
            const entitySave = heldenSave.player[entity.nameTag]

            const storedId = entitySave?.dummy.id
            const entityId = entity?.getDynamicProperty('id')

            if (storedId && entityId && storedId === entityId) {

                const rule = world.gameRules.keepInventory

                entity.triggerEvent(`helden:keepInventory_${rule}`);

                dummyId(entity.nameTag, entity.id).setId();

            } else {

                entity.remove();
            }
        })
    }
}

world.afterEvents.entityLoad.subscribe(({ entity }) => {

    entityFunktion(entity);
})

world.afterEvents.entitySpawn.subscribe(({ entity }) => {

    entityFunktion(entity);
})