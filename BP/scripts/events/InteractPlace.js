import { world } from '@minecraft/server';
import { playerLimit, sendMessage } from '../runs/run';

world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {

    const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
    const playerSave = heldenSave.player[player.name];
    const setts = heldenSave.settings

    if (playerSave.combatlog >= 0) {

        if (block?.typeId === 'minecraft:web' && (setts?.web_limitEna === undefined || setts?.web_limitEna)) {

            playerLimit[player.name] ??= {}

            playerLimit[player.name]['web'] ??= setts?.web_limit ?? 64
            playerLimit[player.name]['web']--

            sendMessage(`§7Spinnennetze übrig: §b${playerLimit[player.name]['web']}`, { name: player.name });
        }
    }
});

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {

    const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
    const setts = heldenSave.settings

    const player = event.player
    const block = event.itemStack

    const playerSave = heldenSave.player[player.name];

    if (block?.typeId === 'minecraft:web' && (setts?.web_limitEna === undefined || setts?.web_limitEna)) {

        if (playerSave.combatlog >= 0) {

            if (playerLimit[player.name]) {

                if (playerLimit[player.name]['web'] <= 0) {

                    sendMessage('§cKeine Enderperlen mehr übrig!', { name: player.name })
                    event.cancel = true;
                }
            }
        }
    }
})