import { sendMessage, playerLimit } from './run';
import { world, system } from '@minecraft/server';
import { heldenSave } from '../function/heldenSave';
import { aktiveDuel } from '../function/duel';
import { cLength } from '../function/cLength';

system.runInterval(() => world.getPlayers().forEach(player => {

    const playerSave = heldenSave().player[player.name]
    const setts = heldenSave().settings

    const screen = player.onScreenDisplay
    const combat = (playerSave?.combatlog - Date.now()) / 1000

    if (combat <= 0.500) {

        sendMessage('helden.actionbar.combatEnd', { name: player.name })

        player.removeTag('in_combat');

        delete playerSave.lastAttacker
        delete playerSave.combatlog
        delete playerLimit[player.name]

    } else if (combat >= 0.500) {

        screen.setActionBar({ translate: 'helden.actionbar.combatScreen', with: [`${Math.floor(combat)}`] })
    }

    if (playerSave?.combatlog == undefined) {

        const c = heldenSave().settings?.heartColor ?? 0
        let h = playerSave?.heart - 2, health

        const h1 = String.fromCharCode(0xE200 + c * 16 + 3);
        const h2 = String.fromCharCode(0xE200 + c * 16 + 2);

        const fh1 = String.fromCharCode(0xE200 + c * 16);
        const fh2 = String.fromCharCode(0xE200 + c * 16 + 1);

        if (setts?.loastHeart == false || aktiveDuel[player.name]) h += 3

        if (setts?.heartMode == 0) {

            h += 1

            health = `\n${String.fromCharCode(0xE300 + c * 16 + h)}`
        }

        if (setts?.heartMode == 1) {

            health = `\n${String.fromCharCode(0xE300 + c * 16 + h)}`

            if (playerSave.heart === 1) health = `${h1} §b${playerSave?.partner || '§cKein Link'} ${h2}`
        }

        if (setts?.heartMode == 2 || setts?.heartMode == undefined) {

            if (setts?.showHeadhunt) {

                if (playerSave?.headhunt == true) {

                    if (playerSave?.heart >= 4) health = `   \uE200\n`
                    if (playerSave?.heart <= 3) health = `   \uE201\n`

                } else {

                    if (playerSave?.headhunt == false) {

                        health = '\n'

                    } else {

                        const partner = playerSave?.partner ?? '   ??'
                        let cent = 0;

                        if (cLength(partner) >= 27) {

                            cent = cLength(partner)
                            cent -= 26
                            cent = cent / 3
                        }

                        health = `§d${partner}§r\n${' '.repeat(cent / 2)}`
                    }
                }

            } else health = `   \uE206\n`

            switch (playerSave?.heart) {

                case 1: health += `${fh1}${fh2}${fh2}`
                    break;

                case 2: health += `${fh1}${fh1}${fh2}`
                    break;

                default: if (playerSave?.heart >= 3) health += `${fh1}${fh1}${fh1}`
                    break;
            }
        }

        if (playerSave?.heart <= 0) health = `\n\uE205\uE204`

        screen.setActionBar(`\n\n${health}`);
    }

}), 5)