/* eslint-disable react/no-unknown-property */
import { getStatusColor } from "@/utils/statusColors";
import { useGLTF } from "@react-three/drei/native";
import { useEffect, useMemo, useRef } from "react";
import { Mesh, MeshStandardMaterial } from "three";

export default function SingleToothModel({
  uri,
  toothData,
  onFaceSelect,
  selectedFaceName,
  onLoadedFaces,
  ...props
}: {
  uri: string;
  toothData?: any;
  onFaceSelect?: (faceName: string | null) => void;
  selectedFaceName?: string | null;
  onLoadedFaces?: (faces: string[]) => void;
  [key: string]: any;
}) {
  const gltf = useGLTF(uri);
  // Clonar la escena para evitar bugs de caché y estado compartido entre instancias
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  const selectedFaceRef = useRef<Mesh | null>(null);

  // 1. Setup inicial y recolección de caras
  useEffect(() => {
    const faces: string[] = [];
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        faces.push(mesh.name);
        if (!mesh.userData.gltfMaterial) {
          mesh.userData.gltfMaterial = mesh.material;
        }
      }
    });
    if (onLoadedFaces) {
      // Ordenar alfabéticamente o por algún criterio si se desea
      onLoadedFaces(faces.sort());
    }
  }, [scene, onLoadedFaces]);

  // 2. Aplicar colores según toothData
  useEffect(() => {
    if (!toothData || !toothData.toothsection) return;

    // Mapa status
    const statusMap = new Map<string, string>();
    toothData.toothsection.forEach((s: any) => {
      statusMap.set(s.name, s.localStatus);
    });

    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const status = statusMap.get(mesh.name);
        const colorHex = getStatusColor(status);

        let targetMaterial = mesh.userData.gltfMaterial;

        if (colorHex) {
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

        // Si esta cara está seleccionada, NO sobreescribimos aquí (lo maneja el effect de selección)
        // Solo actualizamos "originalMaterial" para que cuando se deseleccione vuelva a esto
        mesh.userData.originalMaterial = targetMaterial;

        if (selectedFaceRef.current !== mesh) {
          mesh.material = targetMaterial;
        }
      }
    });
  }, [toothData, scene]);

  // 3. Manejo de Selección Controlada
  useEffect(() => {
    // Si no hay prop, operamos como no controlado (fallback si fuera necesario, pero aquí asumimos controlado)
    // Pero si selectedFaceName es undefined, no hacemos nada (permitimos uso legacy si se quisiera, pero vamos a forzarlo)

    const targetName = selectedFaceName;

    // Restaurar anterior si ha cambiado
    if (
      selectedFaceRef.current &&
      selectedFaceRef.current.name !== targetName
    ) {
      if (selectedFaceRef.current.userData.originalMaterial) {
        selectedFaceRef.current.material =
          selectedFaceRef.current.userData.originalMaterial;
      }
      selectedFaceRef.current = null;
    }

    if (targetName) {
      const targetMesh = scene.getObjectByName(targetName) as Mesh;
      if (targetMesh && targetMesh.isMesh) {
        // Asegurar backup
        if (!targetMesh.userData.originalMaterial) {
          targetMesh.userData.originalMaterial =
            targetMesh.userData.gltfMaterial || targetMesh.material;
        }

        const mat = targetMesh.userData.originalMaterial;
        if (mat && typeof mat.clone === "function") {
          const clonedMat = mat.clone();
          if (clonedMat.color) {
            clonedMat.color.set("#FFD700");
          }
          targetMesh.material = clonedMat;
          selectedFaceRef.current = targetMesh;
        }
      }
    }
  }, [selectedFaceName, scene, toothData]); // toothData incluido por si cambia el originalMaterial

  const handleFaceClick = (e: any) => {
    e.stopPropagation();
    const clickedMesh = e.object as Mesh;
    if (!clickedMesh.isMesh) return;

    // Solo notificamos al padre. El padre actualizará selectedFaceName, y el useEffect hará el cambio visual.
    if (onFaceSelect) {
      // Toggle: si ya estaba seleccionado, enviamos null
      if (selectedFaceName === clickedMesh.name) {
        onFaceSelect(null);
      } else {
        onFaceSelect(clickedMesh.name);
      }
    }
  };

  return <primitive {...props} object={scene} onClick={handleFaceClick} />;
}
