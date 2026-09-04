FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY backend/ .
RUN chmod +x mvnw && ./mvnw clean package -DskipTests
EXPOSE 8080
CMD ["sh", "-c", "java -jar target/*.jar"]
