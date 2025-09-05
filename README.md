@@
 | STL | `.stl` | Para prototipado rápido (sin materiales). |
+| STEP | `.step`, `.stp` | Procesado **100 % en navegador** vía `occt-import-js` (WASM). |
@@
 * Convierte OBJ/STL a glTF con [gltf-transform](https://github.com/gltf-transform/gltf-transform) o Blender para mejor rendimiento.  
+* Los archivos **STEP** se triangulan en cliente (puede tardar unos segundos según el tamaño); mantén el peso < **10 MB**.
