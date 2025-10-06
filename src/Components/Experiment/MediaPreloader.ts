import { ElementRef, Signal, signal, Type } from '@angular/core';

export class MediaPreloader {
  preloadedScene = false;
  preloadingVideo = false;
  preloadedVideo = signal(false);
  constructor(
    public experiment: Signal<IExperiment>,
    public videoNode: Signal<ElementRef<HTMLVideoElement>>,
    public scenePreloader?: () => Promise<Type<unknown>>,
  ) {}

  public preloadLabsScene() {
    if (!this.preloadedScene) {
      this.preloadedScene = true;
      void this.scenePreloader?.();
    }
  }

  public preloadLabsVideo() {
    if (this.preloadingVideo || !this.videoNode().nativeElement) {
      return;
    }
    const videoNode = this.videoNode().nativeElement;
    this.preloadLabsScene();
    if (this.preloadedVideo()) {
      void this.videoNode()?.nativeElement?.play?.();
      return;
    }
    this.preloadingVideo = true;
    videoNode.oncanplaythrough = () => {
      this.preloadedVideo.set(true);
      this.preloadingVideo = false;
      void videoNode.play();
    };
    videoNode.onerror = () => {
      this.preloadingVideo = false;
    };
    videoNode.src = this.experiment().video;
  }

  public mouseOverPreloader = () => {
    this.preloadLabsScene();
    this.preloadLabsVideo();
  };
}

export interface IExperiment {
  title: string;
  description: string;
  image: string;
  video: string;
}
