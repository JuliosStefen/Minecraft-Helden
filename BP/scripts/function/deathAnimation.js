import { system } from '@minecraft/server';

let ani = []

export function playDeath(player) {

    ani[player.name] = {}

    for (let i = 1; i <= 72; i++) {

        ani[player.name][i] = system.runTimeout(() => {

            player.runCommand(`title @a times 0 0 0`);
            player.runCommand('camera @s fade time 0 0.25 1 color 0 0 0');
            player.runCommand(`title @s title !animate.death.${i}`);

        }, i * 20);
    }

    ani[player.name][73] = system.runTimeout(() => {

        stopDeath(player);
    }, (73) * 20);
}

export function stopDeath(player) {

    for (let i = 1; i <= 73; i++) {

        if (ani[player.name]?.[i]) {

            system.clearRun(ani[player.name][i]);
        }
    }

    system.run(() => {

        player.runCommand('camera @s clear');
        player.runCommand(`title @a times 0 0 0`);
        player.runCommand(`title @s title clear`);
    })
}