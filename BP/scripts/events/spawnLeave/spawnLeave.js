import { setNameTag, randomLink } from '../../runs/run';
import { world, system } from '@minecraft/server';
import { installPlayer } from '../../runs/install';
import { setLinkheart } from '../../function/setLinkheart';
import { spawnDummy } from './spawnDummy';
import { heldenSave } from '../../function/heldenSave';
import { stopDeath } from '../../function/deathAnimation';
import { synDummy } from './synDummy';

world.afterEvents.playerSpawn.subscribe(({ initialSpawn, player }) => {

    system.run(() => {

        stopDeath(player);

        const playerSave = heldenSave().player[player.name]

        if (playerSave?.banbydeath == false && playerSave.heart <= 0) {

            player.setGameMode('Spectator');
        }

        if (initialSpawn) {

            installPlayer(player.name);
            setNameTag(player.name);
            synDummy(player);

            if (playerSave?.linkheart == undefined) {

                randomLink[player.name] = player.name
            }

            player.sendMessage({ translate: 'helden.helden.willkommen' });
        }
    })
})

export let inventory = {}

world.beforeEvents.playerLeave.subscribe(({ player }) => {

    const playerSave = heldenSave().player[player.name]

    stopDeath(player, true);

    if (world.getPlayers().length <= 2) {

        const loadLinks = system.runInterval(() => {

            const linkLength = Object.values(randomLink).length

            if (linkLength >= 2) {

                const partner1 = Object.values(randomLink)[Math.floor(Math.random() * linkLength)]
                const partner2 = Object.values(randomLink)[Math.floor(Math.random() * linkLength)]

                if (partner1 !== partner2) {

                    setLinkheart(partner1, partner2);

                    delete randomLink[partner1]
                    delete randomLink[partner2]
                }

            } else {

                system.clearRun(loadLinks)
            }
        })
    }

    if (playerSave?.combatlog >= 0) {

        inventory[player.name] = []

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