import { world, system } from '@minecraft/server';

let tempSave

export function heldenSave() {

    if (tempSave == undefined) {

        tempSave = JSON.parse(world?.getDynamicProperty('heldenSave') ?? '{}');
    }

    system.runTimeout(() => {
        world.setDynamicProperty('heldenSave', JSON.stringify(tempSave));
    }, 5)

    return tempSave
} 