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

        settings.title('helden.ui.settingsTitle')
            .button('helden.ui.toggles', 'textures/ui/multi_toggle')
            .button('helden.ui.limits', 'textures/ui/limit')
            .button('helden.ui.duel', 'textures/ui/cross_sword')
            .button('helden.ui.delete', 'textures/ui/trash_default')
        settings.show(sender).then((r) => {

            if (r.canceled) return;

            if (r.selection == 0) {

                const toggles = new ModalFormData();

                toggles.title('helden.ui.togglesTitle')
                    .toggle('helden.ui.debug', { defaultValue: setts?.debug ?? false })
                    .toggle('helden.ui.loseHeart', { defaultValue: setts?.loastHeart ?? true })
                    .toggle('helden.ui.blockTrident', { defaultValue: setts?.blockTrident ?? true })
                    .toggle('helden.ui.showOtherHearts', { defaultValue: setts?.showOtherheart ?? false })
                    .toggle('helden.ui.linkHeart', { defaultValue: setts?.linkheart ?? true })
                    .label('helden.ui.dimension')
                    .toggle('helden.ui.theEnd', { defaultValue: setts?.lockEnd ?? false })
                    .toggle('helden.ui.nether', { defaultValue: setts?.lockNether ?? false })
                    .dropdown('helden.ui.heartColor', [{ translate: 'helden.ui.blue', with: ['\uE200'] }, { translate: 'helden.ui.green', with: ['\uE210'] }, { translate: 'helden.ui.yellow', with: ['\uE220'] }, { translate: 'helden.ui.red', with: ['\uE230'] }, { translate: 'helden.ui.pink', with: ['\uE240'] }, { translate: 'helden.ui.purple', with: ['\uE250'] }], { defaultValueIndex: setts?.heartColor ?? 0 })
                    .submitButton('helden.ui.save')
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

                limit.title('helden.ui.limitsTitle')
                    .toggle('helden.ui.cobwebLimit', { defaultValue: setts?.web_limitEna ?? true })
                    .textField('helden.ui.cobwebLimit', '', { defaultValue: String(setts?.web_limit ?? '64') })
                    .toggle('helden.ui.enderPearlLimit', { defaultValue: setts?.pearl_limitEna ?? true })
                    .textField('helden.ui.enderPearlLimit', '', { defaultValue: String(setts?.pearl_limit ?? '16') })
                    .submitButton('helden.ui.save')
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

                duelMenu.title('helden.ui.duelTitle')
                    .toggle('helden.ui.enableDuels', { defaultValue: setts?.aktiveDuel ?? true })
                    .textField('helden.ui.duelLimit', '', { defaultValue: String(setts?.duellimmit ?? 0) })
                    .textField('helden.ui.duelRequestExpiration', '', { defaultValue: String(setts?.expireDuel ?? 30) })
                    .textField('helden.ui.inactiveDuelTimeout', '', { defaultValue: String(setts?.inactiveDuel ?? 200) })
                    .submitButton('helden.ui.save')
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

                remove.title('helden.ui.deleteTitle')
                    .toggle('helden.ui.linkHeart')
                    .toggle('helden.ui.hearts')
                    .toggle('helden.ui.duel')
                    .toggle('helden.ui.players')
                    .toggle('helden.ui.settings')
                    .toggle('helden.ui.all')
                    .submitButton('helden.ui.deleteButton')
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