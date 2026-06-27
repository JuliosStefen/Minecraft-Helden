import { sendMessage } from '../runs/run';
import { heldenSave } from '../function/heldenSave';
import { setHeart } from '../function/setHeart';
import { system } from '@minecraft/server';

export function heart(senders, select, hearts) {

    system.run(() => {

        const playerSave = heldenSave().player[select]
        const setts = heldenSave().settings

        const sender = senders.sourceEntity;
        let heart = Number(hearts), max = 4

        if (setts?.linkheart == false) {

            if (hearts >= 1) { heart += 1 }

            max = 3
        }

        if (heart == undefined) {

            if (playerSave?.heart !== undefined) {

                sendMessage('helden.heart.haveHeart', { name: sender.name, withs: [select, playerSave.heart] });

            } else {

                sendMessage('helden.heart.noExis', { name: sender.name, withs: [select] });
            }
        }

        if (heart >= 0 && heart <= 4) {

            if (playerSave?.heart !== undefined) {

                sendMessage('helden.heart.setHeart', { name: sender.name, withs: [select, heart] });

                setHeart(select, heart);

            } else {

                sendMessage('helden.heart.noExist', { name: sender.name, withs: [select] });
            }

        } else if (heart) {

            sendMessage('helden.heart.allowedOption', { name: sender.name, withs: [max] })
        }
    })
}