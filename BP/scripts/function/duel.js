import { sendMessage } from '../runs/run';
import { heldenSave } from './heldenSave';
import { system } from '@minecraft/server';

export let aktiveDuel = {}
let timeout = {}

function end(name) {

    system.run(() => {

        const setts = heldenSave().settings

        if (timeout[name]) {
            system.clearRun(timeout[name])
        }

        timeout[name] = system.runTimeout(() => {

            sendMessage('helden.duel.InaktivitiEnd', { name });
            delete aktiveDuel[name]

        }, 20 * Number(setts?.inactiveDuel ?? 200))
    })
}

export function setDuel(name1, name2) {

    aktiveDuel[name1] = name2
    aktiveDuel[name2] = name1

    end(name1);
    end(name2);
}

export function duelEnd(name) {

    const duelName = aktiveDuel[name]

    delete aktiveDuel[name]
    delete aktiveDuel[duelName]

    system.clearRun(timeout[duelName]);
    system.clearRun(timeout[name]);
}