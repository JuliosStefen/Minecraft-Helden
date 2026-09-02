import { startArmorLock, hatAusgeruestetenSchutz, gesperrteRuestungDroppen } from '../../runs/armorLock';
import { aktiveDuel, setDuel } from '../../function/duel';
import { world, system } from '@minecraft/server';
import { sendMessage } from '../../runs/run';
import { heldenSave } from '../../function/heldenSave';
import { setCombat } from './setCombat';
import { setHeart } from '../../function/setHeart';

world.afterEvents.entityHurt.subscribe(({ damageSource, hurtEntity }) => {

    system.run(() => {

        const damage = damageSource.damagingEntity;
        const hurt = hurtEntity;

        const hurtSave = heldenSave().player[hurt.name]
        const damageSave = heldenSave().player[damage?.name]

        const setts = heldenSave().settings

        if (damage?.typeId === 'minecraft:player') {

            const head = damage.getComponent('minecraft:equippable').getEquipment('Head');

            if (head?.typeId === 'krone:helden') {

                const loc = hurtEntity.location;

                for (let i = 0; i < 10; i++) {

                    const x = (Math.random() - 0.5) * 0.8;
                    const y = Math.random() * 1.5;
                    const z = (Math.random() - 0.5) * 0.8;

                    hurtEntity.dimension.spawnParticle('minecraft:blue_flame_particle', {
                        x: loc.x + x,
                        y: loc.y + y,
                        z: loc.z + z
                    });
                }
            }
        }

        if (damage?.typeId == 'minecraft:player' && hurt.typeId == 'minecraft:player') {

            if (aktiveDuel[hurt.name] === damage.name) {

                const duelName = aktiveDuel[damage.name]
                setDuel(duelName, damage.name)
            }

            if (aktiveDuel[damage.name] == undefined && aktiveDuel[hurt.name] == undefined && setts?.loastHeart !== false) {

                const mainHand = damage.getComponent('equippable').getEquipment('Mainhand')

                if (mainHand?.typeId == 'helden:soul_stealer') {

                    if (damageSave.heart <= 3 && hurtSave.heart >= 1) {

                        const { x, y, z } = damage.location
                        const dimension = world.getDimension(damage.dimension.id)

                        {
                            const { x, y, z } = hurt.location
                            dimension.spawnParticle('helden:heart_minus', { x, y: y + 1, z })
                        }

                        damage.runCommand('clear @s helden:soul_stealer 0 1')

                        dimension.spawnParticle('helden:heart_plus', { x, y: y + 1, z })
                        dimension.playSound('shriek.sculk_shrieker', { x, y, z });

                        setHeart(damage.name, (damageSave.heart + 1))
                        setHeart(hurt.name, (hurtSave.heart - 1))
                    }

                } else {

                    if (!damageSave?.combatlog) {
                        sendMessage('helden.entityHurt.attacked', { name: damage.name, withs: [hurt.name] })
                    }

                    if (!hurtSave?.combatlog) {
                        sendMessage('helden.entityHurt.attacked2', { name: hurt.name, withs: [damage.name] })
                    }

                    setCombat(damage.name, damage);
                    setCombat(hurt.name, hurt);

                    hurtSave.lastAttacker = damage.name

                    if (setts?.armorLock === undefined || setts.armorLock) {

                        startArmorLock(damage.name)
                        startArmorLock(hurt.name)
                    }
                }
            }
        }

        if (setts?.loastHeart !== false) {

            if (hurt.typeId === 'helden:dummy') {

                setCombat(hurt.nameTag, hurt)

                if (damage?.typeId === 'minecraft:player') {

                    setCombat(damage.name, damage);

                    if (setts?.armorLock === undefined || setts.armorLock) {

                        startArmorLock(damage.name)
                    }
                }
            }

            if (hurtSave?.combatlog > 0) {
                setCombat(hurt.name, hurt);
            }
        }
    })
})

world.beforeEvents.entityHurt.subscribe((event) => {

    const damagingEntity = event.damageSource.damagingEntity
    const hurtEntity = event.hurtEntity

    const damagingSave = heldenSave().player[damagingEntity?.name]
    const hurtSave = heldenSave().player[hurtEntity.name]

    if (damagingEntity?.typeId == 'minecraft:player' && hurtEntity.typeId == 'minecraft:player') {

        if (damagingSave?.linkheart == hurtEntity.name) {

            if (damagingSave.heart <= 1) {

                event.cancel = true
            }

            if (hurtSave.heart <= 1) {

                event.cancel = true
            }
        }
    }

    if (hurtEntity.typeId === 'minecraft:player' && event.cancel !== true) {

        const playerSave = heldenSave().player[hurtEntity.name]
        const health = hurtEntity.getComponent('health')?.currentValue ?? 0

        if (health <= 0 && playerSave?.armorLockEnd > Date.now() && hatAusgeruestetenSchutz(hurtEntity)) {

            event.cancel = true

            system.run(() => {

                gesperrteRuestungDroppen(hurtEntity)
                hurtEntity.kill()
            })
        }
    }
})