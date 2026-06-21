import { system } from '@minecraft/server';
import { sendMessage } from '../runs/run';
import { heldenSave } from '../function/heldenSave';

export function banbydeath(senders, select, boolean) {

    system.run(() => {

        const sender = senders.sourceEntity
        const playerSave = heldenSave().player[select] ??= {}

        if (boolean == false) {

            sendMessage('helden.banbydeath.false', { name: sender.name, withs: [select] });
            playerSave.banbydeath = boolean

        } else {

            sendMessage('helden.banbydeath.true', { name: sender.name, withs: [select] });
            delete playerSave.banbydeath
        }
    })
}