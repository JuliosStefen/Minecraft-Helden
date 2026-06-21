import { world, system } from '@minecraft/server';
import { heldenSave } from '../function/heldenSave';

export function debug(senders) {

    const sender = senders.sourceEntity

    system.run(() => {

        sender.sendMessage(`§l§6Temp: §r§a${JSON.stringify(heldenSave())}\n\n`);
        sender.sendMessage(`§l§6Save: §r§a${world.getDynamicProperty('heldenSave')}\n\n`);
    })
}