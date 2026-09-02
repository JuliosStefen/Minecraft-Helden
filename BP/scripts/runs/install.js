import { system } from '@minecraft/server';
import { heldenSave } from '../function/heldenSave';

export function installSave() {

    system.run(() => {

        heldenSave().settings ??= {}
        heldenSave().player ??= {}

        heldenSave().settings.linkheart ??= false
        heldenSave().settings.headhunt ??= true
    })
}

export function installPlayer(name) {

    system.run(() => {

        const playerSave = heldenSave().player[name] ??= {}
        playerSave.heart ??= 4;
    })
}