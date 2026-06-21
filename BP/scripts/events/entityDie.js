import { aktiveDuel, duelEnd } from '../function/duel';
import { world, system } from '@minecraft/server';
import { sendMessage } from '../runs/run';
import { heldenSave } from '../function/heldenSave';
import { playDeath } from '../function/deathAnimation';
import { setHeart } from '../function/setHeart';

world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {

    system.run(() => {

        if (deadEntity.typeId === 'helden:dummy') {

            const dummySave = heldenSave().player[deadEntity.nameTag]
            const keepInventory = world.gameRules.keepInventory

            dummySave.dummy = { kill: true, keepInventory }
            delete dummySave.combatlog

            setHeart(deadEntity.nameTag, (dummySave.heart - 1))
        }

        if (deadEntity.typeId === 'minecraft:player') {

            const deadSave = heldenSave().player[deadEntity.name]
            const damager = damageSource?.damagingEntity

            if (aktiveDuel[deadEntity.name]) {

                const duelName = aktiveDuel[deadEntity.name]

                duelEnd(duelName);

                deadSave.duel++
                heldenSave().player[duelName].duel++

                sendMessage('helden.entityDie.winDuel', { withs: [duelName, deadEntity.name] });

            } else {

                const playerSave = heldenSave().player[deadEntity.name]
                const setts = heldenSave().settings

                if (setts?.loastHeart == undefined || setts?.loastHeart) {

                    if (deadSave?.combatlog >= 0.500) {

                        setHeart(deadEntity.name, (deadSave.heart - 1))
                        playDeath(deadEntity);
                        delete playerSave.combatlog
                        return;
                    }

                    if (damager?.typeId === 'minecraft:player') {

                        setHeart(deadEntity.name, (deadSave.heart - 1))
                        playDeath(deadEntity);
                        delete playerSave.combatlog
                        return;
                    }
                }
            }
        }
    })
})