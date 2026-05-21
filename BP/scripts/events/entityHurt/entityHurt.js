import { world, system } from '@minecraft/server';
import { sendMessage } from '../../runs/run';
import { setCombat } from './setCombat';

world.afterEvents.entityHurt.subscribe((event) => {

    system.run(() => {

        const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
        const damage = event.damageSource.damagingEntity;
        const hurt = event.hurtEntity;

        const hurtSave = heldenSave.player[hurt.name]
        const damageSave = heldenSave.player[damage?.name]

        if (damage?.typeId === 'minecraft:player' && hurt.typeId === 'minecraft:player') {

            if (damageSave?.combatlog === 'xxx') {
                sendMessage(`Du hast §l${hurt.name}§r angegriffen`, { name: damage.name })
            }

            if (hurtSave?.combatlog === 'xxx') {
                sendMessage(`Du wurdest von §l${damage.name}§r angegriffen`, { name: hurt.name })
            }

            setCombat(damage.name, damage);
            setCombat(hurt.name, hurt);
        }

        if (hurt.typeId === 'helden:dummy') {

            setCombat(hurt.nameTag, hurt)

            if (damage?.typeId === 'minecraft:player') {

                setCombat(damage.name, damage);
            }
        }

        if (hurtSave?.combatlog > 0) {

            setCombat(hurt.name, hurt);
        }
    })
})