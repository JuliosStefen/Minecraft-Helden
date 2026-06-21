import { sendMessage, playerLimit } from './run';
import { heldenSave } from '../function/heldenSave';
import { world, system } from '@minecraft/server';
import { aktiveDuel } from '../function/duel';

system.runInterval(() => {

    world.getPlayers().forEach(player => {

        const playerSave = heldenSave().player?.[player.name]

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

                if (aktiveDuel[player.name]) h += 3
                if (playerSave.heart >= 2) { health = `\n${String.fromCharCode(0xE300 + c * 16 + h)}` }
                if (playerSave.heart === 1) { health = `${h1} §b${playerSave?.linkheart || '§cKein Link'} ${h2}` }
                if (playerSave.heart <= 0) { health = `\n\uE205\uE204` }

                screen.setActionBar(`\n\n${health}`);
            }
        }
    })
}, 5)