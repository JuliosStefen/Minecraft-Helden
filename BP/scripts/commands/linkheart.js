import { sendMessage, randomLink } from '../runs/run';
import { setLinkheart } from '../function/setLinkheart';
import { heldenSave } from '../function/heldenSave';
import { system } from '@minecraft/server';

export function linkheart(senders, option, player, partner) {

    system.run(() => {

        const sender = senders.sourceEntity

        const partnerSave = heldenSave().player?.[partner]
        const playerSave = heldenSave().player?.[player]

        switch (option) {

            case 'add': {

                if (partner == undefined) {

                    sendMessage('helden.linkheart.twoNamesNeed', { name: sender.name });
                    return;
                }

                if (!partnerSave?.linkheart && !playerSave?.linkheart) {

                    setLinkheart(player, partner);
                    sendMessage('helden.linkheart.linkedNames', { name: sender.name, withs: [player, partner] });

                } else {

                    if (partnerSave?.linkheart && playerSave?.linkheart) {

                        sendMessage('helden.linkheart.haveLink', { name: sender.name, withs: [player, partner] });
                        return;
                    }

                    if (partnerSave?.linkheart) {

                        sendMessage('helden.linkheart.haveLink1', { name: sender.name, withs: [partner] });
                        return;
                    }

                    if (playerSave?.linkheart) {

                        sendMessage('helden.linkheart.haveLink1', { name: sender.name, withs: [player] });
                        return;
                    }
                }

                break;
            }

            case 'remove': {

                const rPartner = heldenSave().player[player].linkheart
                const rSave = heldenSave().player[rPartner]

                if (rSave?.linkheart && playerSave?.linkheart) {

                    sendMessage('helden.linkheart.linkRemove', { name: sender.name, withs: [player, partner] });

                    randomLink[rPartner] = rPartner
                    randomLink[player] = player

                    delete heldenSave().player[rPartner].linkheart
                    delete heldenSave().player[player].linkheart

                } else {

                    sendMessage('helden.linkheart.neverLinked', { name: sender.name, withs: [player, partner] })
                }

                break;
            }

            case 'enabled': {

                if (playerSave?.linkheart == false) {

                    sendMessage('helden.linkheart.enabled', { name: sender.name, withs: [player] });

                    delete heldenSave().player[player].linkheart
                    randomLink[player] = player

                } else {

                    sendMessage('helden.linkheart.noEnabled', { name: sender.name, withs: [player] });
                }

                break;
            }

            case 'disanabled': {

                if (playerSave?.linkheart == undefined) {

                    sendMessage('helden.linkheart.disanabled', { name: sender.name, withs: [player] });

                    heldenSave().player[player].linkheart = false
                    delete randomLink[player]

                } else {

                    sendMessage('helden.linkheart.noDisanabled', { name: sender.name, withs: [player] });
                }

                break;
            }

            case 'list': {

                const lPartner = heldenSave().player[player].linkheart

                if (playerSave?.linkheart == undefined) {

                    sendMessage('helden.linkheart.noLink', { name: sender.name, withs: [player] });
                    return;
                }

                if (playerSave?.linkheart == false) {

                    sendMessage('helden.linkheart.linkNoEnabled', { name: sender.name, withs: [player] });
                    return;
                }

                sendMessage('helden.linkheart.linkedWhite', { name: sender.name, withs: [player, lPartner] });
                break;
            }

            default: sendMessage('helden.helden.noOption', { name: sender.name, withs: [option] });
        }
    })
}