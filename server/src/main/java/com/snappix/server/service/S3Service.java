// server/src/main/java/com/snappix/server/service/S3Service.java
package com.snappix.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    @Value("${aws.access.key}")
    private String accessKey;

    @Value("${aws.secret.key}")
    private String secretKey;

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    private S3Client getS3Client() {
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String key = UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            System.out.println("Uploading to S3: bucket=" + bucketName + ", key=" + key);

            getS3Client().putObject(putRequest, RequestBody.fromBytes(file.getBytes()));
        } catch (Exception e) {
            System.err.println("❌ Failed to upload to S3: " + e.getMessage());
            throw new IOException("S3 upload failed", e);
        }

        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;
    }

    public void deleteFileByUrl(String fileUrl) {
        try {
            // Extract key after ".com/"
            String key = fileUrl.substring(fileUrl.indexOf(".com/") + 5);

            // Remove query params if any
            if (key.contains("?")) {
                key = key.split("\\?")[0];
            }

            System.out.println("🧹 Attempting delete with key: " + key);

            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            getS3Client().deleteObject(deleteRequest);
            System.out.println("✅ Deleted from S3: " + key);

        } catch (Exception e) {
            System.err.println("❌ Failed to delete from S3: " + e.getMessage());
            e.printStackTrace();
        }
    }

}
