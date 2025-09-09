export interface IntensityLevel {
  label: string;
  colorClasses: string;
}

export function getJumpscareIntensity(count: number): IntensityLevel {
  if (count === 0) {
    return {
      label: "Safe",
      colorClasses: "bg-jumpscare-low-bg text-jumpscare-low",
    };
  }
  if (count <= 6) {
    return {
      label: "Mild",
      colorClasses: "bg-jumpscare-mild-bg text-jumpscare-mild",
    };
  }
  if (count <= 13) {
    return {
      label: "Moderate",
      colorClasses: "bg-jumpscare-moderate-bg text-jumpscare-moderate",
    };
  }
  if (count <= 20) {
    return {
      label: "Strong",
      colorClasses: "bg-jumpscare-strong-bg text-jumpscare-strong",
    };
  }
  return {
    label: "Intense",
    colorClasses: "bg-jumpscare-intense-bg text-jumpscare-intense",
  };
}