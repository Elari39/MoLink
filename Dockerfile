# ---- 构建阶段：用 Maven 编译并打成可执行 jar ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# 先单独拷贝 pom 以利用 Docker 层缓存：依赖未变时不必重新下载
COPY pom.xml .
RUN mvn -q -e -B dependency:go-offline

# 再拷贝源码并打包（跳过测试，测试在 CI/本地执行）
COPY src ./src
RUN mvn -q -B clean package -DskipTests

# ---- 运行阶段：仅保留 JRE 与 jar，镜像更小 ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
