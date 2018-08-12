import { random } from './_';

const dict: Array<string> = 'ad,aliqua,amet,anim,aute,cillum,commodo,culpa,do,dolor,duis,elit,enim,esse,est,et,ex,fugiat,id,in,ipsum,irure,labore,lorem,magna,minim,mollit,nisi,non,nulla,officia,pariatur,quis,sint,sit,sunt,tempor,ut,velit,veniam'
    .split(',');

export default (): string => dict[random(0, dict.length - 1)];
