import { world, system } from '@minecraft/server';
import { installPlayer } from '../runs/install';
import { setNameTag } from '../runs/run';

world.afterEvents.playerSpawn.subscribe(({ initialSpawn, player }) => {

    system.run(() => {

        if (initialSpawn) {

            player.runCommand('title @s times 0 0 0');
            player.runCommand('title @s title clear');

            installPlayer(player.name);
            setNameTag(player.name);

            player.sendMessage(`§bWillkommen bei Minecraft §lHelden!§r
            
§6Von JuliosStefen & Warden1494
§cBugs melden: https://discord.gg/vSf4WSQRfm`);

            player.sendMessage(`\n§l§6!!! §cAchtung §6!!!§r\n§cDiese Version befindet sich noch in der entwicklung und kann fehler enthalten. Diese Version sollte nur zum testen verwendet werden und nicht für öffentliche Projekte!`)
        }
    })
})

world.afterEvents.playerLeave.subscribe(({ playerName }) => {

    system.run(() => {

    })
})