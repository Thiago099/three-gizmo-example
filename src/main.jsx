import "./style.css"
import * as THREE from 'three';

import { CreateLights } from "./lib/lights";
import { basic } from "./lib/basic";


import { gizmo } from "three-gizmo";


import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { AddShading } from "./lib/shading";
import { mouseRay } from "three-gizmo/lib/raycaster";
import { forEachVertex } from "./lib/forEachVertex";

const canvas = <canvas width="1200" height="800"></canvas>


let helper

let selected = null
let lastTool = "none"
const objects = []

const menu = 
<div class="button-container" style="margin-right:30px">
    <span style="margin-top:30px">Gizmo</span>
    <button on:click={() => selected ? helper.move() : lastTool = "move"}>Move</button>
    <button on:click={() => selected ? helper.rotate() : lastTool = "rotate"}>Rotate</button>
    <button on:click={() => selected ? helper.scale() : lastTool = "scale"}>Scale</button>
    <button on:click={() => selected ? helper.none() : lastTool = "none"}>None</button>
    <span style="margin-top:30px">Geometry</span>
    <button on:click={addCube}>Add</button>
    <button on:click={deleteCube}>Delete</button>
</div>

const tips = 
<div class="tips">
    <h3>Tips</h3>
    <p>Ctrl + Left drag (Rotate camera)</p>
    <p>Ctrl + Right drag (Pan camera)</p>
    <p>Click in "Add" to create a cube</p>
    <p>Click in "Delete" to remove the selected cube</p>
    
</div>


menu.$parent(document.body)
canvas.$parent(document.body)
tips.$parent(document.body)

const { renderer, camera, scene, render } = basic(canvas)


CreateLights(scene);

helper = gizmo(camera, renderer)


helper.on("scale", scale=>{
    selected.scale.copy(scale)
})

helper.on("move", position=>{
    selected.position.copy(position)
})

helper.on("rotate", angle=>{
    selected.rotation.copy(angle)
})
helper.on("end-rotate",angle=>{

    const matrix = new THREE.Matrix4().makeRotationFromEuler(angle);

    forEachVertex(selected.geometry, vertex=>{
        vertex.applyMatrix4(matrix);
    })
  
    helper.setRotation(0,0,0)
})

helper.on("end-scale",scale=>{
    forEachVertex(selected.geometry, vertex=>{
        vertex.x *= scale.x
        vertex.y *= scale.y
        vertex.z *= scale.z
    })
    helper.setScale(1,1,1)
})



const composer = new EffectComposer( renderer );

// const renderPass = new RenderPass( scene, camera );
// composer.addPass( renderPass );

AddShading(renderer,camera, scene, composer)

const outlinePass = new OutlinePass( new THREE.Vector2( canvas.width, canvas.height), scene, camera );
composer.addPass( outlinePass );


const outputPass = new OutputPass();
composer.addPass( outputPass );

outlinePass.selectedObjects = [];
outlinePass.edgeStrength = 3;
outlinePass.visibleEdgeColor = new THREE.Color(0x00ffff);
outlinePass.hiddenEdgeColor =  new THREE.Color(0x00ffff);

const caster = mouseRay(canvas, camera)


canvas.addEventListener("click",x=>{
    if(helper.isHover()) return
    const ray = caster.cast(x,objects)
    if(ray.intersect)
    {
        select(ray.intersect.object)
    }
    else
    {
        select(null)

    }
},false)


render(() => {
    renderer.clear();
    composer.render()
    helper.render()
})


function addCube()
{
    const geometry = new THREE.BoxGeometry(10,10,10);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    objects.push(cube)
    select(cube)
}
function deleteCube()
{
    scene.remove(selected)
    objects.splice(objects.indexOf(selected),1)
    if(objects.length > 0)
    {
        select(objects[0])
    }
}



function select(item)
{
    if(item == null)
    {
        selected = null
        outlinePass.selectedObjects = [];
        lastTool = helper.selectedTool
        helper.none()
        return
    }
    selected = item
    outlinePass.selectedObjects = [selected];
    helper.setOrigin(selected.position)
    if(helper.selectedTool == "none")
    {
        helper[lastTool]()
    }
}