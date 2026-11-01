import { heldenSave } from '../function/heldenSave';
import { randomPartner } from '../runs/run';

export function setPartner(player, partner) {

    const partnerSave = heldenSave().player?.[partner] ?? {}
    const playerSave = heldenSave().player?.[player] ?? {}

    if (!partnerSave?.partner && !partnerSave?.partner) {

        playerSave.partner = partner
        partnerSave.partner = player

        delete randomPartner[partner]
        delete randomPartner[player]
    }
} 