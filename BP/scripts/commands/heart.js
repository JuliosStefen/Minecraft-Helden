import { sendMessage } from '../runs/run';
import { heldenSave } from '../function/heldenSave';
import { setHeart } from '../function/setHeart';
import { system } from '@minecraft/server';

export function heart(senders, select, heart) {

    system.run(() => {

        const playerSave = heldenSave().player[select]
        const sender = senders.sourceEntity;

        const getSett = heldenSave().settings;

        if (getSett?.linkheart === false && heart === 1) {

            sendMessage('helden.heart.noLinkheart', { name: sender.name });
            return;
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

            sendMessage('helden.heart.allowedOption', { name: sender.name })
        }
    })
}