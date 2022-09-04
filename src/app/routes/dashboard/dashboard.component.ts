import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import {VgApiService} from '@videogular/ngx-videogular/core';


interface my_media {
  title: string,
  src: any,
  type: string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {

  fileName = '';

  preload= 'auto';
  api!: VgApiService;
  name = 'Angular';
  playlist: my_media[] = [
    {
      title: 'Pale Blue Dot',
      src: 'http://static.videogular.com/assets/videos/videogular.mp4',
      type: 'video/mp4'
    },
    {
      title: 'Big Buck Bunny',
      src: 'http://static.videogular.com/assets/videos/big_buck_bunny_720p_h264.mov',
      type: 'video/mp4'
    },
    {
      title: 'Elephants Dream',
      src: 'http://static.videogular.com/assets/videos/elephants-dream.mp4',
      type: 'video/mp4'
    }
  ];

  currentIndex = 0;
  currentItem = this.playlist[this.currentIndex];

  onFileSelected(event:any) {
    const file:File = event.target.files[0];
    if (file) {
      const media = file;
      const URL = window.URL || window.webkitURL;
      const objectURL = URL.createObjectURL(media);
      const mediaSrc = this.domSanitizer.bypassSecurityTrustUrl(objectURL);
      const mediaType = media.type;
      this.currentItem.type = mediaType;
      this.currentItem.src = mediaSrc;

      }
}

  onPlayerReady(api: VgApiService) {
      this.api = api;
      this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
      this.api.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));

      this.api.getDefaultMedia().subscriptions.ended.subscribe(
        () => {
            // Set the video to the beginning
            this.api.getDefaultMedia().currentTime = 0;
        }
    );
  }

  nextVideo() {
    this.currentIndex++;

    if (this.currentIndex === this.playlist.length) {
      this.currentIndex = 0;
    }

    this.currentItem = this.playlist[this.currentIndex];
  }

  playVideo() {
    this.api.play();
  }

  onClickPlaylistItem(item: any, index: number) {
    this.currentIndex = index;
    this.currentItem = item;
  }

  constructor(private cdr: ChangeDetectorRef, private domSanitizer: DomSanitizer) {}

  ngOnInit() {}
}
