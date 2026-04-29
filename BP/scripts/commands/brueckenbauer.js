import { system } from '@minecraft/server';

export function brueckenbauer(senders) {

    const sender = senders.sourceEntity;

    system.run(() => {

        sender.playSound('sound.helden.brueckenbauer');
    });
}