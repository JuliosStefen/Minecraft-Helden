import { world, system } from '@minecraft/server';
import { setNameTag } from '../runs/run';

world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {

    system.run(() => {

        if (deadEntity.typeId === 'minecraft:player') {

            const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
            const deadSave = heldenSave.player[deadEntity.name]
            const setts = heldenSave.settings

            const damager = damageSource.damagingEntity

            function removeHearth(player) {

                const playerSave = heldenSave.player[player.name]

                if (playerSave?.hearth >= 0) {

                    for (let i = 1; i <= 72; i++) {

                        system.runTimeout(() => {

                            player.runCommand(`title @a times 0 0 0`);
                            player.runCommand('camera @s fade time 0 0.25 1 color 0 0 0');
                            player.runCommand(`title @s title !animate.death.${i}`);
                        }, i * 0.2);
                    }

                    system.runTimeout(() => {

                        player.runCommand(`title @a times 0 0 0`);
                        player.runCommand(`title @s title clear`);
                    }, (73) * 0.2);

                    if (playerSave.hearth === 1 && playerSave?.linkhearth && (setts?.linkhearth === undefined || setts?.linkhearth)) {

                        const partner = heldenSave.player[playerSave.linkhearth]

                        if (partner.hearth > 0) {

                            partner.hearth = (partner.hearth - 1)
                            partner.combatlog = 'xxx'
                        }
                    }

                    if (playerSave.hearth > 0) {

                        if (!setts?.linkhearth && playerSave.hearth === 2) { playerSave.hearth = (playerSave.hearth - 1) }

                        playerSave.hearth = (playerSave.hearth - 1)
                        playerSave.combatlog = 'xxx'
                    }

                    world.setDynamicProperty('heldenSave', JSON.stringify(heldenSave));

                    setNameTag(player.name);
                }
            }

            if (deadSave?.combatlog >= 0.500) {

                removeHearth(deadEntity);
                return;
            }

            if (damager.typeId === 'minecraft:player') {

                removeHearth(deadEntity);
                return;
            }
        }
    })
})