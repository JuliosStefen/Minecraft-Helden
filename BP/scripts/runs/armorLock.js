import { world, system } from '@minecraft/server';
import { heldenSave } from '../function/heldenSave';
import { lockArmor, unstuckInventory, sendMessage } from './helpers';

const ruestungsSlots = ['Head', 'Chest', 'Legs', 'Feet'];

let gesperrteSpieler = {};

function minutenFormatieren(ms) {

    const minuten = Math.max(1, Math.ceil(ms / 60000))

    return `${minuten} Minute${minuten === 1 ? '' : 'n'}`
}

export function hatAusgeruestetenSchutz(player) {

    const equippable = player.getComponent('equippable')

    if (equippable == undefined) return false

    for (const slot of ruestungsSlots) {

        if (equippable.getEquipment(slot)) return true
    }

    return false
}

export function gesperrteRuestungDroppen(player) {

    const equippable = player.getComponent('equippable')

    if (equippable == undefined) return

    const dimension = player.dimension
    const location = player.location

    for (const slot of ruestungsSlots) {

        const item = equippable.getEquipment(slot)

        if (item) {

            item.lockMode = 'none'
            dimension.spawnItem(item, location)
            equippable.setEquipment(slot, undefined)
        }
    }
}

export function startArmorLock(name) {

    const setts = heldenSave().settings
    const playerSave = heldenSave().player[name]

    if (playerSave == undefined) return
    if (setts?.armorLock === false) return
    if (playerSave.armorLockEnd > Date.now()) return

    const player = world.getPlayers().find(p => p.name === name)

    if (player == undefined) return
    if (hatAusgeruestetenSchutz(player) === false) return

    const minuten = setts?.armorLockDuration ?? 10

    playerSave.armorLockEnd = Date.now() + minuten * 60 * 1000

    lockArmor(name, 'slot')

    gesperrteSpieler[name] = true

    sendMessage('helden.armorLock.activated', { name, withs: [minutenFormatieren(minuten * 60 * 1000)] })
}

export function resumeArmorLock(name) {

    const playerSave = heldenSave().player[name]

    if (playerSave?.armorLockEnd > Date.now()) {

        lockArmor(name, 'slot')

        gesperrteSpieler[name] = true

    } else {

        releaseArmorLock(name)
    }
}

export function releaseArmorLock(name) {

    delete gesperrteSpieler[name]

    lockArmor(name, 'none')
    unstuckInventory(name)

    const playerSave = heldenSave().player[name]

    if (playerSave) {

        delete playerSave.armorLockEnd
    }
}

export function resetAllArmorLocks() {

    for (const name in gesperrteSpieler) {

        releaseArmorLock(name)
    }

    gesperrteSpieler = {}

    const save = heldenSave()

    for (const name in save.player) {

        delete save.player[name].armorLockEnd
    }
}

system.run(() => {

    const save = heldenSave()

    for (const player of world.getPlayers()) {

        const playerSave = save.player[player.name]

        if (playerSave?.armorLockEnd > Date.now()) {

            lockArmor(player.name, 'slot')

            gesperrteSpieler[player.name] = true
        }
    }
})

system.runInterval(() => {

    const namen = Object.keys(gesperrteSpieler)

    if (namen.length === 0) return

    const jetzt = Date.now()
    const save = heldenSave()

    for (const name of namen) {

        const playerSave = save.player[name]

        if (playerSave?.armorLockEnd == undefined || playerSave.armorLockEnd <= jetzt) {

            releaseArmorLock(name)
            sendMessage('helden.armorLock.ended', { name })
        }
    }

}, 20)
