import { sendMessage } from '../../runs/run';

export function deathMessage(deadEntity, killer, killerNameFallback) {

    const killerName = killer?.name ?? killerNameFallback

    if (killerName) {

        const mainHand = killer?.getComponent('equippable')?.getEquipment('Mainhand');

        if (mainHand?.nameTag) {

            sendMessage('helden.entityDie.killedFromWhite', { withs: [deadEntity?.name ?? deadEntity.nameTag, killerName, mainHand.nameTag] });

        } else {

            sendMessage('helden.entityDie.killedFrom', { withs: [deadEntity?.name ?? deadEntity.nameTag, killerName] });
        }
    }
}
