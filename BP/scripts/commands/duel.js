import { sendMessage } from '../runs/run';
import { heldenSave } from '../function/heldenSave';
import { setDuel } from '../function/duel';
import { system } from '@minecraft/server';

let duelQuestion = {}
let autoCancel = {}

export function duel(senders, name, answer) {

    system.run(() => {

        const sender = senders.sourceEntity;
        const setts = heldenSave().settings

        const sendSave = heldenSave().player[sender.name]

        if (sendSave?.combatlog >= 0) {

            sendMessage('helden.duel.noCombetlog', { name: sender.name });
            return;
        }

        if (sendSave?.duel >= setts?.duellimmit ?? 0) {

            if (setts?.duellimmit ?? 0 >= 1) {

                sendMessage('helden.duel.toManyDuel', { name: sender.name });
                return;
            }
        }

        if (setts?.aktiveDuel == undefined || setts?.aktiveDuel == true) {

            if (answer == undefined) {

                if (sender.name === name) {

                    sendMessage('helden.duel.noYouSelf', { name: sender.name })
                    return;
                }

                if (duelQuestion[name]) {

                    sendMessage('helden.duel.alreadyReceived', { name: sender.name, withs: [name] });

                } else {

                    duelQuestion[name] = sender.name

                    sendMessage('helden.duel.questionStart', { name: sender.name, withs: [name] });
                    sendMessage('helden.duel.questionStart2', { name, withs: [sender.name] });

                    autoCancel[name] = system.runTimeout(() => {

                        sendMessage('helden.duel.questionOutdated', { name: sender.name, withs: [name] });
                        sendMessage('helden.duel.questionOutdated2', { name, withs: [sender.name] });

                        delete duelQuestion[name]

                    }, 20 * 30)
                }

            } else {

                if (duelQuestion[sender.name] !== name) {

                    sendMessage('helden.duel.noQuestion', { name: sender.name, withs: [name] });

                } else {

                    system.clearRun(autoCancel[sender.name]);
                    delete duelQuestion[sender.name]

                    switch (answer) {
                        case 'accept': {
                            setDuel(sender.name, name);
                            heldenSave().player[name].duel ??= 0
                            heldenSave().player[sender.name].duel ??= 0
                            sendMessage('helden.duel.questionAccept', { name: sender.name, withs: [name] });
                            sendMessage('helden.duel.questionAccept2', { name, withs: [sender.name] })
                            break;
                        }
                        case 'denny': {
                            sendMessage('helden.duel.questionDenny', { name: sender.name, withs: [name] });
                            sendMessage('helden.duel.questionDenny2', { name, withs: [sender.name] })
                            break;
                        }
                        default: {
                            sendMessage('helden.helden.noOption', { name: sender.name, withs: [answer] });
                        }
                    }
                }
            }

        } else {

            sendMessage('helden.duel.noAktive', { name: sender.name });
        }
    })
}