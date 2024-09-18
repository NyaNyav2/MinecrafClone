import { useFrame, useThree } from "@react-three/fiber"
import { useSphere } from "@react-three/cannon"
import { useEffect, useRef } from "react"
import { Vector3 } from "three"
import { useKeyboard } from "../hooks/useKeyboard"

// Hằng số cho lực nhảy và tốc độ di chuyển
const JUMP_FORCE = 4;
const SPEED = 4;

export const Player = () => {
  // Lấy trạng thái bàn phím (đi lên, xuống, trái, phải, nhảy)
  const { moveBackward, moveForward, moveRight, moveLeft, jump } = useKeyboard()

  // Lấy tham chiếu đến camera
  const { camera } = useThree()

  // Tạo một hình cầu vật lý, đại diện cho nhân vật
  const [ref, api] = useSphere(() => ({
    mass: 1, // Khối lượng của vật thể
    type: 'Dynamic', // Loại vật thể động
    position: [0, 1, 0], // Vị trí ban đầu
  }))

  // Lưu trữ vận tốc và vị trí hiện tại của nhân vật
  const vel = useRef([0, 0, 0])
  const pos = useRef([0, 0, 0])

  // Cập nhật vận tốc và vị trí khi chúng thay đổi
  useEffect(() => {
    api.velocity.subscribe((v) => vel.current = v)
  }, [api.velocity])
  useEffect(() => {
    api.position.subscribe((p) => pos.current = p)
  }, [api.position]) 

  // Cập nhật cảnh trong mỗi khung hình
  useFrame(() => {
    // Cập nhật vị trí camera theo vị trí nhân vật
    camera.position.copy(new Vector3(pos.current[0], pos.current[1], pos.current[2]))

    // Tính toán hướng di chuyển
    const direction = new Vector3()
    const frontVector = new Vector3(
      0, 0, (moveBackward ? 1 : 0) - (moveForward ? 1 : 0)
    )
    const sideVector = new Vector3(
      (moveLeft ? 1 : 0) - (moveRight ? 1 : 0), 0, 0
    )

    // Tính toán vector hướng di chuyển cuối cùng
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation)

    // Cập nhật vận tốc của nhân vật
    api.velocity.set(direction.x, vel.current[1], direction.z)

    // Kiểm tra nếu người dùng nhấn nút nhảy và nhân vật đang ở trên mặt đất
    if (jump && Math.abs(vel.current[1]) < 0.05) {
      // Áp dụng lực nhảy lên vận tốc
      api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2])
    }
  })

  return (
    <mesh ref={ref}></mesh>
  )
}