import { GizmoHelper, GizmoViewport } from "@react-three/drei";

export const Gizmo = () => {
  return (
    <GizmoHelper alignment={"bottom-right"} margin={[80, 80]}>
      <GizmoViewport
        axisColors={["red", "green", "blue"]}
        labelColor={"black"}
        hideNegativeAxes={false}
        renderOrder={1}
      />
    </GizmoHelper>
  );
};
