import { world, system } from '@minecraft/server';

export function sendMessage(translate, { withs = [], name } = {}) {

    system.run(() => {

        let withss = []

        for (const one of withs) { withss.push(String(one)) }

        const message = { rawtext: [{ text: '[§bHelden§r] ' }, { translate, with: withss }] }

        if (name === undefined) {

            world.sendMessage(message);

        } else {

            for (const player of world.getPlayers().filter((p) => p.name === name)) {

                player.sendMessage(message);
            }
        }
    })
}

export function lockArmor(name, mode) {

    world.getPlayers().forEach(player => {

        if (player.name === name) {

            const equippable = player.getComponent('equippable')

            const head = equippable.getEquipment('Head');
            const chest = equippable.getEquipment('Chest');
            const legs = equippable.getEquipment('Legs');
            const feet = equippable.getEquipment('Feet');

            function setSlot(slot, item) {

                if (item) {

                    item.lockMode = mode
                    player.getComponent('equippable').setEquipment(slot, item);
                }
            }

            setSlot('Head', head);
            setSlot('Chest', chest);
            setSlot('Legs', legs);
            setSlot('Feet', feet);
        }
    })
}

export function unstuckInventory(name) {

    world.getPlayers().forEach(player => {

        if (player.name === name) {

            const inventory = player.getComponent('inventory')?.container

            if (inventory) {

                for (let s = 0; s < inventory.size; s++) {

                    const item = inventory.getItem(s)

                    if (item?.lockMode === 'slot') {

                        item.lockMode = 'none'
                        inventory.setItem(s, item)
                    }
                }
            }
        }
    })
}
