const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

class AzureBlobService {
    constructor() {
        this.connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'obayi-files';
        
        if (!this.connectionString) {
            throw new Error('Azure Storage connection string is required');
        }
        
        this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
        this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
        
        this.initializeContainer();
    }
    
    async initializeContainer() {
        try {
            // Create container if it doesn't exist
            await this.containerClient.createIfNotExists({
                access: 'blob' // Public read access for files
            });
            console.log(`Azure Blob container '${this.containerName}' ready`);
        } catch (error) {
            console.error('Error initializing Azure Blob container:', error.message);
        }
    }
    
    // Upload profile picture (with image optimization)
    async uploadProfilePicture(buffer, originalName, userId) {
        try {
            // Optimize image using Sharp
            const optimizedBuffer = await sharp(buffer)
                .resize(400, 400, {
                    fit: 'cover',
                    position: 'center'
                })
                .jpeg({
                    quality: 85,
                    progressive: true
                })
                .toBuffer();
            
            const fileExtension = 'jpg'; // Always convert to JPEG
            const blobName = `profile-pictures/${userId}-${uuidv4()}.${fileExtension}`;
            
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            
            const uploadResponse = await blockBlobClient.upload(optimizedBuffer, optimizedBuffer.length, {
                blobHTTPHeaders: {
                    blobContentType: 'image/jpeg',
                    blobCacheControl: 'public, max-age=31536000' // Cache for 1 year
                },
                metadata: {
                    originalName: originalName,
                    userId: userId,
                    uploadedAt: new Date().toISOString(),
                    fileType: 'profile-picture'
                }
            });
            
            return {
                url: blockBlobClient.url,
                blobName: blobName,
                size: optimizedBuffer.length,
                etag: uploadResponse.etag
            };
            
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            throw new Error(`Failed to upload profile picture: ${error.message}`);
        }
    }
    
    // Upload document (PDF, Word, images)
    async uploadDocument(buffer, originalName, documentType, userId, studentId) {
        try {
            const fileExtension = originalName.split('.').pop().toLowerCase();
            const blobName = `documents/${studentId}/${documentType}-${uuidv4()}.${fileExtension}`;
            
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            
            // Determine content type
            const contentTypeMap = {
                'pdf': 'application/pdf',
                'doc': 'application/msword',
                'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'webp': 'image/webp'
            };
            
            const contentType = contentTypeMap[fileExtension] || 'application/octet-stream';
            
            const uploadResponse = await blockBlobClient.upload(buffer, buffer.length, {
                blobHTTPHeaders: {
                    blobContentType: contentType,
                    blobCacheControl: 'public, max-age=3600' // Cache for 1 hour
                },
                metadata: {
                    originalName: originalName,
                    documentType: documentType,
                    userId: userId,
                    studentId: studentId,
                    uploadedAt: new Date().toISOString(),
                    fileType: 'document'
                }
            });
            
            return {
                url: blockBlobClient.url,
                blobName: blobName,
                size: buffer.length,
                mimeType: contentType,
                etag: uploadResponse.etag
            };
            
        } catch (error) {
            console.error('Error uploading document:', error);
            throw new Error(`Failed to upload document: ${error.message}`);
        }
    }
    
    // Delete file from blob storage
    async deleteFile(blobName) {
        try {
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            const deleteResponse = await blockBlobClient.deleteIfExists();
            
            return deleteResponse.succeeded;
        } catch (error) {
            console.error('Error deleting file:', error);
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }
    
    // Get file info
    async getFileInfo(blobName) {
        try {
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            const properties = await blockBlobClient.getProperties();
            
            return {
                url: blockBlobClient.url,
                size: properties.contentLength,
                contentType: properties.contentType,
                lastModified: properties.lastModified,
                metadata: properties.metadata
            };
        } catch (error) {
            console.error('Error getting file info:', error);
            return null;
        }
    }
    
    // Generate signed URL for temporary access (optional, for private files)
    async generateSasUrl(blobName, permissions = 'r', expiresInMinutes = 60) {
        try {
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            
            // Generate SAS token
            const sasUrl = await blockBlobClient.generateSasUrl({
                permissions: permissions,
                expiresOn: new Date(Date.now() + expiresInMinutes * 60 * 1000)
            });
            
            return sasUrl;
        } catch (error) {
            console.error('Error generating SAS URL:', error);
            throw new Error(`Failed to generate signed URL: ${error.message}`);
        }
    }
    
    // Clean up old profile pictures when user uploads new one
    async cleanupOldProfilePicture(userId, currentBlobName) {
        try {
            const listOptions = {
                prefix: `profile-pictures/${userId}-`
            };
            
            for await (const blob of this.containerClient.listBlobsFlat(listOptions)) {
                if (blob.name !== currentBlobName) {
                    await this.deleteFile(blob.name);
                    console.log(`Cleaned up old profile picture: ${blob.name}`);
                }
            }
        } catch (error) {
            console.error('Error cleaning up old profile pictures:', error);
        }
    }
}

module.exports = new AzureBlobService();