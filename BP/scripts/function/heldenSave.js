import { world, system } from '@minecraft/server';

let tempSave

export function heldenSave(direct) {

    if (tempSave == undefined) {

        tempSave = JSON.parse(world?.getDynamicProperty('heldenSave') ?? '{}');
    }

    if (direct) { tempSave = JSON.parse(direct) }

    system.runTimeout(() => {
        world.setDynamicProperty('heldenSave', JSON.stringify(tempSave));
    }, 5)

    return tempSave
}