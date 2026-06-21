import { timeoutDummy } from './timeoutDummy'
import { heldenSave } from '../../function/heldenSave';

export function setCombat(name, entity) {

    const entitySave = heldenSave().player[name]

    const heart = entity.getComponent('health').currentValue;

    let combatTime;

    if (entitySave) {

        if (heart > 10) {
            combatTime = 30000
        } else if (heart > 5) {
            combatTime = 60000
        } else {
            combatTime = 300000
        }

        entitySave.combatlog = Date.now() + combatTime;
        timeoutDummy(entity);
    }
}