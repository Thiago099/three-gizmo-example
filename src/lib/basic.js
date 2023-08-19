import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { OrbitControls } from './OrbitControls.js';
export { basic }
function basic(canvas)
{
    let render = null
    // Set up the scene, camera, and renderer
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    const renderer = new WebGLRenderer({canvas});
    renderer.setPixelRatio( window.devicePixelRatio );
        
    renderer.setClearColor( 0xffffff, 0);
    camera.position.set( 20, 20, 20 );


        
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.target.set(0,0,0)

    const animate = () => {
        if(render != null)
        {
            render()
        }
        requestAnimationFrame(animate);
      };

      animate();
      return {scene, camera, renderer, render(x){render = x}}
      
}


// Create an instance of OrbitControls


