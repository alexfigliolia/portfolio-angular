export class TiltController<T extends HTMLElement = HTMLElement> {
  private top = 0;
  private left = 0;
  private width = 0;
  private height = 0;
  constructor(private setAnimationFrame: ISetAnimationFrame) {}

  public mouseEnter = (e: MouseEvent | TouchEvent) => {
    if (e.currentTarget) {
      this.cacheTargetData(e.currentTarget);
    }
    this.setFrame(this.getRotations(...this.getCoordinates(e)), 0.5);
  };

  public mouseMove = (e: MouseEvent | TouchEvent) => {
    this.setFrame(this.getRotations(...this.getCoordinates(e)), 0);
  };

  public mouseLeave = () => {
    this.setAnimatedProperties({
      rotX: 0,
      rotY: 0,
      scale: 1,
      transition: '0.5s',
      boxShadow: 'none',
    });
  };

  private cacheTargetData(eventTarget: EventTarget) {
    const target = eventTarget as T;
    const { top, left, height, width } = target.getBoundingClientRect();
    this.top = top;
    this.height = height;
    const offset = width * 0.2;
    this.left = left - offset / 2;
    this.width = width + width * 0.2;
  }

  private getRotations(x: number, y: number): [x: number, y: number] {
    const mouseY = y - this.top;
    const mouseX = x - this.left;
    const offsetX = 0.5 - mouseX / this.width;
    const offsetY = 0.5 - mouseY / this.height;
    return [offsetY * 50, offsetX * 20];
  }

  private setFrame([x, y]: Coordinate, duration: number) {
    this.setAnimatedProperties({
      rotX: x,
      rotY: y,
      transition: `${duration}s`,
      scale: 1.1,
      boxShadow: `0 ${x}px ${
        this.height / 5
      }px rgba(0,0,0,0.5), ${x}px ${y}px ${this.width / 5}px rgba(0,0,0,0.45)`,
    });
  }

  private getCoordinates(e: MouseEvent | TouchEvent): [clientX: number, clientY: number] {
    if ('touches' in e) {
      return [e.touches[0].clientX, e.touches[0].clientY];
    }
    return [e.clientX, e.clientY];
  }

  private setAnimatedProperties(frame: IAnimationFrame) {
    this.setAnimationFrame({
      transform: `rotateX(${frame.rotX}deg) rotateY(${frame.rotY}deg) skew(-10deg) scale(${frame.scale})`,
      transitionDuration: `${frame.transition}`,
      boxShadow: frame.boxShadow,
    });
  }
}

export type Coordinate = [x: number, y: number];

export interface IAnimationFrame {
  rotX: number;
  rotY: number;
  transition: number | string;
  scale: number;
  boxShadow: string;
}

export type ISetAnimationFrame = (frame: Partial<CSSStyleDeclaration>) => void;
