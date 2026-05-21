import { world } from '@minecraft/server';

export function removeHearth(name) {

    const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));
    const entitySave = heldenSave.player[name]
    const setts = heldenSave.settings

    if (entitySave?.hearth >= 0) {

        if (entitySave.hearth === 1 && entitySave?.linkhearth && (setts?.linkhearth === undefined || setts?.linkhearth)) {

            const partner = heldenSave.entity[entitySave.linkhearth]

            if (partner.hearth > 0) {

                partner.hearth = (partner.hearth - 1)
                partner.combatlog = 'xxx'
            }
        }

        if (entitySave.hearth > 0) {

            if (!setts?.linkhearth && entitySave.hearth === 2) { entitySave.hearth = (entitySave.hearth - 1) }

            entitySave.hearth = (entitySave.hearth - 1)
            entitySave.combatlog = 'xxx'
        }

        world.setDynamicProperty('heldenSave', JSON.stringify(heldenSave));
    }
}