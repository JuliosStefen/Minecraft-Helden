import { world, system } from '@minecraft/server';
import { sendMessage, setNameTag } from '../runs/run';

export function hearth(senders, select, hearth) {

    system.run(() => {

        const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
        const playerSave = heldenSave.player[select]
        const sender = senders.sourceEntity;
        const setts = heldenSave.settings;

        if (setts?.linkhearth === false && hearth === 1) {

            sendMessage('§cLinkhearths sind deaktiviert', { name: sender.name });
            return;
        }

        if (hearth === undefined) {

            if (playerSave?.hearth !== undefined) {

                sendMessage(`§6${select}§r hat §6${playerSave.hearth}§r Herzen`, { name: sender.name });

            } else {

                sendMessage(`§6${select} §rexestiert nicht`, { name: sender.name });
            }
        }

        if (hearth >= 0 && hearth <= 4) {

            if (playerSave?.hearth !== undefined) {

                sendMessage(`Die Herzen von §6${select}§r wurden auf §6${hearth}§r gesetzt`, { name: sender.name });

                playerSave.hearth = hearth
                world.setDynamicProperty('heldenSave', JSON.stringify(heldenSave));

                setNameTag(select);

            } else {

                sendMessage(`§6${select} §rexestiert nicht`, { name: sender.name });
            }

        } else if (hearth) {

            sendMessage('§cEs sind nur die Zahlen von 0 - 4 Erlaubt', { name: sender.name })
        }
    })
}