import { system, CustomCommandParamType } from '@minecraft/server';

import { brueckenbauer } from './brueckenbauer';
import { linkhearth } from './linkhearth';
import { settings } from './settings';
import { hearth } from './hearth';

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {

    customCommandRegistry.registerCommand({
        name: 'helden:hearth',
        description: 'Legt die Herzen eines spielers fest',
        permissionLevel: 2,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'Name' }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.Integer, name: 'Herzen' }
        ]
    }, hearth);

    customCommandRegistry.registerCommand({
        name: 'helden:settings',
        description: 'Öffnet die Helden Einstellungen',
        permissionLevel: 2
    }, settings);

    customCommandRegistry.registerCommand({
        name: 'helden:linkhearth',
        description: 'Setzt linkheart',
        permissionLevel: 2,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'Name 1' },
            { type: CustomCommandParamType.String, name: 'Name 2' }
        ]
    }, linkhearth);

    customCommandRegistry.registerCommand({
        name: 'helden:brückenbauer',
        description: 'Einfach nur Brückenbauer',
        permissionLevel: 0
    }, brueckenbauer)
})