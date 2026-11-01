import { setNameTag, randomPartner } from '../../runs/run';
import { resumeArmorLock } from '../../runs/armorLock';
import { world, system } from '@minecraft/server';
import { setPartner } from '../../function/setPartner';
import { spawnDummy } from './spawnDummy';
import { heldenSave } from '../../function/heldenSave';
import { stopDeath } from '../../function/deathAnimation';
import { maxHeart } from '../../function/heart';
import { synDummy } from './synDummy';

world.afterEvents.playerSpawn.subscribe(({ initialSpawn, player }) => {

    const playerSave = heldenSave().player[player.name] ??= {}

    resumeArmorLock(player.name)
    stopDeath(player);

    if (playerSave?.banbydeath == false && playerSave.heart <= 0) player.setGameMode('Spectator');

    if (initialSpawn) {

        if (playerSave?.partner == undefined) randomPartner[player.name] = player.name

        if (!playerSave?.combatlog) player.removeTag('in_combat');

        playerSave.heart ??= maxHeart().def

        setNameTag(player.name);
        synDummy(player);

        player.sendMessage({ translate: 'helden.helden.willkommen' });

        const spielerjoin = {
            "ArianXo12": "helden.spawnLeave.joinArianXo12",
            "JuliosStefen": "helden.spawnLeave.joinJuliosstefen",
            "Lionkracher23": "helden.spawnLeave.joinLionkracher23"
        }

        const nachrichtKey = spielerjoin[player.name]

        if (nachrichtKey) world.sendMessage({ translate: nachrichtKey })
    }
})

export let inventory = {}

world.beforeEvents.playerLeave.subscribe(({ player }) => {

    const playerSave = heldenSave().player[player.name]

    stopDeath(player, true);

    if (world.getPlayers().length <= 2) {

        const loadLinks = system.runInterval(() => {

            const linkLength = Object.values(randomPartner).length

            if (linkLength >= 2) {

                const partner1 = Object.values(randomPartner)[Math.floor(Math.random() * linkLength)]
                const partner2 = Object.values(randomPartner)[Math.floor(Math.random() * linkLength)]

                if (partner1 !== partner2) {

                    setPartner(partner1, partner2);

                    delete randomPartner[partner1]
                    delete randomPartner[partner2]
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