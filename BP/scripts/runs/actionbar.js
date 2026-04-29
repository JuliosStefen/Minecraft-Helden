import { world, system } from '@minecraft/server';
import { installSave } from './install';
import { sendMessage } from './run';

system.runInterval(() => {

    if (!world.getDynamicProperty('heldenSave')) {

        installSave()
        return;
    }

    const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));

    for (const player of world.getPlayers()) {

        const playerSave = heldenSave.player?.[player.name]

        if (playerSave) {

            const combat = (playerSave?.combatlog - Date.now()) / 1000

            if (combat <= 0.500) {
                sendMessage('Du bist wider sicher, der Kampf ist vorbei.', { name: player.name })
                playerSave.combatlog = 'xxx';
                world.setDynamicProperty('heldenSave', JSON.stringify(heldenSave));
            }

            if (combat >= 0.500) {

                player.runCommand(`title @s actionbar §cIm Kampf! §i(${Math.floor(combat)}s übrig)`);

            } else {

                let health;

                const c = heldenSave.settings?.hearthColor ?? 0
                const h = playerSave.hearth - 2

                if (playerSave.hearth >= 2) { health = `\n${String.fromCharCode(0xE300 + c * 16 + h)}` }
                if (playerSave.hearth === 1) { health = `\uE203 §b${playerSave?.linkhearth ?? '§cKein Link'} \uE202` }
                if (playerSave.hearth <= 0) { health = `\n\uE205\uE204` }

                player.runCommand(`titleraw @s actionbar {"rawtext":[{"text":"\n\n${health}"}]}`);
            }
        }
    }
}, 5)