import { playerLimit, sendMessage } from '../runs/run';
import { world, system } from '@minecraft/server';
import { heldenSave } from '../function/heldenSave';

const cooldown = {}

world.beforeEvents.itemUse.subscribe((event) => {

    const setts = heldenSave().settings

    const itemStack = event.itemStack
    const source = event.source

    if (source.typeId === 'minecraft:player') {

        const playerSave = heldenSave().player[source.name];

        if ((setts?.blockTrident === undefined || setts.blockTrident) && playerSave?.combatlog >= 0) {

            if (itemStack.typeId === 'minecraft:trident' && source.typeId === 'minecraft:player') {

                for (const enchantment of itemStack.getComponent('enchantable').getEnchantments()) {

                    if (enchantment.type.id === 'riptide') event.cancel = true;
                }
            }
        }

        if (itemStack.typeId === 'helden:soul_amulet') {

            const playerSave = heldenSave().player[source.name]

            if (playerSave.heart < 4) {

                system.run(() => {

                    const { x, y, z } = source.location

                    world.gameRules.sendCommandFeedback = false;

                    source.runCommand('clear @s helden:soul_amulet 0 1');
                    source.runCommand('give @s helden:broken_soul_amulet');

                    world.gameRules.sendCommandFeedback = true;

                    source.spawnParticle('helden:heart_plus', { x, y: y + 1, z })

                    source.playSound('shriek.sculk_shrieker');
                    source.playSound('random.glass');

                    playerSave.heart++
                })
            }
        }

        if (itemStack.typeId === 'helden:broken_soul_amulet') {

            const playerSave = heldenSave().player[source.name]

            if (playerSave.heart > 2) {

                system.run(() => {

                    const { x, y, z } = source.location

                    world.gameRules.sendCommandFeedback = false;

                    source.runCommand('clear @s helden:broken_soul_amulet 0 1');
                    source.runCommand('give @s helden:soul_amulet');

                    world.gameRules.sendCommandFeedback = true;

                    source.spawnParticle('helden:heart_minus', { x, y: y + 1, z })

                    source.playSound('shriek.sculk_shrieker');

                    playerSave.heart--
                })
            }
        }

        if (itemStack?.typeId === 'minecraft:ender_pearl' && (setts?.pearl_limitEna === undefined || setts?.pearl_limitEna)) {

            if (playerSave?.combatlog >= 0) {

                playerLimit[source.name] ??= {}

                playerLimit[source.name]['pearl'] ??= setts?.pearl_limit ?? 16;

                cooldown[source.name] ??= (Date.now() - 1000);

                if (Date.now() - cooldown[source.name] < 1000) {

                    event.cancel = true;
                    return;
                }

                if (playerLimit[source.name]['pearl'] <= 0) {

                    sendMessage('helden.ItemUse.noCobwebLeft', { name: source.name })
                    event.cancel = true;
                }

                if (playerLimit[source.name]['pearl'] > 0) {

                    cooldown[source.name] = Date.now();
                    playerLimit[source.name]['pearl']--

                    sendMessage('helden.ItemUse.cobwebLeft', { name: source.name, withs: [playerLimit[source.name]['pearl']] });
                }
            }
        }
    }
});