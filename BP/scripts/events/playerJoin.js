import { world, system } from '@minecraft/server';
import { heldenSave } from '../function/heldenSave';
import { banReason } from '../runs/run';

world.afterEvents.playerJoin.subscribe(({ playerName }) => {

    system.run(() => {

        const playerSave = heldenSave().player[playerName]

        if (playerSave?.banbydeath !== false && playerSave?.heart <= 0) {

            world.getDimension('overworld').runCommand(`kick "${playerName}" ${banReason}`);
        }
    })
})