import { useGLTF } from "@react-three/drei/native";
import { useRef } from "react";
import { Mesh, MeshStandardMaterial } from "three";

export default function SingleToothModel({
  uri,
  onFaceSelect,
  ...props
}: {
  uri: string;
  onFaceSelect?: (faceName: string | null) => void;
  [key: string]: any;
}) {
  const gltf = useGLTF(uri);
  const selectedFaceRef = useRef<Mesh | null>(null);

  const handleFaceClick = (e: any) => {
    e.stopPropagation();
    const clickedMesh = e.object as Mesh;

    if (!clickedMesh.isMesh) return;

    // Deseleccionar anterior si es diferente
    if (selectedFaceRef.current && selectedFaceRef.current !== clickedMesh) {
      if (selectedFaceRef.current.userData.originalMaterial) {
        selectedFaceRef.current.material =
          selectedFaceRef.current.userData.originalMaterial;
      }
    }

    // Toggle selección actual
    if (clickedMesh !== selectedFaceRef.current) {
      if (!clickedMesh.userData.originalMaterial) {
        clickedMesh.userData.originalMaterial = clickedMesh.material;
      }
      // Clonar material y cambiar color
      clickedMesh.material = (
        clickedMesh.userData.originalMaterial as MeshStandardMaterial
      ).clone();
      (clickedMesh.material as MeshStandardMaterial).color.set("#FFD700"); // Color de selección (Dorado)

      selectedFaceRef.current = clickedMesh;
      if (onFaceSelect) onFaceSelect(clickedMesh.name);
    } else {
      // Si clicamos el mismo, deseleccionar
      if (clickedMesh.userData.originalMaterial) {
        clickedMesh.material = clickedMesh.userData.originalMaterial;
      }
      selectedFaceRef.current = null;
      if (onFaceSelect) onFaceSelect(null);
    }
  };

  return <primitive {...props} object={gltf.scene} onClick={handleFaceClick} />;
}
