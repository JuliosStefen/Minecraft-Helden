import { dummyIds, dummyId } from '../function/dummyIds';
import { world } from '@minecraft/server';

world.afterEvents.gameRuleChange.subscribe(({ rule }) => {

    world.gameRules.showDeathMessages = false;

    if (rule == 'keepInventory') {

        for (const name in dummyIds) {

            const entity = world.getEntity(`${dummyId(name).getId()}`);

            const rule = world.gameRules.keepInventory

            entity?.triggerEvent(`helden:keepInventory_${rule}`);
        }
    }
});