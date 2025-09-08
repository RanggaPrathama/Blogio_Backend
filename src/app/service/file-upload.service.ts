import { FileUpload } from "graphql-upload-ts";
import path from "path";
import { Service } from "typedi";
import fs, { createWriteStream } from "fs";
import { UploadOptions } from "graphql-upload-ts";
import { pipeline } from "stream/promises";

export interface UploadOption extends UploadOptions {
  Id?: string | undefined;
  directory?: string | undefined;
  subDirectory?: string | undefined;
  allowedExtensions?: string[] | undefined;
}

export interface UploadResult {
  filename: string;
  fileType: string;
  fileUrl: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

@Service()
export class FileUploadService {
  readonly DEFAULT_MAX_UPLOAD = 5 * 1024 * 1024; //5mb

  readonly DEFAULT_IMG_EXT = [".jpg", ".jpeg", ".png"];

  readonly DEFAULT_DOCUMENT_EXT = [".pdf", ".doc", ".docx", ".txt"];

  readonly BASE_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

  // /public/uploads/avatar/user_id/file
  // /public/uploads/article/user_id/article_id/file

  async upload(file: FileUpload, options: UploadOption = {}):Promise<UploadResult> {
    const { filename, createReadStream } = file;

    const uploadOption: UploadOption = {
      Id: options.Id,
      directory: options.directory,
      subDirectory: options.subDirectory,
      allowedExtensions: options.allowedExtensions,
      maxFileSize: options.maxFileSize || this.DEFAULT_MAX_UPLOAD,
    };

    const validationFile = await this.validateFile(
      filename,
      createReadStream,
      uploadOption
    );

    if (!validationFile.isValid) {
      throw new Error(validationFile.error);
    }

    const uploadPath = this.generateUploadPath(uploadOption);

    const Filename = this.generateFileName(filename);

    const result = await this.saveFileToDisk(
      createReadStream,
      uploadPath,
      Filename,
    );

    if (!result) {
      throw new Error("Failed to save file");
    }

    return {
      filename: Filename,
      fileType: path.extname(Filename),
      fileUrl: uploadPath
      
    };
  }

  private generateFileName(filename: string): string {
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);

    return `${nameWithoutExt}-${timestamp}-${random}`;
  }

  private generateUploadPath(option: UploadOption) {
    const pathSegment = [
      this.BASE_UPLOAD_DIR,
      option.directory,
      option.subDirectory,
      option.Id ?? undefined,
    ].filter(
      (segment): segment is string =>
        typeof segment === "string" && segment.length > 0
    );

    return path.join(...pathSegment);
  }

  async validateFile(
    fileName: string,
    createReadStream: () => NodeJS.ReadableStream,
    options: UploadOption
  ): Promise<ValidationResult> {
    const ext = path.extname(fileName).toLowerCase();

    if (!options.allowedExtensions?.includes(ext)) {
      return {
        error: `File type ${ext} not allowed. Allowed types: ${options.allowedExtensions?.join(
          ", "
        )}`,
        isValid: false,
      };
    }

    try {
      const stream = createReadStream();
      let fileSize = 0;

      for await (const chunks of stream) {
        fileSize += chunks.length;
        if (fileSize > options.maxFileSize!) {
          return {
            isValid: false,
            error: `File size exceeds limit of ${options.maxFieldSize}`,
          };
        }
      }
    } catch {
      return {
        isValid: false,
        error: `Unable to validate this file size`,
      };
    }

    return {
      isValid: true,
    };
  }

  private async saveFileToDisk(
    createReadStream: () => NodeJS.ReadableStream,
    uploadPath: string,
    fileName: string
  ): Promise<{ success: boolean; fileSize: number }> {
    await fs.promises.mkdir(uploadPath, { recursive: true });

    const filePath = path.join(uploadPath, fileName);
    const readStream = createReadStream();
    const writeStream = createWriteStream(filePath);

    try {
      
      await pipeline(readStream, writeStream);

      
      const stats = await fs.promises.stat(filePath);

      return {
        success: true,
        fileSize: stats.size,
      };
    } catch (error) {
      // Cleanup file if failed
      try {
        await fs.promises.unlink(filePath);
      } catch (unlinkError) {
        // Ignore cleanup errors
        console.error(`Failed to cleanup file: ${unlinkError}`);
      }
      throw new Error(`Failed to save file: ${error}`);
    }
  }

  UploadForAvatar(userId: string): UploadOption {
    return {
      // Id: userId,
      directory: "avatar",
      subDirectory: userId,
      maxFileSize: 2 * 1024 * 1024, //2MB
      allowedExtensions: this.DEFAULT_IMG_EXT,
    };
  }

  UploadForArticle(userId: string, articleId: string): UploadOption {
   return {
      Id: articleId,
      directory: "articles",
      subDirectory: userId,
      maxFileSize: 5 * 1024 * 1024, //5MB
      allowedExtensions: this.DEFAULT_IMG_EXT,
   }
  }
}
