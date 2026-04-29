import { world, system } from '@minecraft/server';
import { installSave, installPlayer } from './install.js';

installSave();

import '../commands/registry';
import '../events/event';
import './actionbar';

export let playerLimit = {}

export function sendMessage(translate, { withs = [], name } = {}) {

    system.run(() => {

        const message = { rawtext: [{ text: '[§bHelden§r] ' }, { translate, with: [...withs] }] }

        if (name === undefined) {

            world.sendMessage(message);

        } else {

            for (const player of world.getPlayers().filter((p) => p.name === name)) {

                player.sendMessage(message);
            }
        }
    })
}

export function setLinkHearth(player, partner) {

    system.run(() => {

        const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));

        heldenSave.player[partner] ??= {}
        heldenSave.player[player] ??= {}

        const partnerSave = heldenSave.player?.[partner]
        const playerSave = heldenSave.player?.[player]

        if (!partnerSave?.linkhearth && !playerSave?.linkhearth) {

            playerSave.linkhearth = partner
            partnerSave.linkhearth = player

            world.setDynamicProperty('heldenSave', JSON.stringify(heldenSave));

            installPlayer(player)
            installPlayer(partner)
        }
    })
}

export function lockArmor(name, mode) {
    system.run(() => {
        for (const player of world.getPlayers()) {
            if (player.name === name) {

                const head = player.getComponent('equippable').getEquipment('Head');
                const chest = player.getComponent('equippable').getEquipment('Chest');
                const legs = player.getComponent('equippable').getEquipment('Legs');
                const feet = player.getComponent('equippable').getEquipment('Feet');

                function slot(slot) {
                    if (slot) {
                        slot.clone();
                        slot.lockMode = mode
                        player.getComponent('equippable').setEquipment('Head', head);
                    }
                }

                slot(head);
                slot(chest);
                slot(legs);
                slot(feet);
            }
        }
    })
}

export function setNameTag(name) {

    system.run(() => {

        const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
        const playerSave = heldenSave.player[name]
        const setts = heldenSave.settings

        for (const player of world.getPlayers().filter(r => r.name === name)) {

            if (!setts?.showOtherHearth) {

                player.nameTag = player.name

            } else if (setts?.showOtherHearth) {

                let nameTag;
                const linkhearth = playerSave?.linkhearth ?? '§cKein link'

                if (playerSave.hearth === 4) {
                    nameTag = '\uE200\uE200\uE200';
                } else if (playerSave.hearth === 3) {
                    nameTag = '\uE200\uE200\uE201';
                } else if (playerSave.hearth === 2) {
                    nameTag = '\uE200\uE201\uE201';
                } else if (playerSave.hearth === 1) {
                    nameTag = `\uE203 ${linkhearth} \uE202`;
                } else if (playerSave.hearth === 0) {
                    nameTag = '\uE205\uE204';
                }

                player.nameTag = `${player.name}\n${nameTag}`

            }
        }
    })
}