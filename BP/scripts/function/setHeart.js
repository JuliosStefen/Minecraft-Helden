import { randomLink, setNameTag, banReason } from '../runs/run';
import { world, system } from '@minecraft/server';
import { setLinkheart } from './setLinkheart';
import { heldenSave } from './heldenSave';

export function setHeart(name, hearts) {

    const playerSave = heldenSave().player[name]
    const setts = heldenSave().settings

    let heart = hearts

    if (setts?.linkheart == false && hearts == 1) { heart-- }

    if (heart <= 0) {

        if (playerSave?.banbydeath == false) {

            world.getDimension('overworld').runCommand(`gamemode spectator "${name}"`);
        } else {
            world.getDimension('overworld').runCommand(`kick "${name}" ${banReason}`);
        }
    }

    if (heart >= 0 && heart <= 4) {

        if (setts?.linkheart === undefined || setts?.linkheart) {

            if (heart == 1) {

                generateLink();

                function generateLink() {

                    const linkLength = Object.values(randomLink).length

                    if (linkLength >= 2) {

                        const partner = Object.values(randomLink)[Math.floor(Math.random() * linkLength)]

                        if (partner !== name) {

                            delete randomLink[partner]
                            setLinkheart(name, partner);

                        } else {

                            system.run(() => { generateLink() })
                        }
                    }
                }
            }

            if (playerSave.heart === 1 && heart === 0 && playerSave?.linkheart) {

                const linkName = playerSave.linkheart
                const partnerSave = heldenSave().player[linkName]

                system.run(() => { setHeart(linkName, (partnerSave.heart - 1)) })
            }
        }

        if (playerSave.heart >= 0) {

            playerSave.heart = heart
            setNameTag(name)
        }
    }
}