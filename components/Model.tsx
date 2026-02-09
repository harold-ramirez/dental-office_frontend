import { useGLTF } from "@react-three/drei/native";
import { useFrame } from "@react-three/fiber/native";
import { useEffect, useRef } from "react";
import { MathUtils, Mesh, MeshStandardMaterial, Object3D } from "three";

export default function Model({
  uri,
  isOpen,
  showRoots,
  onToothSelect,
  ...props
}: {
  uri: string;
  isOpen: boolean;
  showRoots: boolean;
  onToothSelect?: (toothName: string | null) => void;
  [key: string]: any;
}) {
  const gltf = useGLTF(uri);
  const lowerJawRef = useRef<Object3D>(null); // <--- Cambiado a Object3D o any
  const upperJawRef = useRef<Object3D>(null); // <--- Cambiado a Object3D o any
  // Ref para rastrear el diente (Grupo) seleccionado
  const selectedToothRef = useRef<Object3D | null>(null);

  // Guardamos posiciones iniciales para no perder el punto de referencia
  const initialY = useRef<{ upper: number; lower: number }>({
    upper: 0,
    lower: 0,
  });

  useEffect(() => {
    gltf.scene.traverse((child) => {
      // Nota: child puede ser Mesh o Group ahora

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
        mesh.material = (mesh.material as MeshStandardMaterial).clone();
        (mesh.material as MeshStandardMaterial).color.set("#AA565C"); // Color rosa encía realista
        (mesh.material as MeshStandardMaterial).roughness = 0.4; // Un poco húmedo/brillante
        (mesh.material as MeshStandardMaterial).metalness = 0.0; // Elimina el efecto metálico
      }
    });
  }, [gltf]);

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
  }, [showRoots, gltf]);

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
            // Clonar y pintar
            mesh.material = (
              mesh.userData.originalMaterial as MeshStandardMaterial
            ).clone();
            (mesh.material as MeshStandardMaterial).color.set("#FFD700"); // Dorado
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

  return (
    <primitive {...props} object={gltf.scene} onClick={handleToothClick} />
  );
}
