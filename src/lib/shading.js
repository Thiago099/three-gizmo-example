import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import * as THREE from 'three';
export { AddShading }
function AddShading(renderer, camera, scene, composer)
{
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap | THREE.PCFShadowMap |  THREE.VSMShadowMap | THREE.PCFSoftShadowMap
    renderer.shadowMap.soft = true;
    renderer.shadowMap.bias = -0.0001;
    renderer.shadowMap.darkness = 1;
    renderer.shadowMap.width = 2048;
    renderer.shadowMap.height = 2048;


    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( 0xffffff, 0);


    const ssaoPass = new SSAOPass( scene, camera, 1000, 1000 );
    ssaoPass.kernelRadius = 2;
    ssaoPass.minDistance = 1e-10;
    ssaoPass.maxDistance = 0.1;
    //quality
    

    ssaoPass.output = SSAOPass.OUTPUT.Default;

    composer.addPass( ssaoPass )

}