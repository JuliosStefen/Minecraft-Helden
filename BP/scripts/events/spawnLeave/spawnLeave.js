import { world, system } from '@minecraft/server';

import { stopDeath } from '../../function/deathAnimation';
import { installPlayer } from '../../runs/install';
import { setNameTag } from '../../runs/run';
import { spawnDummy } from './spawnDummy';
import { synDummy } from './synDummy';

world.afterEvents.playerSpawn.subscribe(({ initialSpawn, player }) => {

    system.run(() => {

        stopDeath(player);

        if (initialSpawn) {

            installPlayer(player.name);
            setNameTag(player.name);
            synDummy(player);

            player.sendMessage(`§bWillkommen bei Minecraft §lHelden!§r
        
§ivon JuliosStefen & Arian
§6Bugs Melden: §1https://discord.gg/vSf4WSQRfm`);

            player.sendMessage(`\n§l§6!!! §cAchtung §6!!!§r\n§cDiese Version befindet sich noch in der entwicklung und kann fehler enthalten. Diese Version sollte nur zum testen verwendet werden und nicht für öffentliche Projekte!`)
        }
    })
})

export let inventory = {}

world.beforeEvents.playerLeave.subscribe(({ player }) => {

    const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
    const playerSave = heldenSave.player[player.name]

    inventory[player.name] = []

    if (playerSave?.combatlog >= 0) {

        for (let s = 0; s <= 35; s++) {
            const item = player.getComponent('inventory').container.getItem(s);

            if (!item) {
                inventory[player.name].push('none')
            } else {
                inventory[player.name].push(item);
            }
        }

        const equipp = player.getComponent('equippable');

        function addSlot(select) {

            const slot = equipp?.getEquipment(select) ?? 'none';
            inventory[player.name].push(slot);
        }

        addSlot('Head');
        addSlot('Chest');
        addSlot('Legs');
        addSlot('Feet');
        addSlot('Offhand');

        const health = player.getComponent('health').currentValue
        const dimension = player.dimension

        const rx = player.getRotation().x
        const ry = player.getRotation().y

        const name = player.name

        const x = player.location.x
        const y = player.location.y
        const z = player.location.z

        spawnDummy(health, dimension, rx, ry, name, x, y, z);
    }
})