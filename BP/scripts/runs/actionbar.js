import { sendMessage, playerLimit } from './run';
import { headhuntStatusText, headhuntBonusHerz } from '../function/headhunt';
import { heldenSave } from '../function/heldenSave';
import { world, system } from '@minecraft/server';
import { aktiveDuel } from '../function/duel';
import { cLength } from '../function/cLength';

system.runInterval(() => {

    world.getPlayers().forEach(player => {

        const playerSave = heldenSave().player?.[player.name]
        const setts = heldenSave().settings

        if (playerSave) {

            const screen = player.onScreenDisplay
            const combat = (playerSave?.combatlog - Date.now()) / 1000

            if (combat <= 0.500) {

                sendMessage('helden.actionbar.combatEnd', { name: player.name })

                delete playerSave.combatlog
                delete playerLimit[player.name]
            }

            if (combat >= 0.500) {

                screen.setActionBar({ translate: 'helden.actionbar.combatScreen', with: [`${Math.floor(combat)}`] })

            } else {

                let health;

                const c = heldenSave().settings?.heartColor ?? 0
                let h = playerSave.heart - 2

                const h1 = String.fromCharCode(0xE200 + c * 16 + 3);
                const h2 = String.fromCharCode(0xE200 + c * 16 + 2);

                const imDuell = setts?.loastHeart == false || aktiveDuel[player.name]

                if (imDuell) h += 3

                if (playerSave.heart >= 2 && playerSave.heart <= 5 && setts?.headhunt) {

                    let cent = 0;

                    const status = headhuntStatusText(player.name, setts?.showHeadhunt)

                    const farbigesHerz = String.fromCharCode(0xE308 + c * 16)
                    const grauesHerz = '\uE307'

                    const hReihe = Math.min(playerSave.heart, 4) - 2

                    const herzenHeadhunt = farbigesHerz.repeat(hReihe + 1) + grauesHerz.repeat(2 - hReihe)
                    const oben = headhuntStatusText(player.name, setts?.showHeadhunt) || headhuntBonusHerz(player.name, c)

                    if (cLength(status) >= 27) {

                        cent = cLength(status)
                        cent -= 26
                        cent = cent / 3
                    }

                    health = `\n§d${oben}§r\n${' '.repeat(cent / 2)}${herzenHeadhunt}`

                } else if (playerSave.heart >= 2) {

                    health = `\n${String.fromCharCode(0xE300 + c * 16 + h)}`
                }

                if (playerSave.heart === 1) { health = `${h1} §b${playerSave?.linkheart || '§cKein Link'} ${h2}` }
                if (playerSave.heart <= 0) { health = `\n\uE205\uE204` }

                screen.setActionBar(`\n\n${health}`);
            }
        }
    })
}, 5)
