import { setNameTag, sendMessage, randomLink } from '../runs/run';
import { ActionFormData, ModalFormData } from '@minecraft/server-ui';
import { world, system } from '@minecraft/server';
import { installPlayer } from '../runs/install'
import { heldenSave } from '../function/heldenSave';

export function settings(senders) {

    system.run(() => {

        const sender = senders.sourceEntity
        const setts = heldenSave().settings

        const settings = new ActionFormData()
            .title('§l§6Einstellungen')
            .button('Toggles', 'textures/ui/multi_toggle')
            .button('Limit', 'textures/ui/limit')
            .button('Duel', 'textures/ui/cross_sword')
            .button('Löschen', 'textures/ui/trash_default')
        settings.show(sender).then((r) => {

            if (r.canceled) return;

            if (r.selection == 0) {

                const toggles = new ModalFormData();

                toggles.title('§l§6Toggles')
                    .toggle('Debug', { defaultValue: setts?.debug ?? false })
                    .toggle('Herzverlust', { defaultValue: setts?.loastHeart ?? true })
                    .toggle('Dreizack blockieren', { defaultValue: setts?.blockTrident ?? true })
                    .toggle('Andere Herzen anzeigen', { defaultValue: setts?.showOtherheart ?? false })
                    .toggle('Linkheart', { defaultValue: setts?.linkheart ?? true })
                    .label('§l§6Dimension')
                    .toggle('The End', { defaultValue: setts?.lockEnd ?? true })
                    .toggle('Nether', { defaultValue: setts?.lockNether ?? true })
                    .dropdown('§l§6Herz Farbe', ['\uE200 Blau', '\uE210 Grün', '\uE220 Gelb', '\uE230 Rot', '\uE240 Pink', '\uE250 Lila'], { defaultValueIndex: setts?.heartColor ?? 0 })
                    .submitButton('§l§2Speichern')
                toggles.show(sender).then((r) => {

                    if (r.canceled) return;

                    setts.debug = r.formValues[0]
                    setts.loastHeart = r.formValues[1]
                    setts.blockTrident = r.formValues[2]
                    setts.showOtherheart = r.formValues[3]
                    setts.linkheart = r.formValues[4]
                    // Dimension label [5]
                    setts.lockEnd = r.formValues[6]
                    setts.lockNether = r.formValues[7]
                    setts.heartColor = r.formValues[8]

                    world.getPlayers().forEach(player => {

                        setNameTag(player.name);
                    })

                    sendMessage('helden.settings.updates', { name: sender.name });
                })
            }

            if (r.selection == 1) {

                const limit = new ModalFormData();

                limit.title('§l§6Limit')
                    .toggle('Spinnennetz', { defaultValue: setts?.web_limitEna ?? true })
                    .textField('Spinnennetz', '', { defaultValue: String(setts?.web_limit ?? '64') })
                    .toggle('Enderperle', { defaultValue: setts?.pearl_limitEna ?? true })
                    .textField('Enderperle', '', { defaultValue: String(setts?.pearl_limit ?? '16') })
                    .submitButton('§l§2Speichern')
                limit.show(sender).then((r) => {

                    if (r.canceled) return;

                    setts.web_limitEna = r.formValues[0]
                    setts.web_limit = Math.max(0, Number(r.formValues[1]) || 64)
                    setts.pearl_limitEna = r.formValues[2]
                    setts.pearl_limit = Math.max(0, Number(r.formValues[3]) || 16)

                    sendMessage('helden.settings.updates', { name: sender.name });
                })
            }

            if (r.selection == 2) {

                const duelMenu = new ModalFormData();

                duelMenu.title('§l§6Duel')
                    .toggle('Duelle aktivieren', { defaultValue: setts?.aktiveDuel ?? true })
                    .textField('Duel limit (0 = Kein limit)', '', { defaultValue: String(setts?.duellimmit ?? 0) })
                    .textField('Automatische ablaufen von anfragen', '', { defaultValue: String(setts?.expireDuel ?? 30) })
                    .textField('Inaktive Duels beenden', '', { defaultValue: String(setts?.inactiveDuel ?? 200) })
                    .submitButton('§l§2Speichern')
                duelMenu.show(sender).then((r) => {

                    if (r.canceled) return;

                    for (const name in heldenSave().player) {
                        delete heldenSave().player[name].duel
                    }

                    setts.aktiveDuel = r.formValues[0]
                    setts.duellimmit = Math.max(0, Number(r.formValues[1]) || 0)
                    setts.expireDuel = Math.max(0, Number(r.formValues[2]) || 30)
                    setts.inactiveDuel = Math.max(0, Number(r.formValues[3]) || 200)

                    sendMessage('helden.settings.updates', { name: sender.name })
                })
            }

            if (r.selection == 3) {

                const remove = new ModalFormData();

                remove.title('§l§6Löschen')
                    .toggle('Linkheart')
                    .toggle('Herzen')
                    .toggle('Duel')
                    .toggle('Spieler')
                    .toggle('Einstellungen')
                    .toggle('Alles')
                remove.show(sender).then((r) => {

                    if (r.canceled) return;

                    if (r.formValues[0]) {

                        for (const name in heldenSave().player) {
                            delete heldenSave().player[name].linkheart
                        }

                        sendMessage('helden.settings.removeLinkheart', { name: sender.name })
                    }

                    if (r.formValues[1]) {

                        for (const name in heldenSave().player) {
                            delete heldenSave().player[name].heart
                        }

                        sendMessage('helden.settings.removeHeart', { name: sender.name })
                    }

                    if (r.formValues[2]) {

                        for (const name in heldenSave().player) {
                            delete heldenSave().player[name].duel
                        }

                        sendMessage('helden.settings.removeDuel', { name: sender.name })
                    }

                    if (r.formValues[3]) {

                        heldenSave().player = {}

                        sendMessage('helden.settings.removePlayer', { name: sender.name })
                    }

                    if (r.formValues[4]) {

                        heldenSave().settings = {}
                        sendMessage('helden.settings.removeSettings', { name: sender.name })
                    }

                    if (r.formValues[5]) {

                        heldenSave().player = {}
                        heldenSave().settings = {}

                        sendMessage('helden.settings.removeAll', { name: sender.name })
                    }

                    world.getPlayers().forEach((player) => {

                        setNameTag(player.name);
                        installPlayer(player.name);

                        if (heldenSave().player[player.name]?.linkheart == undefined) {

                            randomLink[player.name] = player.name
                        }
                    })
                })
            }
        })
    })
}