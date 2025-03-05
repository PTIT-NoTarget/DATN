import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private readonly CLOUD_NAME = 'dvfp9ajkd';
  private readonly UPLOAD_URL = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`;
  private readonly UPLOAD_PRESET = 'ml_default';
  private readonly FOLDER_UPLOAD = 'Daily';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<ICloudinaryImgUploadRes> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.UPLOAD_PRESET);
    formData.append('folder', this.FOLDER_UPLOAD);

    return this.http.post<ICloudinaryImgUploadRes>(this.UPLOAD_URL, formData);
  }
}

export interface ICloudinaryImgUploadRes {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  existing: boolean;
  original_filename: string;
}
