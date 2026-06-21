import { system, CustomCommandParamType } from '@minecraft/server';
import { brueckenbauer } from './brueckenbauer';
import { banbydeath } from './banbydeath';
import { linkheart } from './linkheart';
import { settings } from './settings';
import { heart } from './heart';
import { debug } from './debug';
import { duel } from './duel';

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {

    customCommandRegistry.registerEnum('helden:option', ['add', 'remove', 'enabled', 'disanabled', 'list']);
    customCommandRegistry.registerEnum('helden:answer', ['accept', 'denny'])

    customCommandRegistry.registerCommand({
        name: 'helden:heart',
        description: 'Legt die Herzen eines spielers fest',
        permissionLevel: 1,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'Name' }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Integer, name: 'Herzen' }
        ]
    }, heart);

    customCommandRegistry.registerCommand({
        name: 'helden:settings',
        description: 'Öffnet die Helden Einstellungen',
        permissionLevel: 1
    }, settings);

    customCommandRegistry.registerCommand({
        name: 'helden:linkheart',
        description: 'Linkheart command',
        permissionLevel: 1,
        mandatoryParameters: [
            { type: CustomCommandParamType.Enum, name: 'helden:option' },
            { type: CustomCommandParamType.String, name: 'name 1' }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.String, name: 'name 2' }
        ]
    }, linkheart);

    customCommandRegistry.registerCommand({
        name: 'helden:brückenbauer',
        description: 'Einfach nur Brückenbauer',
        permissionLevel: 0
    }, brueckenbauer);

    customCommandRegistry.registerCommand({
        name: 'helden:duel',
        description: 'Duel Command',
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
        description: 'Verhindert das bestimmte spieler gebannd werden',
        permissionLevel: 1,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'name' },
            { type: CustomCommandParamType.Boolean, name: 'option' }
        ]
    }, banbydeath)

    customCommandRegistry.registerCommand({
        name: 'helden:debug',
        description: 'Gibt den Speicher von helden aus',
        permissionLevel: 1
    }, debug);
})