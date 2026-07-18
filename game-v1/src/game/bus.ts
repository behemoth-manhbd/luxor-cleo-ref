// Tiny event bus between DOM/React input and the Pixi presenter (skip, press-anywhere).
export const bus = new EventTarget()

export function emitSkip() {
  bus.dispatchEvent(new Event('skip'))
}
