import { setNameTag, sendMessage, randomPartner, playerLimit } from '../runs/run';
import { ActionFormData, ModalFormData } from '@minecraft/server-ui';
import { resetAllArmorLocks } from '../runs/armorLock';
import { setHeart, maxHeart } from '../function/heart';
import { world, system } from '@minecraft/server';
import { heldenSave } from '../function/heldenSave';

export function settings(senders) {

    const sender = senders.sourceEntity

    if (world.getPackSettings()['mc_helden:settings'] == false) {

        sendMessage('helden.settings.disabled', { name: sender.name });
        return;
    }

    system.run(() => {

        const setts = heldenSave().settings
        const settings = new ActionFormData()

        settings.title('helden.ui.settingsTitle')
            .button('helden.ui.heartSystem', 'textures/ui/heart')
            .button('helden.ui.toggles', 'textures/ui/multi_toggle')
            .button('helden.ui.limits', 'textures/ui/limit')
            .button('helden.ui.armorLock', 'textures/ui/lock_color')
            .button('helden.ui.duel', 'textures/ui/cross_sword')
            .button('helden.ui.delete', 'textures/ui/trash_default')
        settings.show(sender).then((r) => {

            if (r.canceled) return;

            if (r.selection == 0) {

                const heartSystem = new ModalFormData();

                heartSystem.title('helden.ui.heartSystemTitle')
                    .dropdown('helden.ui.heartSystemDropdown', [{ translate: 'helden.ui.heartSystemNormal' }, { translate: 'helden.ui.heartSystemLinked' }, { translate: 'helden.ui.heartSystemHeadhunt' }], { defaultValueIndex: setts?.heartMode ?? 2 })
                    .toggle('helden.ui.showHeadhunt', { defaultValue: setts?.showHeadhunt ?? false })
                    .submitButton('helden.ui.save')
                heartSystem.show(sender).then((r) => {

                    if (r.canceled) return;

                    world.getPlayers().forEach(player => {

                        const playerSave = heldenSave().player[player.name]

                        if (setts.heartMode !== r.formValues[0]) {

                            setHeart(player.name, maxHeart(r.formValues[0]).def)
                            delete playerSave.headhunt

                        } else if (setts.showHeadhunt) setHeart(player.name, playerSave.heart)
                    })

                    setts.heartMode = r.formValues[0]
                    setts.showHeadhunt = r.formValues[1]

                    sendMessage('helden.settings.updates', { name: sender.name });
                })
            }

            if (r.selection == 1) {

                const toggles = new ModalFormData();

                toggles.title('helden.ui.togglesTitle')
                    .toggle('helden.ui.debug', { defaultValue: setts?.debug ?? false })
                    .toggle('helden.ui.showOtherHearts', { defaultValue: setts?.showOtherheart ?? false })
                    .toggle('helden.ui.loseHeart', { defaultValue: setts?.loastHeart ?? true })
                    .label('helden.ui.onCombat')
                    .toggle('helden.ui.blockTrident', { defaultValue: setts?.blockTrident ?? true })
                    .toggle('helden.ui.blockChest', { defaultValue: setts?.blockChest ?? true })
                    .toggle('helden.ui.blockLunge', { defaultValue: setts?.blockLunge ?? true })
                    .label('helden.ui.dimension')
                    .toggle('helden.ui.theEnd', { defaultValue: setts?.lockEnd ?? false })
                    .toggle('helden.ui.nether', { defaultValue: setts?.lockNether ?? false })
                    .dropdown('helden.ui.heartColor', [{ translate: 'helden.ui.blue', with: ['\uE200'] }, { translate: 'helden.ui.green', with: ['\uE210'] }, { translate: 'helden.ui.yellow', with: ['\uE220'] }, { translate: 'helden.ui.red', with: ['\uE230'] }, { translate: 'helden.ui.pink', with: ['\uE240'] }, { translate: 'helden.ui.purple', with: ['\uE250'] }], { defaultValueIndex: setts?.heartColor ?? 0 })
                    .submitButton('helden.ui.save')
                toggles.show(sender).then((r) => {

                    if (r.canceled) return;

                    setts.debug = r.formValues[0]
                    setts.showOtherheart = r.formValues[1]
                    setts.loastHeart = r.formValues[2]
                    // Im Kampf label [3]
                    setts.blockTrident = r.formValues[4]
                    setts.blockChest = r.formValues[5]
                    setts.blockLunge = r.formValues[6]
                    // Dimension label [7]
                    setts.lockEnd = r.formValues[8]
                    setts.lockNether = r.formValues[9]
                    setts.heartColor = r.formValues[10]

                    world.getPlayers().forEach(player => {

                        setNameTag(player.name);
                    })

                    sendMessage('helden.settings.updates', { name: sender.name });
                })
            }

            if (r.selection == 2) {

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

            if (r.selection == 3) {

                const armorLockMenu = new ModalFormData();

                armorLockMenu.title('helden.ui.armorLockSettingsTitle')
                    .toggle('helden.ui.armorLockEnabled', { defaultValue: setts?.armorLock ?? true })
                    .textField('helden.ui.armorLockDuration', '', { defaultValue: String(setts?.armorLockDuration ?? 10) })
                    .submitButton('helden.ui.save')
                armorLockMenu.show(sender).then((r) => {

                    if (r.canceled) return;

                    setts.armorLock = r.formValues[0]
                    setts.armorLockDuration = Math.max(1, Number(r.formValues[1]) || 10)

                    sendMessage('helden.settings.updates', { name: sender.name });
                })
            }

            if (r.selection == 4) {

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

            if (r.selection == 5) {

                const remove = new ModalFormData();

                remove.title('helden.ui.deleteTitle')
                    .toggle('helden.ui.partner')
                    .toggle('helden.ui.hearts')
                    .toggle('helden.ui.duel')
                    .toggle('helden.ui.armorLockReset')
                    .toggle('helden.ui.combatlogReset')
                    .toggle('helden.ui.players')
                    .toggle('helden.ui.settings')
                    .toggle('helden.ui.all')
                    .submitButton('helden.ui.deleteButton')
                remove.show(sender).then((r) => {

                    if (r.canceled) return;

                    if (r.formValues[0]) {

                        for (const name in heldenSave().player) delete heldenSave().player[name].partner

                        sendMessage('helden.settings.removePartner', { name: sender.name })
                    }

                    if (r.formValues[1]) {

                        for (const name in heldenSave().player) delete heldenSave().player[name].heart
                        for (const name in heldenSave().player) delete heldenSave().player[name].headhunt

                        sendMessage('helden.settings.removeHeart', { name: sender.name })
                    }

                    if (r.formValues[2]) {

                        for (const name in heldenSave().player) delete heldenSave().player[name].duel

                        sendMessage('helden.settings.removeDuel', { name: sender.name })
                    }

                    if (r.formValues[3]) {

                        resetAllArmorLocks()

                        sendMessage('helden.settings.removeArmorLock', { name: sender.name })
                    }

                    if (r.formValues[4]) {

                        for (const name in heldenSave().player) delete heldenSave().player[name].combatlog
                        for (const name in playerLimit) delete playerLimit[name]

                        sendMessage('helden.settings.removeCombatlog', { name: sender.name })
                    }

                    if (r.formValues[5]) {

                        heldenSave().player = {}

                        sendMessage('helden.settings.removePlayer', { name: sender.name })
                    }

                    if (r.formValues[6]) {

                        heldenSave().settings = {}
                        sendMessage('helden.settings.removeSettings', { name: sender.name })
                    }

                    if (r.formValues[7]) {

                        heldenSave().player = {}
                        heldenSave().settings = {}

                        sendMessage('helden.settings.removeAll', { name: sender.name })
                    }

                    world.getPlayers().forEach((player) => {

                        const playerSave = heldenSave().player[player.name] ??= {}

                        setNameTag(player.name);
                        playerSave.heart ??= maxHeart().def

                        if (playerSave?.partner == undefined) randomPartner[player.name] = player.name
                    })
                })
            }
        })
    })
}