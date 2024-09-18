import create from 'zustand';
import { nanoid } from 'nanoid';

// Hàm lấy dữ liệu từ localStorage
const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key));

// Hàm lưu dữ liệu vào localStorage
const setLocalStorage = (key, value) => window.localStorage.setItem(key, JSON.stringify(value));

// Tạo một store để quản lý trạng thái của ứng dụng
export const useStore = create((set) => ({
    // Texture hiện tại đang sử dụng
    texture: 'dirt',

    // Mảng chứa danh sách các khối (cubes)
    cubes: getLocalStorage('cubes') || [],

    // Thêm một khối mới vào danh sách
    addCube: (x, y, z) => {
        set((prev) => ({
            cubes: [
                ...prev.cubes,
                {
                    key: nanoid(), // Tạo một ID duy nhất cho khối
                    pos: [x, y, z], // Vị trí của khối
                    texture: prev.texture // Texture của khối
                }
            ]
        }));
    },

    // Xóa một khối khỏi danh sách
    removeCube: (x, y, z) => {
        set((prev) => ({
            cubes: prev.cubes.filter(cube => {
                const [X, Y, Z] = cube.pos; // Lấy tọa độ của khối
                return X !== x || Y !== y || Z !== z; // Kiểm tra xem có phải khối cần xóa không
            })
        }));
    },

    // Thay đổi texture hiện tại
    setTexture: (texture) => {
        set(() => ({
            texture
        }));
    },

    // Lưu trạng thái hiện tại của các khối vào localStorage
    saveWorld: () => {
        set((prev) => {
            setLocalStorage('cubes', prev.cubes);
        });
    },

    // Reset trạng thái của các khối về mặc định
    resetWorld: () => {
        set(() => ({
            cubes: []
        }));
    },
}));