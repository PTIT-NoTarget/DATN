import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CloudinaryService } from '@tungle/core/services/cloudinary.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  selectedFile: File | null = null;
  imgUrl: string | null = null;
  isLoading = false;

  @Input() imgUrlInput: string | null = null; // image url ở trạng thái view
  @Input() mode: 0 | 1 | 2 = 0; // 0: create; 1: update; 2: view

  @Output() upload = new EventEmitter<IUploadRes>();

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['imgUrlInput']) {
      if (this.mode === 1 || this.mode === 2) {
        this.imgUrl = this.imgUrlInput;
      }
    }
  }

  constructor(private cloudinaryService: CloudinaryService) {}

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.uploadImage();
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.upload.emit({
      isLoading: this.isLoading,
      imgUrl: null
    });

    this.cloudinaryService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        this.imgUrl = response.secure_url;
        this.isLoading = false;
        this.upload.emit({
          isLoading: this.isLoading,
          imgUrl: response.secure_url
        });
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.isLoading = false;
      }
    });
  }

  clearImage() {
    this.imgUrl = null;
    this.upload.emit({
      isLoading: this.isLoading,
      imgUrl: null
    });
  }
}

export interface IUploadRes {
  isLoading: boolean;
  imgUrl: string | null;
}
