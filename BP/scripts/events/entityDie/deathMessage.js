import { sendMessage } from '../../runs/run';
import { heldenSave } from '../../function/heldenSave';

export function deathMessage(deadEntity, killer) {

    const lastAttacker = heldenSave().player[deadEntity.name]?.lastAttacker
    const killerName = killer?.name ?? lastAttacker

    if (killerName) {

        const mainHand = killer?.getComponent('equippable')?.getEquipment('Mainhand');

        if (mainHand?.nameTag) {

            sendMessage('helden.entityDie.killedFromWhite', { withs: [deadEntity?.name ?? deadEntity.nameTag, killerName, mainHand.nameTag] });

        } else {

            sendMessage('helden.entityDie.killedFrom', { withs: [deadEntity?.name ?? deadEntity.nameTag, killerName] });
        }

    }
}
