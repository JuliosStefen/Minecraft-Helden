import { aktiveDuel, duelEnd } from '../../function/duel';
import { setHeart, maxHeart } from '../../function/heart';
import { releaseArmorLock } from '../../runs/armorLock';
import { world, system } from '@minecraft/server';
import { deathMessage } from './deathMessage';
import { sendMessage } from '../../runs/run';
import { heldenSave } from '../../function/heldenSave';
import { playDeath } from '../../function/deathAnimation';

world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => system.run(() => {

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

                const killerName = damager?.typeId == 'minecraft:player' ? damager?.name : playerSave.lastAttacker

                if (setts?.heartMode == 2 && setts?.showHeadhunt &&
                    playerSave?.partner == killerName &&
                    playerSave?.partner !== undefined &&
                    playerSave?.headhunt == undefined) {

                    const killerSave = heldenSave().player[killerName]

                    sendMessage('helden.headhunt.won', { name: killerName, withs: [deadEntity.name] })
                    sendMessage('helden.headhunt.wonBroadcast', { withs: [killerName, deadEntity.name] })

                    setHeart(killerName, Math.min(maxHeart().max, killerSave.heart + 1))

                    killerSave.headhunt = true
                    playerSave.headhunt = false

                } else if (deadSave?.combatlog >= 0.500 || damager?.typeId == 'minecraft:player') {

                    setHeart(deadEntity.name, (deadSave.heart - 1))

                    deathMessage(deadEntity, damager)
                    playDeath(deadEntity);
                }

                delete playerSave.combatlog
                delete playerSave.lastAttacker
            }
        }
    }
}))