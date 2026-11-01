import { playerLimit, sendMessage } from '../runs/run';
import { heldenSave } from '../function/heldenSave';
import { world } from '@minecraft/server';

world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {

    const playerSave = heldenSave().player[player.name];
    const setts = heldenSave().settings

    if (playerSave?.combatlog >= 0) {

        if (block?.typeId === 'minecraft:web' && (setts?.web_limitEna == undefined || setts?.web_limitEna)) {

            playerLimit[player.name] ??= {}

            playerLimit[player.name]['web'] ??= setts?.web_limit ?? 64
            playerLimit[player.name]['web']--

            sendMessage('helden.InteractPlace.cobwebLeft', { name: player.name, withs: [playerLimit[player.name]['web']] });
        }
    }
});

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {

    const player = event.player
    const blockId = event.block.typeId
    const itemStack = event.itemStack

    const setts = heldenSave().settings
    const playerSave = heldenSave().player[player.name];

    if (itemStack?.typeId === 'minecraft:web' && (setts?.web_limitEna == undefined || setts?.web_limitEna)) {

        if (playerSave?.combatlog >= 0) {

            if (playerLimit[player.name]) {

                if (playerLimit[player.name]['web'] <= 0) {

                    sendMessage('helden.InteractPlace.noCobwebLeft', { name: player.name })
                    event.cancel = true;
                }
            }
        }
    }

    if ((setts?.blockChest === undefined || setts.blockChest) && (
        blockId == 'minecraft:barrel' ||
        blockId == 'minecraft:copper_chest' ||
        blockId == 'minecraft:exposed_copper_chest' ||
        blockId == 'minecraft:oxidized_copper_chest' ||
        blockId == 'minecraft:waxed_copper_chest' ||
        blockId == 'minecraft:waxed_exposed_copper_chest' ||
        blockId == 'minecraft:waxed_oxidized_copper_chest' ||
        blockId == 'minecraft:waxed_weathered_copper_chest' ||
        blockId == 'minecraft:weathered_copper_chest' ||
        blockId == 'minecraft:chest' ||
        blockId == 'minecraft:trapped_chest' ||
        blockId == 'minecraft:ender_chest')) {

        if (playerSave?.combatlog >= 0) {

            sendMessage('helden.ItemBlock.noChestInCombat', { name: player.name })
            event.cancel = true;
        }
    }
})