import { world } from '@minecraft/server';
import { playerLimit, sendMessage } from '../runs/run';

const cooldown = {}

world.beforeEvents.itemUse.subscribe((event) => {

    const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
    const setts = heldenSave.settings

    const itemStack = event.itemStack
    const source = event.source

    if (source.typeId === 'minecraft:player') {

        const playerSave = heldenSave.player[source.name];

        if ((setts?.blockTrident === undefined || setts.blockTrident) && playerSave.combatlog >= 0) {

            if (itemStack.typeId === 'minecraft:trident' && source.typeId === 'minecraft:player') {

                for (const enchantment of itemStack.getComponent('enchantable').getEnchantments()) {

                    if (enchantment.type.id === 'riptide') event.cancel = true;
                }
            }
        }

        if (itemStack?.typeId === 'minecraft:ender_pearl' && (setts?.pearl_limitEna === undefined || setts?.pearl_limitEna)) {

            if (playerSave.combatlog >= 0) {

                playerLimit[source.name] ??= {}

                playerLimit[source.name]['pearl'] ??= setts?.pearl_limit ?? 16;

                cooldown[source.name] ??= (Date.now() - 1000);

                if (Date.now() - cooldown[source.name] < 1000) {

                    event.cancel = true;
                    return;
                }

                if (playerLimit[source.name]['pearl'] <= 0) {

                    sendMessage('§cKeine Enderperlen mehr übrig!', { name: source.name })
                    event.cancel = true;
                }

                if (playerLimit[source.name]['pearl'] > 0) {

                    cooldown[source.name] = Date.now();
                    playerLimit[source.name]['pearl']--

                    sendMessage(`§7Enderperlen übrig: §b${playerLimit[source.name]['pearl']}`, { name: source.name });
                }
            }
        }
    }
});