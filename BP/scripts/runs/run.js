import { world, system } from '@minecraft/server';
import { installSave } from './install.js';
import { heldenSave } from '../function/heldenSave';

import '../commands/registry';
import '../events/event';
import './actionbar';

installSave();

system.run(() => {

    const setts = heldenSave().settings

    world.gameRules.showDeathMessages = false;

    if (setts.debug == true) {

        world.sendMessage(`§l§6Temp: §r§a${JSON.stringify(heldenSave())}\n\n`);
        world.sendMessage(`§l§6Save: §r§a${world.getDynamicProperty('heldenSave')}\n\n`);
    }

    world.getPlayers().forEach((player) => {

        const playerSave = heldenSave().player[player.name]

        if (playerSave?.linkheart == undefined) {

            randomLink[player.name] = player.name
        }
    })
})

export let playerLimit = {}, randomLink = {}

export const banReason = '§l[§bMCHelden§r§l]§r\n\nDu hast alle Herzen verloren und bist damit aus dem\nProjekt §l§causgeschieden!'

export function sendMessage(translate, { withs = [], name } = {}) {

    system.run(() => {

        let withss = []

        for (const one of withs) { withss.push(String(one)) }

        const message = { rawtext: [{ text: '[§bHelden§r] ' }, { translate, with: withss }] }

        if (name === undefined) {

            world.sendMessage(message);

        } else {

            for (const player of world.getPlayers().filter((p) => p.name === name)) {

                player.sendMessage(message);
            }
        }
    })
}

export function loadId(nr = 15) {

    let id = '';

    const wert = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789';

    for (let s = 0; s <= nr; s++) {

        id += wert[Math.round(Math.random() * wert.length)];
    }

    return id;
}

export function lockArmor(name, mode) {

    world.getPlayers().forEach(player => {

        if (player.name === name) {

            const equippable = player.getComponent('equippable')

            const head = equippable.getEquipment('Head');
            const chest = equippable.getEquipment('Chest');
            const legs = equippable.getEquipment('Legs');
            const feet = equippable.getEquipment('Feet');

            function setSlot(slot, item) {

                if (item) {

                    item.clone();
                    item.lockMode = mode
                    player.getComponent('equippable').setEquipment(slot, item);
                }
            }

            setSlot('Head', head);
            setSlot('Chest', chest);
            setSlot('Legs', legs);
            setSlot('Feet', feet);
        }
    })
}

export function setNameTag(name) {

    system.run(() => {

        const playerSave = heldenSave().player[name]
        const setts = heldenSave().settings

        const c = setts?.heartColor ?? 0

        const h1 = String.fromCharCode(0xE200 + c * 16 + 3);
        const h2 = String.fromCharCode(0xE200 + c * 16 + 2);

        const show = String.fromCharCode(0xE200 + c * 16);
        const hide = String.fromCharCode(0xE201);

        for (const player of world.getPlayers().filter(r => r.name === name)) {

            if (!setts?.showOtherheart) {

                player.nameTag = player.name

            } else if (setts?.showOtherheart) {

                let nameTag;
                const linkheart = playerSave?.linkheart ?? '§cKein link'

                switch (playerSave.heart) {
                    case 4: {
                        nameTag = show + show + show
                        break;
                    }
                    case 3: {
                        nameTag = show + show + hide
                        break;
                    }
                    case 2: {
                        nameTag = show + hide + hide
                        break;
                    }
                    case 1: {
                        nameTag = `${h1} ${linkheart} ${h2}`
                        break;
                    }
                    case 0: {
                        nameTag = '\uE205\uE204'
                        break;
                    }
                }

                player.nameTag = `${player.name}\n${nameTag}`
            }
        }
    })
}