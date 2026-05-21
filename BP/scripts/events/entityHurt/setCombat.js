import { world } from '@minecraft/server';

import { timeoutDummy } from './timeoutDummy'

export function setCombat(name, entity) {

    const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
    const entitySave = heldenSave.player[name]
    const hearth = entity.getComponent('health').currentValue;

    let combatTime;

    if (entitySave) {

        if (hearth > 10) {
            combatTime = 30000
        } else if (hearth > 5) {
            combatTime = 60000
        } else {
            combatTime = 300000
        }

        entitySave.combatlog = Date.now() + combatTime;
        world.setDynamicProperty('heldenSave', JSON.stringify(heldenSave));

        timeoutDummy(entity);
    }
}