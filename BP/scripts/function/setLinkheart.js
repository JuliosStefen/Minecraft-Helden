import { installPlayer } from '../runs/install'
import { heldenSave } from '../function/heldenSave';
import { system } from '@minecraft/server'

export function setLinkheart(player, partner) {

    system.run(() => {

        heldenSave().player[partner] ??= {}
        heldenSave().player[player] ??= {}

        const partnerSave = heldenSave().player?.[partner]
        const playerSave = heldenSave().player?.[player]

        if (!partnerSave?.linkheart && !partnerSave?.linkheart) {

            playerSave.linkheart = partner
            partnerSave.linkheart = player

            installPlayer(partner);
            installPlayer(player);
        }
    })
} 