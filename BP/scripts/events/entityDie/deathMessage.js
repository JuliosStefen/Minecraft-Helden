import { sendMessage } from '../../runs/run';

export function deathMessage(deadEntity, killer) {

    const mainHand = killer?.getComponent('equippable').getEquipment('Mainhand');

    if (mainHand?.nameTag) {

        sendMessage('helden.entityDie.killedFromWhite', { withs: [deadEntity?.name ?? deadEntity.nameTag, killer.name, mainHand.nameTag] });

    } else {

        if (killer?.name) {

            sendMessage('helden.entityDie.killedFrom', { withs: [deadEntity?.name ?? deadEntity.nameTag, killer.name] });

        } else {

            sendMessage('helden.entityDie.die', { withs: [deadEntity.name] });
        }
    }
} 