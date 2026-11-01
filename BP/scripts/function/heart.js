import { randomPartner, setNameTag, banReason } from '../runs/run';
import { world, system } from '@minecraft/server';
import { setPartner } from './setPartner';
import { heldenSave } from './heldenSave';

function generatePartner(name) {

    const linkLength = Object.values(randomPartner).length

    if (linkLength >= 2) {

        const partner = Object.values(randomPartner)[Math.floor(Math.random() * linkLength)]

        if (partner !== name) {

            delete randomPartner[partner]
            setPartner(name, partner);

        } else {

            system.run(() => generatePartner(name))
        }
    }
}

export function setHeart(name, heart) {

    const playerSave = heldenSave().player[name]
    const setts = heldenSave().settings

    if (heart <= 0) {

        if (playerSave?.banbydeath == false) {

            world.getDimension('overworld').runCommand(`gamemode spectator "${name}"`);

        } else world.getDimension('overworld').runCommand(`kick "${name}" ${banReason}`);
    }

    if (setts?.heartMode == 1) {

        if (heart == 1) generatePartner(name);

        if (playerSave.heart === 1 && heart === 0 && playerSave?.partner) {

            const partnerName = playerSave.partner
            const partnerSave = heldenSave().player[partnerName]

            system.run(() => setHeart(partnerName, (partnerSave.heart - 1)))
        }
    }

    if (setts?.showHeadhunt &&
        setts?.heartMode == 2 &&
        playerSave?.partner == undefined) {

        generatePartner(name)
    }

    if (playerSave.heart >= 0) {

        playerSave.heart = heart
        setNameTag(name)
    }
}

export function maxHeart(config) {

    switch (config ?? heldenSave().settings?.heartMode) {

        case 0: return { def: 3, max: 3, min: 1 };
        case 1: return { def: 4, max: 4, min: 2 };
        case 2: return { def: 3, max: 4, min: 1 };
        default: return { def: 3, max: 4, min: 1 };
    }
}