export type GateType = "AND" | "OR" | "NOT" | "XOR";

export function evaluateGate(gate: GateType, inputA: boolean, inputB: boolean): boolean {
  switch (gate) {
    case "AND":
      return inputA && inputB;
    case "OR":
      return inputA || inputB;
    case "NOT":
      return !inputA;
    case "XOR":
      return inputA !== inputB;
  }
}