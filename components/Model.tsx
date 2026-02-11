/* eslint-disable react/no-unknown-property */
import { getStatusColor } from "@/utils/statusColors";
import { useGLTF } from "@react-three/drei/native";
import { useFrame } from "@react-three/fiber/native";
import { useEffect, useMemo, useRef } from "react";
import { MathUtils, Mesh, MeshStandardMaterial, Object3D } from "three";

export default function Model({
  uri,
  isOpen,
  showRoots,
  odontogram,
  onToothSelect,
  selectedToothName,
  ...props
}: {
  uri: string;
  isOpen: boolean;
  showRoots: boolean;
  odontogram?: any;
  onToothSelect?: (toothName: string | null) => void;
  selectedToothName?: string | null;
  [key: string]: any;
}) {
  const gltf = useGLTF(uri);
  // Clonamos la escena para evitar bugs cuando se navega y regresa
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  const lowerJawRef = useRef<Object3D>(null); // <--- Cambiado a Object3D o any
  const upperJawRef = useRef<Object3D>(null); // <--- Cambiado a Object3D o any
  // Ref para rastrear el diente (Grupo) seleccionado
  const selectedToothRef = useRef<Object3D | null>(null);

  // Guardamos posiciones iniciales para no perder el punto de referencia
  const initialY = useRef<{ upper: number; lower: number }>({
    upper: 0,
    lower: 0,
  });

  // 1. Setup inicial de materiales y referencias
  useEffect(() => {
    scene.traverse((child) => {
      // Nota: child puede ser Mesh o Group ahora

      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        // Guardar material original del GLTF si no existe
        if (!mesh.userData.gltfMaterial) {
          mesh.userData.gltfMaterial = mesh.material;
        }
      }

      // 1. Detectar Mandíbulas por sus NUEVOS nombres
      if (child.name === "Lower_Jaw") {
        lowerJawRef.current = child;
        initialY.current.lower = child.position.y;
      }
      if (child.name === "Upper_Jaw") {
        upperJawRef.current = child;
        initialY.current.upper = child.position.y;
      }

      // 2. Búsqueda inteligente de encías basada en los nombres reales del modelo
      if (child.name.toLowerCase().includes("jaw")) {
        const mesh = child as Mesh;
        // Clonamos el material para no afectar otros objetos y asignamos color rosa
        const pinkMaterial = (mesh.material as MeshStandardMaterial).clone();
        pinkMaterial.color.set("#AA565C"); // Color rosa encía realista
        pinkMaterial.roughness = 0.4; // Un poco húmedo/brillante
        pinkMaterial.metalness = 0.0; // Elimina el efecto metálico

        mesh.material = pinkMaterial;
        // IMPORTANT: Actualizar el material base en userData para que el siguiente efecto lo respete
        mesh.userData.gltfMaterial = pinkMaterial;
      }
    });
  }, [scene]);

  // Efecto para aplicar colores según el Odontograma
  useEffect(() => {
    if (!odontogram) return;

    // Crear mapa de estados: nombre_mesh -> status
    const statusMap = new Map<string, string>();
    if (odontogram.tooth) {
      odontogram.tooth.forEach((t: any) => {
        if (t.toothsection) {
          t.toothsection.forEach((s: any) => {
            // Asignamos el estado al nombre de la sección (ej: "11_Distal")
            statusMap.set(s.name, s.localStatus);
          });
        }
      });
    }

    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const status = statusMap.get(mesh.name);
        const colorHex = getStatusColor(status);

        let targetMaterial = mesh.userData.gltfMaterial;

        // Si hay color personalizado (distinto de white/null), creamos material coloreado
        if (colorHex) {
          // Chequear si ya tenemos un material cacheado para e este color en este mesh para no crear mil clones
          if (!mesh.userData.colorMaterials) mesh.userData.colorMaterials = {};

          if (!mesh.userData.colorMaterials[colorHex]) {
            const baseMat = (
              mesh.userData.gltfMaterial as MeshStandardMaterial
            ).clone();
            baseMat.color.set(colorHex);
            mesh.userData.colorMaterials[colorHex] = baseMat;
          }
          targetMaterial = mesh.userData.colorMaterials[colorHex];
        }

        // Aplicamos el material
        // LÓGICA DE INTERACCIÓN CON SELECCIÓN:
        // Si el padre (Diente) está seleccionado, el mesh está dorado actualmente.
        // No debemos quitar el dorado, sino actualizar el 'originalMaterial' que se restaurará.

        const parent = mesh.parent;
        const isSelected = parent && parent.userData.isSelected;

        mesh.userData.originalMaterial = targetMaterial; // Actualizamos siempre el "backing" material

        if (!isSelected) {
          mesh.material = targetMaterial;
        }
      }
    });
  }, [odontogram, scene]);

  // Nuevo efecto para manejar selección externa (por props)
  useEffect(() => {
    // 1. Limpiar selección anterior si es diferente
    if (selectedToothRef.current) {
      if (
        selectedToothName &&
        selectedToothRef.current.name === selectedToothName
      )
        return;

      // Restaurar material anterior
      selectedToothRef.current.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          if (mesh.userData.originalMaterial) {
            mesh.material = mesh.userData.originalMaterial;
          }
        }
      });
      selectedToothRef.current.userData.isSelected = false;
      selectedToothRef.current = null;
    }

    if (!selectedToothName) return;

    // 2. Buscar el nuevo objeto seleccionado utilizando recursividad
    let foundObject: Object3D | undefined;

    const findObject = (obj: Object3D): Object3D | undefined => {
      if (obj.name === selectedToothName) return obj;
      for (const child of obj.children) {
        const found = findObject(child);
        if (found) return found;
      }
      return undefined;
    };

    foundObject = findObject(scene);

    // 3. Aplicar selección si se encontró
    if (foundObject) {
      foundObject.userData.isSelected = true;
      selectedToothRef.current = foundObject;

      foundObject.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          if (!mesh.userData.originalMaterial) {
            mesh.userData.originalMaterial =
              mesh.userData.gltfMaterial || mesh.material;
          }
          const mat = mesh.userData.originalMaterial;
          if (mat && typeof mat.clone === "function") {
            const clonedMat = mat.clone();
            if (clonedMat.color) {
              clonedMat.color.set("#FFD700");
            }
            mesh.material = clonedMat;
          }
        }
      });
    }
  }, [selectedToothName, scene]);

  // Efecto para ocultar/mostrar las encías (no todo el objeto) según showRoots
  useEffect(() => {
    const setJawVisibility = (jaw: Object3D | null, visible: boolean) => {
      if (jaw && (jaw as Mesh).isMesh) {
        const mesh = jaw as Mesh;
        // 1. Visual: Ocultar material (sin ocultar hijos)
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => (m.visible = visible));
        } else {
          mesh.material.visible = visible;
        }

        // 2. Interacción: Desactivar raycast para poder hacer clic en las raíces detrás
        if (!visible) {
          mesh.raycast = () => {}; // No interceptar clics
        } else {
          mesh.raycast = Mesh.prototype.raycast; // Restaurar comportamiento original
        }
      }
    };

    setJawVisibility(lowerJawRef.current, !showRoots);
    setJawVisibility(upperJawRef.current, !showRoots);
  }, [showRoots, scene]);

  // Animación suave frame a frame
  useFrame((state, delta) => {
    const speed = delta * 5;
    // Factor de separación (ajusta este valor si es mucho o poco)
    // Como el modelo es gigante (escala 0.04), un desplazamiento de 20 unidades locales puede ser apropiado
    const separatorOffset = 0.2;

    if (lowerJawRef.current) {
      // Mandíbula inferior baja (rotación positiva)
      const targetRotationLower = isOpen ? 0.6 : 0; // Ángulo aumentado a 0.6
      // Separación vertical hacia abajo
      const targetYLower = isOpen
        ? initialY.current.lower - separatorOffset
        : initialY.current.lower;

      lowerJawRef.current.rotation.x = MathUtils.lerp(
        lowerJawRef.current.rotation.x,
        targetRotationLower,
        speed,
      );
      lowerJawRef.current.position.y = MathUtils.lerp(
        lowerJawRef.current.position.y,
        targetYLower,
        speed,
      );
    }

    if (upperJawRef.current) {
      // Mandíbula superior sube (rotación negativa)
      const targetRotationUpper = isOpen ? -0.6 : 0; // Ángulo aumentado a -0.6
      // Separación vertical hacia arriba
      const targetYUpper = isOpen
        ? initialY.current.upper + separatorOffset
        : initialY.current.upper;

      upperJawRef.current.rotation.x = MathUtils.lerp(
        upperJawRef.current.rotation.x,
        targetRotationUpper,
        speed,
      );
      upperJawRef.current.position.y = MathUtils.lerp(
        upperJawRef.current.position.y,
        targetYUpper,
        speed,
      );
    }
  });

  const handleToothClick = (e: any) => {
    e.stopPropagation();
    const clickedPart = e.object;

    // --- ALGORITMO: BUSCAR EL PADRE "DIENTE" ---
    // Subimos por la jerarquía desde la parte clickeada (ej: 38_Distal)
    // hasta encontrar el objeto contenedor (ej: Tooth_38)
    let toothGroup = clickedPart;

    // Buscamos hacia arriba mientras exista padre y no sea la escena
    while (toothGroup) {
      if (toothGroup.name.toLowerCase().includes("tooth")) {
        break; // ¡Encontramos el contenedor del diente!
      }
      toothGroup = toothGroup.parent;

      // Seguridad: Si llegamos a la mandíbula o a la raíz, paramos
      if (
        !toothGroup ||
        toothGroup.name.toLowerCase().includes("jaw") ||
        toothGroup.type === "Scene"
      ) {
        toothGroup = null;
        break;
      }
    }

    // Si encontramos un diente válido...
    if (toothGroup) {
      console.log("Diente completo seleccionado:", toothGroup.name);

      // 1. DESELECCIONAR ANTERIOR (Si existe y es diferente)
      if (selectedToothRef.current && selectedToothRef.current !== toothGroup) {
        const prevGroup = selectedToothRef.current;
        // Recorremos TODOS los hijos del diente anterior para restaurar color
        prevGroup.traverse((child) => {
          if ((child as Mesh).isMesh && child.userData.originalMaterial) {
            (child as Mesh).material = child.userData.originalMaterial;
          }
        });
        prevGroup.userData.isSelected = false;
        selectedToothRef.current = null;
      }

      // 2. TOGGLE DEL DIENTE ACTUAL
      const isSelected = toothGroup.userData.isSelected;

      // Recorremos TODOS los hijos (partes) del diente actual
      toothGroup.traverse((child: any) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;

          if (!isSelected) {
            // --- ACTIVAR SELECCIÓN ---
            // Guardar material original de CADA parte
            if (!mesh.userData.originalMaterial) {
              mesh.userData.originalMaterial = mesh.material;
            }

            const mat = mesh.userData.originalMaterial;
            if (mat && typeof mat.clone === "function") {
              const clonedMat = mat.clone();
              if (clonedMat.color) {
                clonedMat.color.set("#FFD700");
              }
              mesh.material = clonedMat;
            }
          } else {
            // --- DESACTIVAR SELECCIÓN ---
            if (mesh.userData.originalMaterial) {
              mesh.material = mesh.userData.originalMaterial;
            }
          }
        }
      });

      // Actualizar estado
      toothGroup.userData.isSelected = !isSelected;
      selectedToothRef.current = !isSelected ? toothGroup : null;

      // Notificar al padre
      if (onToothSelect) {
        onToothSelect(selectedToothRef.current?.name || null);
      }
    }
  };

  return <primitive {...props} object={scene} onClick={handleToothClick} />;
}
