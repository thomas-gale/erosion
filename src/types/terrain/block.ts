import * as THREE from 'three';
import { Ore } from './ores';

export interface Block {
	position: THREE.Vector3;
	ore: Ore;
}
