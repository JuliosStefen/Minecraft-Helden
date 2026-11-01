import { system, world, CustomCommandParamType } from '@minecraft/server';
import { brueckenbauer } from './brueckenbauer';
import { banbydeath } from './banbydeath';
import { settings } from './settings';
import { partner } from './partner';
import { heart } from './heart';
import { debug } from './debug';
import { duel } from './duel';

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {

    customCommandRegistry.registerEnum('helden:option', ['add', 'remove', 'enabled', 'disanabled', 'get']);
    customCommandRegistry.registerEnum('helden:answer', ['accept', 'denny'])

    if (world.getPackSettings()['mc_helden:settings']) {

        customCommandRegistry.registerCommand({
            name: 'helden:settings',
            description: 'helden.commandDescription.settings',
            permissionLevel: 1
        }, settings);
    }

    customCommandRegistry.registerCommand({
        name: 'helden:heart',
        description: 'helden.commandDescription.heart',
        permissionLevel: 1,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'name' }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Integer, name: 'hearts' }
        ]
    }, heart);

    customCommandRegistry.registerCommand({
        name: 'helden:partner',
        description: 'helden.commandDescription.partner',
        permissionLevel: 1,
        mandatoryParameters: [
            { type: CustomCommandParamType.Enum, name: 'helden:option' },
            { type: CustomCommandParamType.String, name: 'name 1' }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.String, name: 'name 2' }
        ]
    }, partner);

    customCommandRegistry.registerCommand({
        name: 'helden:brückenbauer',
        description: 'helden.commandDescription.brueckenbauer',
        permissionLevel: 0
    }, brueckenbauer);

    customCommandRegistry.registerCommand({
        name: 'helden:duel',
        description: 'helden.commandDescription.duel',
        permissionLevel: 0,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'name' }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Enum, name: 'helden:answer' }
        ]
    }, duel);

    customCommandRegistry.registerCommand({
        name: 'helden:banbydeath',
        description: 'helden.commandDescription.banbydeath',
        permissionLevel: 1,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'name' },
            { type: CustomCommandParamType.Boolean, name: 'option' }
        ]
    }, banbydeath);

    customCommandRegistry.registerCommand({
        name: 'helden:debug',
        description: 'helden.commandDescription.debug',
        permissionLevel: 1
    }, debug);
})