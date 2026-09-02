import { heldenSave } from '../function/heldenSave';
import { ModalFormData } from '@minecraft/server-ui';
import { world, system } from '@minecraft/server';

export function debug(senders) {

    const sender = senders?.sourceEntity

    system.run(() => {

        if (!sender) {

            console.log(`§l§6Debug: §r§a${JSON.stringify(heldenSave())}`);
        }

        if (sender?.typeId == 'minecraft:player') {

            sender.sendMessage(`§l§6Debug: §r§a${JSON.stringify(heldenSave())}`);

            if (sender.playerPermissionLevel >= 2) {

                const debugUI = new ModalFormData()
                    .title('Debug')
                    .textField('Input:', 'JSON String', { defaultValue: JSON.stringify(heldenSave()) })
                    .label(`§l§6Debug: §r§a${JSON.stringify(heldenSave())}`)
                    .submitButton('helden.ui.save')
                debugUI.show(sender).then((r) => {

                    if (r.canceled) return;

                    heldenSave(r.formValues[0])
                })
            }
        }
    })
}