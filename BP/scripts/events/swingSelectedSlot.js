import { world, system } from '@minecraft/server';
import { heldenSave } from '../function/heldenSave';

let velocity = {}

function blockLunge(player, itemStack) {

    const setts = heldenSave().settings
    const playerSave = heldenSave().player[player.name]
    const enchantment = itemStack?.getComponent('enchantable')?.getEnchantment('minecraft:lunge')

    if ((setts?.blockLunge == undefined || setts?.blockLunge) &&
        enchantment?.type.id == 'lunge' && !velocity[player.name] &&
        playerSave?.combatlog) {

        const y = player.getVelocity().y

        velocity[player.name] = system.runInterval(() => {

            player.clearVelocity()
            player.applyKnockback({ x: 0, z: 0 }, y / 2)
        })

        system.runTimeout(() => {

            system.clearRun(velocity[player.name])
            delete velocity[player.name]
        }, 5)
    }
}

world.afterEvents.playerSwingStart.subscribe(({ player, heldItemStack }) => blockLunge(player, heldItemStack));
world.afterEvents.playerHotbarSelectedSlotChange.subscribe(({ player, itemStack }) => blockLunge(player, itemStack));