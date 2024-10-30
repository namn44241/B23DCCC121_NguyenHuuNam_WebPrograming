# Sử dụng hình ảnh Java làm base image
FROM openjdk:17-jdk-slim

# Đặt thư mục làm việc
WORKDIR /app

# Copy file JAR vào container
COPY target/*.jar app.jar

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
