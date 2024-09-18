import { PointerLockControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export const FPV = () => {
  // Lấy tham chiếu đến camera và canvas (nơi hiển thị cảnh 3D)
  const { camera, gl } = useThree();

  // Tạo chế độ điều khiển bằng chuột để xem theo góc nhìn thứ nhất
  return (
    <PointerLockControls args={[camera, gl.domElement]} />
  );
};