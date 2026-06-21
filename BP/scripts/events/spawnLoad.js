import { world, system } from '@minecraft/server';
import { heldenSave } from '../function/heldenSave';
import { dummyId } from '../function/dummyIds';

function entityFunktion(entity) {

    if (entity.typeId === 'helden:dummy') {

        system.run(() => {

            const entitySave = heldenSave().player[entity.nameTag]

            const savedId = entitySave?.dummy.id
            const entityId = entity?.getDynamicProperty('id')

            if (savedId && entityId && savedId === entityId) {

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