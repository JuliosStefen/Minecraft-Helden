import { ActionFormData, ModalFormData } from '@minecraft/server-ui';
import { world, system } from '@minecraft/server';
import { setNameTag, sendMessage } from '../runs/run';

export function settings(senders) {

    system.run(() => {

        const sender = senders.sourceEntity

        let heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
        let setts = heldenSave.settings

        function updateSave() {

            heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
            setts = heldenSave.settings
        }

        const settings = new ActionFormData();

        settings.title('§l§6Einstellungen');
        settings.button('Toggles', 'textures/ui/multi_toggle');
        settings.button('Limit', 'textures/ui/limit')

        settings.show(sender).then((r) => {

            if (r.canceled) return;

            updateSave();

            if (r.selection === 0) {

                const toggles = new ModalFormData();

                toggles.title('§l§6Toggles')
                toggles.toggle('Dreizack blockieren', { defaultValue: setts?.blockTrident ?? true });
                toggles.toggle('Andere Herzen anzeigen', { defaultValue: setts?.showOtherHearth ?? false })
                toggles.toggle('Linkhearth', { defaultValue: setts?.linkhearth ?? true });
                toggles.label('§l§6Dimension');
                toggles.toggle('The End', { defaultValue: setts?.lockEnd ?? true });
                toggles.toggle('Nether', { defaultValue: setts?.lockNether ?? true });
                toggles.dropdown('§l§6Herz Farbe', ['\uE200 Blau', '\uE210 Grün', '\uE220 Gelb', '\uE230 Rot', '\uE240 Pink', '\uE250 Lila'], { defaultValueIndex: setts?.hearthColor ?? 0 });

                toggles.show(sender).then((r) => {

                    if (r.canceled) return;

                    updateSave();

                    setts.blockTrident = r.formValues[0]
                    setts.showOtherHearth = r.formValues[1]
                    setts.linkhearth = r.formValues[2]
                    // Dimension label [3]
                    setts.lockEnd = r.formValues[4]
                    setts.lockNether = r.formValues[5]
                    setts.hearthColor = r.formValues[6]

                    world.setDynamicProperty('heldenSave', JSON.stringify(heldenSave));

                    for (const player of world.getPlayers()) {

                        setNameTag(player.name);
                    }
                })
            }

            if (r.selection === 1) {

                const limit = new ModalFormData();

                limit.title('§l§6Limit');
                limit.toggle('Spinnennetz', { defaultValue: setts?.web_limitEna ?? true });
                limit.textField('Spinnennetz', '', { defaultValue: String(setts?.web_limit) ?? '64' });
                limit.toggle('Enderperle', { defaultValue: setts?.pearl_limitEna ?? true });
                limit.textField('Enderperle', '', { defaultValue: String(setts?.pearl_limit) ?? '16' });
                limit.show(sender).then((r) => {

                    if (r.canceled) return;

                    updateSave();

                    setts.web_limitEna = r.formValues[0]
                    setts.web_limit = Math.max(0, Number(r.formValues[1]) || 0)
                    setts.pearl_limitEna = r.formValues[2]
                    setts.pearl_limit = Math.max(0, Number(r.formValues[3]) || 0)

                    world.setDynamicProperty('heldenSave', JSON.stringify(heldenSave));

                    sendMessage('Limits aktualisiert', { name: sender.name });
                })
            }
        })
    })
}