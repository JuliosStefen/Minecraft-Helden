import { world } from '@minecraft/server';
import { dummyIds, dummyId } from '../function/dummyIds';

world.afterEvents.gameRuleChange.subscribe(({ rule }) => {

    if (rule == 'keepInventory') {

        for (const name in dummyIds) {

            const entity = world.getEntity(`${dummyId(name).getId()}`);

            const rule = world.gameRules.keepInventory

            entity?.triggerEvent(`helden:keepInventory_${rule}`);
        }
    }
});