import { world, system } from '@minecraft/server';
import { sendMessage } from '../runs/run'

world.afterEvents.entityHurt.subscribe((event) => {

    system.run(() => {

        const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
        const damage = event.damageSource.damagingEntity;
        const hurt = event.hurtEntity;

        function setCombat(player) {

            const playerSave = heldenSave.player?.[player.name]
            const hearth = player.getComponent('health').currentValue;

            let setCombat;

            if (playerSave) {

                if (playerSave.combatlog === 'xxx') {
                    sendMessage('Du wurdest angegriffen', { name: player.name })
                }

                if (hearth >= 11) {
                    setCombat = 30000
                } else if (hearth <= 10 && hearth >= 6) {
                    setCombat = 60000
                } else if (hearth <= 5) {
                    setCombat = 300000
                }

                playerSave.combatlog = Date.now() + setCombat;
                world.setDynamicProperty('heldenSave', JSON.stringify(heldenSave));
            }
        }

        if (damage?.typeId === 'minecraft:player' && hurt.typeId === 'minecraft:player') {

            setCombat(damage);
            setCombat(hurt);
        }

        const hurtSave = heldenSave.player?.[hurt.name]

        if (hurtSave?.combatlog > 0) {

            setCombat(hurt);
        }
    })
})