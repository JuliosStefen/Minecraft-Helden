import { world, system } from '@minecraft/server';
import { setLinkHearth, sendMessage } from '../runs/run'

export function linkhearth(senders, player, partner) {

    system.run(() => {

        const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
        const sender = senders.sourceEntity

        const partnerSave = heldenSave.player?.[partner]
        const playerSave = heldenSave.player?.[player]

        if (partner !== 'true' && partner !== 'false') {

            if (!partnerSave?.linkhearth && !playerSave?.linkhearth) {

                setLinkHearth(player, partner);
                sendMessage(`§6${player}§r wurde mit §6${partner}§r verlinkt`, sender.name);

            } else {

                if (partnerSave?.linkhearth && playerSave?.linkhearth) {

                    sendMessage(`§6${player}§r und §6${partner}§r haben bereits ein Linkhearth`, sender.name);
                    return;
                }

                if (partnerSave?.linkhearth) {

                    sendMessage(`§6${partner}§r hat bereits ein Linkhearth`, sender.name);
                    return;
                }

                if (playerSave?.linkhearth) {

                    sendMessage(`§6${player}§r hat bereits ein Linkhearth`, sender.name);
                    return;
                }
            }

        } else {

            if (playerSave) {

            } else {

                sendMessage(`§6${player}§r exestiert nicht`, sender.name);
            }
        }
    })
}