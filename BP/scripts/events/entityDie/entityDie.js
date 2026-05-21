import { world, system } from '@minecraft/server';

import { playDeath } from '../../function/deathAnimation';
import { removeHearth } from './removeHearth';
import { setNameTag } from '../../runs/run';

world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {

    system.run(() => {

        const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));

        if (deadEntity.typeId === 'helden:dummy') {

            const dummySave = heldenSave.player[deadEntity.nameTag]
            const keepInventory = world.gameRules.keepInventory

            dummySave.dummy = { kill: true, keepInventory }
            dummySave.combatlog = 'xxx'

            world.setDynamicProperty('heldenSave', JSON.stringify(heldenSave));

            removeHearth(deadEntity.nameTag);
        }

        if (deadEntity.typeId === 'minecraft:player') {

            const deadSave = heldenSave.player[deadEntity.name]
            const damager = damageSource?.damagingEntity

            if (deadSave?.combatlog >= 0.500) {

                removeHearth(deadEntity.name);
                setNameTag(deadEntity.name);
                playDeath(deadEntity);
                return;
            }

            if (damager?.typeId === 'minecraft:player') {

                removeHearth(deadEntity.name);
                setNameTag(deadEntity.name);
                playDeath(deadEntity);
                return;
            }
        }
    })
})