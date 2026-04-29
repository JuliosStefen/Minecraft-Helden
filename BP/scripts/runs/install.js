import { world, system } from '@minecraft/server';

export function installSave() {

    system.run(() => {

        if (!world.getDynamicProperty('heldenSave')) {
            world.setDynamicProperty('heldenSave', JSON.stringify({}))
        }

        let heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));

        heldenSave = {
            settings: heldenSave?.settings ?? {},
            player: heldenSave?.player ?? {}
        }

        world.setDynamicProperty('heldenSave', JSON.stringify(heldenSave));
        world.sendMessage(`§a${world.getDynamicProperty('heldenSave')}`);
    })
}

export function installPlayer(name) {

    system.run(() => {

        const heldenSave = JSON.parse(world.getDynamicProperty('heldenSave'));

        heldenSave.player[name] ??= {}

        const playerSave = heldenSave.player[name];

        playerSave.combatlog ??= 'xxx';
        playerSave.hearth ??= 4;

        world.setDynamicProperty('heldenSave', JSON.stringify(heldenSave));
    })
}