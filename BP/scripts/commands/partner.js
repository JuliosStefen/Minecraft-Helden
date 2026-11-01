import { sendMessage, randomPartner } from '../runs/run';
import { setPartner } from '../function/setPartner';
import { heldenSave } from '../function/heldenSave';
import { system } from '@minecraft/server';

export function partner(senders, option, player, partner) {

    system.run(() => {

        const sender = senders.sourceEntity

        const partnerSave = heldenSave().player?.[partner]
        const playerSave = heldenSave().player?.[player]

        switch (option) {

            case 'add': {

                if (partner == undefined) {

                    sendMessage('helden.partner.twoNamesNeed', { name: sender.name });
                    return;
                }

                if (partnerSave?.partner && playerSave?.partner) {

                    sendMessage('helden.partner.haveLink', { name: sender.name, withs: [player, partner] });
                    return;
                }

                if (partnerSave?.partner) {

                    sendMessage('helden.partner.haveLink1', { name: sender.name, withs: [partner] });
                    return;
                }

                if (playerSave?.partner) {

                    sendMessage('helden.partner.haveLink1', { name: sender.name, withs: [player] });
                    return;
                }

                if (!partnerSave?.partner && !playerSave?.partner) {

                    setPartner(player, partner);
                    sendMessage('helden.partner.linkedNames', { name: sender.name, withs: [player, partner] });
                }

                break;
            }

            case 'remove': {

                const rPartner = heldenSave().player[player]?.partner
                const rSave = heldenSave().player[rPartner]

                if (rSave?.partner && playerSave?.partner) {

                    sendMessage('helden.partner.linkRemove', { name: sender.name, withs: [player, partner] });

                    randomPartner[rPartner] = rPartner
                    randomPartner[player] = player

                    delete heldenSave().player[rPartner].partner
                    delete heldenSave().player[player].partner

                } else {

                    sendMessage('helden.partner.neverLinked', { name: sender.name, withs: [player, partner] })
                }

                break;
            }

            case 'enabled': {

                if (playerSave?.partner == false) {

                    sendMessage('helden.partner.enabled', { name: sender.name, withs: [player] });

                    delete heldenSave().player[player].partner
                    randomPartner[player] = player

                } else {

                    sendMessage('helden.partner.noEnabled', { name: sender.name, withs: [player] });
                }

                break;
            }

            case 'disanabled': {

                if (playerSave?.partner == undefined) {

                    sendMessage('helden.partner.disanabled', { name: sender.name, withs: [player] });

                    heldenSave().player[player].partner = false
                    delete randomPartner[player]

                } else {

                    sendMessage('helden.partner.noDisanabled', { name: sender.name, withs: [player] });
                }

                break;
            }

            case 'get': {

                const lPartner = heldenSave().player[player].partner

                if (playerSave?.partner == undefined) {

                    sendMessage('helden.partner.noLink', { name: sender.name, withs: [player] });
                    return;
                }

                if (playerSave?.partner == false) {

                    sendMessage('helden.partner.linkNoEnabled', { name: sender.name, withs: [player] });
                    return;
                }

                sendMessage('helden.partner.linkedWhite', { name: sender.name, withs: [player, lPartner] });
                break;
            }

            default: sendMessage('helden.helden.noOption', { name: sender.name, withs: [option] });
        }
    })
}