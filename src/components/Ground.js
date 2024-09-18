import { usePlane } from "@react-three/cannon"; // Nhập hook `usePlane` để tạo mặt phẳng vật lý
import { groundTexture } from "../images/textures"; // Nhập texture mặt đất
import { useStore } from '../hooks/useStore'; // Nhập hook để truy cập trạng thái toàn cục

export const Ground = () => {
  // Tạo mặt phẳng vật lý với hướng và vị trí xác định
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0], // Xoay mặt phẳng 90 độ theo trục x
    position: [0, -0.5, 0] // Đặt mặt phẳng ở dưới gốc tọa độ
  }));

  // Lấy hàm `addCube` để thêm khối mới vào cảnh
  const [addCube] = useStore((state) => [state.addCube]);

  // Lặp lại texture mặt đất 100 lần theo cả chiều ngang và chiều dọc
  groundTexture.repeat.set(100, 100);

  return (
    <mesh // Tạo một lưới để biểu diễn mặt phẳng
      onClick={(e) => {
        // Ngăn sự kiện click lan truyền lên phần tử cha
        e.stopPropagation();

        // Lấy tọa độ điểm được click và làm tròn
        const [x, y, z] = Object.values(e.point).map(val => Math.ceil(val));

        // Thêm khối mới vào cảnh tại tọa độ đã tính
        addCube(x, y, z);
      }}
      ref={ref} // Gắn tham chiếu đến mặt phẳng
    >
      <planeGeometry attach='geometry' args={[100, 100]} /> // Tạo hình học cho mặt phẳng
      <meshStandardMaterial attach='material' map={groundTexture} /> // Áp dụng texture mặt đất lên vật liệu
    </mesh>
  );
};