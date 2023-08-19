import * as THREE from "three"
export { forEachVertex }
function forEachVertex(geometry, callback)
{
    const vertices = geometry.getAttribute('position');
  
    for (let i = 0; i < vertices.count; i++) {
      const vertex = new THREE.Vector3(vertices.getX(i), vertices.getY(i), vertices.getZ(i));
      callback(vertex)
      vertices.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
  
    vertices.needsUpdate = true;
}