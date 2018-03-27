import { random } from 'lodash';

const dict = [
    'ad',
    'aliqua',
    'amet',
    'anim',
    'aute',
    'cillum',
    'commodo',
    'culpa',
    'do',
    'dolor',
    'duis',
    'elit',
    'enim',
    'esse',
    'est',
    'et',
    'ex',
    'fugiat',
    'id',
    'in',
    'ipsum',
    'irure',
    'labore',
    'Lorem',
    'magna',
    'minim',
    'mollit',
    'nisi',
    'non',
    'nulla',
    'officia',
    'pariatur',
    'quis',
    'sint',
    'sit',
    'sunt',
    'tempor',
    'ut',
    'velit',
    'veniam',
];

export default () => dict[random(0, dict.length - 1)];
