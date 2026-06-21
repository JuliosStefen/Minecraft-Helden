import { timeoutDummy } from '../entityHurt/timeoutDummy';
import { heldenSave } from '../../function/heldenSave';
import { inventory } from './spawnLeave';
import { system } from '@minecraft/server';
import { loadId } from '../../runs/run';

export function spawnDummy(health, dimension, rx, ry, name, x, y, z) {

    system.run(() => {

        const playerSave = heldenSave().player[name]
        const dummyId = loadId(50);

        dimension.spawnEntity('helden:dummy', { x, y, z }).setDynamicProperty('id', dummyId);

        const entity = dimension.getEntities().find(e => e.getDynamicProperty('id') == dummyId)

        if (entity && entity?.typeId === 'helden:dummy') {

            playerSave.dummy = {}
            playerSave.dummy.id = dummyId

            entity.nameTag = name
            entity.applyDamage(20 - health);
            entity.setRotation({ x: rx, y: ry });

            for (let s = 0; s <= 40; s++) {

                const item = inventory[name][s]

                if (item !== 'none') {

                    function equip(slot) {
                        entity.runCommand(`replaceitem entity @s slot.armor.${slot} 0 ${item.typeId} 1`);
                    }

                    if (s === 36) equip('head');
                    if (s === 37) equip('chest');
                    if (s === 38) equip('legs');
                    if (s === 39) equip('feet');

                    entity.getComponent('inventory').container.setItem(s, item);
                }
            }

            timeoutDummy(entity);
        }
    })
}