import { system } from '@minecraft/server';
import { heldenSave } from '../function/heldenSave';

export function installSave() {

    system.run(() => {

        heldenSave().settings ??= {}
        heldenSave().player ??= {}
    })
}

export function installPlayer(name) {

    system.run(() => {

        const playerSave = heldenSave().player[name] ??= {}
        playerSave.heart ??= 4;
    })
}