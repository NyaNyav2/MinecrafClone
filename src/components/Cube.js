import { useBox } from "@react-three/cannon";
import { useState } from "react";
import { useStore } from "../hooks/useStore";
import * as textures from "../images/textures";

export const Cube = ({ position, texture }) => {
  // Quản lý trạng thái khi chuột di qua khối
  const [isHovered, setIsHovered] = useState(false);

  // Tạo một khối vật lý tĩnh tại vị trí đã cho
  const [ref] = useBox(() => ({
    type: 'Static',
    position
  }));

  // Lấy các hàm addCube và removeCube từ store toàn cục để tương tác với danh sách các khối
  const [addCube, removeCube] = useStore((state) => [state.addCube, state.removeCube]);

  // Lấy texture tương ứng từ thư mục textures
  const activeTexture = textures[texture + 'Texture'];

  return (
    <mesh
      // Xử lý khi chuột di chuyển vào khối
      onPointerMove={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      // Xử lý khi chuột di chuyển ra khỏi khối
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
      }}
      // Xử lý khi click vào khối
      onClick={(e) => {
        e.stopPropagation();
        const clickedFace = Math.floor(e.faceIndex / 2); // Tính toán mặt nào của khối bị click
        const { x, y, z } = ref.current.position; // Lấy tọa độ của khối

        // Nếu nhấn phím Alt, xóa khối
        if (e.altKey) {
          removeCube(x, y, z);
          return;
        }

        // Thêm khối mới ở mặt đối diện
        if (clickedFace === 0) { // Mặt trước
          addCube(x + 1, y, z);
        } else if (clickedFace === 1) { // Mặt sau
          addCube(x - 1, y, z);
        } else if (clickedFace === 2) { // Mặt trên
          addCube(x, y + 1, z);
        } else if (clickedFace === 3) { // Mặt dưới
          addCube(x, y - 1, z);
        } else if (clickedFace === 4) { // Mặt phải
          addCube(x, y, z + 1);
        } else if (clickedFace === 5) { // Mặt trái
          addCube(x, y, z - 1);
        }
      }}
      ref={ref}
    >
      <boxGeometry attach="geometry" />
      <meshStandardMaterial
        color={isHovered ? 'grey' : 'white'} // Thay đổi màu khi chuột di qua
        map={activeTexture} // Áp dụng texture
        transparent={true}
        opacity={texture === 'glass' ? 0.6 : 1}
        attach="material"
      />
    </mesh>
  );
};