import { aktiveDuel, duelEnd } from '../function/duel';
import { world, system } from '@minecraft/server';
import { sendMessage } from '../runs/run';
import { heldenSave } from '../function/heldenSave';
import { playDeath } from '../function/deathAnimation';
import { setHeart } from '../function/setHeart';

world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {

    system.run(() => {

        const damager = damageSource?.damagingEntity
        const mainHand = damager?.getComponent('equippable').getEquipment('Mainhand');

        if (deadEntity.typeId === 'helden:dummy') {

            const dummySave = heldenSave().player[deadEntity.nameTag]
            const keepInventory = world.gameRules.keepInventory

            dummySave.dummy = { kill: true, keepInventory }
            delete dummySave.combatlog

            setHeart(deadEntity.nameTag, (dummySave.heart - 1))
        }

        if (deadEntity.typeId === 'minecraft:player') {

            const deadSave = heldenSave().player[deadEntity.name]

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

                    if (deadSave?.combatlog >= 0.500 || damager?.typeId === 'minecraft:player') {

                        if (mainHand?.nameTag) {

                            sendMessage('helden.entityDie.killedFromWhite', { withs: [deadEntity.name, damager.name, mainHand.nameTag] });

                        } else {

                            if (damager?.name) {

                                sendMessage('helden.entityDie.killedFrom', { withs: [deadEntity.name, damager.name] });

                            } else {

                                sendMessage('helden.entityDie.die', { withs: [deadEntity.name] });
                            }
                        }

                        setHeart(deadEntity.name, (deadSave.heart - 1))
                        playDeath(deadEntity);
                    }
                }

                delete playerSave.combatlog
            }
        }
    })
})