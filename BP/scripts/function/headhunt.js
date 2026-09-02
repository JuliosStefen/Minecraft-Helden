import { system } from '@minecraft/server';
import { sendMessage } from '../runs/run';
import { heldenSave } from './heldenSave';
import { setHeart } from './setHeart';
import { installPlayer } from '../runs/install';

export let headhuntWarteliste = {}

export function headhuntSpielerBereit(name) {

    const playerSave = heldenSave().player[name]

    if (playerSave?.headhuntTarget == undefined && playerSave?.headhuntGeloest == undefined) {

        headhuntWarteliste[name] = name
    }
}

export function setHeadhunt(player, partner) {

    heldenSave().player[partner] ??= {}
    heldenSave().player[player] ??= {}

    const partnerSave = heldenSave().player?.[partner]
    const playerSave = heldenSave().player?.[player]

    if (partnerSave?.headhuntTarget == undefined && playerSave?.headhuntTarget == undefined) {

        playerSave.headhuntTarget = partner
        partnerSave.headhuntTarget = player

        installPlayer(partner);
        installPlayer(player);
    }
}

export function headhuntVerlosen() {

    const namen = Object.values(headhuntWarteliste)

    if (namen.length >= 2) {

        const spieler1 = namen[Math.floor(Math.random() * namen.length)]
        const spieler2 = namen[Math.floor(Math.random() * namen.length)]

        if (spieler1 === spieler2) return

        setHeadhunt(spieler1, spieler2)

        delete headhuntWarteliste[spieler1]
        delete headhuntWarteliste[spieler2]
    }
}

system.runInterval(() => {

    const setts = heldenSave().settings

    if (setts?.headhunt && Object.values(headhuntWarteliste).length >= 2) {

        headhuntVerlosen()
    }

}, 20)

export function istHeadhuntKill(killerName, victimName) {

    const killerSave = heldenSave().player[killerName]

    return killerSave?.headhuntTarget === victimName
}

export function headhuntKillVerarbeiten(killerName, victimName) {

    const killerSave = heldenSave().player[killerName]
    const victimSave = heldenSave().player[victimName]

    sendMessage('helden.headhunt.won', { name: killerName, withs: [victimName] })
    sendMessage('helden.headhunt.wonBroadcast', { withs: [killerName, victimName] })

    setHeart(killerName, Math.min(5, (killerSave.heart ?? 4) + 1))
    setHeart(victimName, victimSave.heart - 1)

    delete killerSave.headhuntTarget
    delete victimSave.headhuntTarget

    killerSave.headhuntGewonnen = true
    victimSave.headhuntGeloest = true
    killerSave.headhuntGeloest = true
}

export function headhuntStatusText(name, zeigeName) {

    const playerSave = heldenSave().player[name]

    if (playerSave?.headhuntGeloest) return ''

    const ziel = playerSave?.headhuntTarget ?? '  ???  '

    let text = '\uE309\uE306\uE309'

    if (zeigeName) {

        text = `${ziel}`
    }

    return text
}

export function headhuntBonusHerz(name, colorIndex) {

    const playerSave = heldenSave().player[name]

    if (playerSave?.headhuntGewonnen == undefined) return ''

    const herz = playerSave?.heart >= 5 ? String.fromCharCode(0xE308 + colorIndex * 16) : '\uE307'

    return `\uE309${herz}\uE309`
}

export function headhuntZuruecksetzen() {

    headhuntWarteliste = {}

    const save = heldenSave()

    for (const name in save.player) {

        const playerSave = save.player[name]

        delete playerSave.headhuntTarget
        delete playerSave.headhuntGeloest
        delete playerSave.headhuntGewonnen

        if (playerSave.heart > 3) playerSave.heart = 3
    }
}
