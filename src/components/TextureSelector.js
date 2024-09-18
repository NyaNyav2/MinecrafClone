import { useEffect, useState } from 'react';
import { useStore } from "../hooks/useStore";
import { useKeyboard } from "../hooks/useKeyboard";
import { dirtImg, grassImg, glassImg, logImg, woodImg } from '../images/images';

// Tạo một đối tượng chứa các hình ảnh texture với tên tương ứng
const images = {
  dirt: dirtImg,
  grass: grassImg,
  glass: glassImg,
  wood: woodImg,
  log: logImg,
};

export const TextureSelector = () => {
  // Quản lý trạng thái hiển thị của menu chọn texture
  const [visible, setVisible] = useState(false);

  // Lấy texture hiện tại và hàm để cập nhật texture từ store
  const [activeTexture, setTexture] = useStore((state) => [state.texture, state.setTexture]);

  // Lấy trạng thái các phím số từ hook useKeyboard
  const {
    dirt,
    grass,
    glass,
    wood,
    log,
  } = useKeyboard();

  // Hiệu ứng phụ: Cập nhật texture khi một phím số được nhấn
  useEffect(() => {
    // Tạo một đối tượng chứa các phím số và trạng thái của chúng
    const textures = {
      dirt,
      grass,
      glass,
      wood,
      log,
    };

    // Tìm phím số nào đang được nhấn
    const pressedTexture = Object.entries(textures).find(([k, v]) => v);

    // Nếu có phím số được nhấn, cập nhật texture hiện tại
    if (pressedTexture) {
      setTexture(pressedTexture[0]);
    }
  }, [setTexture, dirt, grass, glass, wood, log]);

  // Hiệu ứng phụ: Hiển thị menu trong 2 giây khi texture được thay đổi
  useEffect(() => {
    // Thiết lập thời gian hiển thị của menu
    const visibilityTimeout = setTimeout(() => {
      setVisible(false);
    }, 2000);

    // Hiển thị menu
    setVisible(true);

    // Hủy bỏ timeout khi component bị unmount
    return () => {
      clearTimeout(visibilityTimeout);
    };
  }, [activeTexture]);

  return visible && (
    <div className="absolute centered texture-selector">
      {/* Render các hình ảnh texture */}
      {Object.entries(images).map(([k, src]) => (
        <img
          key={k}
          src={src}
          alt={k}
          className={`${k === activeTexture ? 'active' : ''}`}
        />
      ))}
    </div>
  );
};