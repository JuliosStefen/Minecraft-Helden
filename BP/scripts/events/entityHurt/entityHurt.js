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

            if (aktiveDuel[damage.name] == undefined && aktiveDuel[hurt.name] == undefined) {

                const mainHand = damage.getComponent('equippable').getEquipment('Mainhand')

                if (mainHand?.typeId == 'helden:soul_stealer') {

                    if (damageSave.heart <= 3 && hurtSave.heart >= 1) {

                        {
                            const { x, y, z } = damage.location
                            damage.spawnParticle('helden:heart_plus', { x, y: y + 1, z })
                        }

                        {
                            const { x, y, z } = hurt.location
                            hurt.spawnParticle('helden:heart_minus', { x, y: y + 1, z })
                        }

                        hurt.playSound('shriek.sculk_shrieker');
                        damage.playSound('shriek.sculk_shrieker');

                        setHeart(damage.name, (damageSave.heart + 1))
                        setHeart(hurt.name, (hurtSave.heart - 1))
                    }

                } else {

                    if (setts?.loastHeart !== false) {

                        if (!damageSave?.combatlog) {
                            sendMessage('helden.entityHurt.attacked', { name: damage.name, withs: [hurt.name] })
                        }

                        if (!hurtSave?.combatlog) {
                            sendMessage('helden.entityHurt.attacked2', { name: hurt.name, withs: [damage.name] })
                        }

                        setCombat(damage.name, damage);
                        setCombat(hurt.name, hurt);
                    }
                }
            }
        }

        if (setts?.loastHeart !== false) {

            if (hurt.typeId === 'helden:dummy') {

                setCombat(hurt.nameTag, hurt)

                if (damage?.typeId === 'minecraft:player') {
                    setCombat(damage.name, damage);
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
})