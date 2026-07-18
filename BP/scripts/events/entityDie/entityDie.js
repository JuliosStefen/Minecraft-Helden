import { aktiveDuel, duelEnd } from '../../function/duel';
import { world, system } from '@minecraft/server';
import { sendMessage } from '../../runs/run';
import { releaseArmorLock } from '../../runs/armorLock';
import { heldenSave } from '../../function/heldenSave';
import { playDeath } from '../../function/deathAnimation';
import { setHeart } from '../../function/setHeart';

import { deathMessage } from './deathMessage'

world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {

    system.run(() => {

        const damager = damageSource?.damagingEntity

        if (deadEntity.typeId === 'helden:dummy') {

            const dummySave = heldenSave().player[deadEntity.nameTag]
            const keepInventory = world.gameRules.keepInventory

            dummySave.dummy = { kill: true, keepInventory }
            delete dummySave.combatlog

            deathMessage(deadEntity, damager)
            setHeart(deadEntity.nameTag, (dummySave.heart - 1))
        }

        if (deadEntity.typeId === 'minecraft:player') {

            releaseArmorLock(deadEntity.name)

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

                        deathMessage(deadEntity, damager, deadSave.lastAttacker)
                        setHeart(deadEntity.name, (deadSave.heart - 1))
                        playDeath(deadEntity);
                    }
                }

                delete playerSave.combatlog
                delete playerSave.lastAttacker
            }
        }
    })
})