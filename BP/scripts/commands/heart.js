import { setHeart, maxHeart } from '../function/heart';
import { sendMessage } from '../runs/run';
import { heldenSave } from '../function/heldenSave';
import { system } from '@minecraft/server';

export function heart(senders, select, hearts) {

    system.run(() => {

        const playerSave = heldenSave().player[select]
        const sender = senders.sourceEntity;

        if (playerSave?.heart == undefined) {

            sendMessage('helden.heart.noExist', { name: sender.name, withs: [select] });
            return
        }

        if (hearts == undefined && playerSave?.heart >= 0) {

            sendMessage('helden.heart.haveHeart', { name: sender.name, withs: [select, playerSave.heart] });
            return;
        }

        if (hearts >= 0 && hearts <= maxHeart().max) {

            if (playerSave?.heart >= 0) {

                sendMessage('helden.heart.setHeart', { name: sender.name, withs: [select, hearts] });

                setHeart(select, hearts);
            }

        } else if (hearts) {

            sendMessage('helden.heart.allowedOption', { name: sender.name, withs: [maxHeart().max] })
        }
    })
}