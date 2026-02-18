// Day 5, Chapter 1: Docker Deployment (90 min)
const day5_ch01 = {
    title: "Docker Deployment",
    slides: [
        {
            id: "d5-docker-title",
            title: "Docker Deployment",
            content: C.titleSlide(
                "Docker Deployment",
                "Containerizing and deploying SEMOSS at scale",
                "90 minutes"
            )
        },
        {
            id: "d5-docker-overview",
            title: "Why Docker for SEMOSS?",
            content: `
                <h2>Why Docker for SEMOSS?</h2>
                <p class="lead">Docker enables consistent, reproducible deployments across dev, staging, and production environments.</p>
                ${C.cards([
                    { badge: 'Benefit', title: 'Consistency', desc: 'Same image runs on laptops, staging servers, and production clusters' },
                    { badge: 'Benefit', title: 'Isolation', desc: 'Dependencies (Java, Python, Tomcat, Chrome) bundled inside the image' },
                    { badge: 'Benefit', title: 'Scalability', desc: 'Horizontal scaling with orchestrators (Kubernetes, Docker Swarm)' },
                    { badge: 'Benefit', title: 'Fast Rollback', desc: 'Tag images by version and roll back instantly' },
                    { badge: 'Benefit', title: 'Developer Velocity', desc: 'Dev environment matches production — no "works on my machine"' },
                ])}
                ${C.callout('SEMOSS provides official Docker images on <strong>quay.io/semoss/semoss-dev</strong> and enterprise registries for production deployments.', 'info')}
            `
        },
        {
            id: "d5-docker-architecture",
            title: "SEMOSS Docker Architecture",
            content: `
                <h2>SEMOSS Container Architecture</h2>
                <p>A SEMOSS container packages all runtime dependencies into a single deployable unit.</p>
                ${C.layers([
                    { label: "Application Layer", accent: true, items: [
                        { title: "Tomcat 9", desc: "Servlet container serving Monolith WAR", accent: true },
                        { title: "Semoss Core", desc: "Java libraries (semoss-5.0.0-SNAPSHOT.jar)" },
                        { title: "SemossWeb", desc: "React frontend + Node.js assets" },
                    ]},
                    { label: "Runtime Dependencies", items: [
                        { title: "Java 21 (Azul Zulu)", desc: "/usr/lib/jvm/zulu21" },
                        { title: "Python 3.12 (venv)", desc: "/usr/lib/python/semossvenv" },
                        { title: "Maven 3.8.5", desc: "/opt/apache-maven-3.8.5" },
                        { title: "Playwright (Chromium)", desc: "For headless browser automation" },
                    ]},
                    { label: "Base OS", items: [
                        { title: "Ubuntu 22.04", desc: "Base image with glibc, system libs" },
                        { title: "Locale (en_US.UTF-8)", desc: "For internationalization" },
                    ]},
                ])}
                ${C.callout('The container runs as <strong>non-root user 1001</strong> for security. All paths are owned by 1001:0 (user:root group).', 'tip')}
            `
        },
        {
            id: "d5-docker-multi-stage-build",
            title: "Multi-Stage Dockerfile",
            content: `
                <h2>Multi-Stage Build Strategy</h2>
                <p>SEMOSS uses a multi-stage Dockerfile to minimize final image size and separate build tools from runtime.</p>
                ${C.flow([
                    { title: 'Stage 1: tomcat_builder', desc: 'Install Java, Tomcat, Maven, Codex CLI', accent: true, arrow: '↓ built artifacts' },
                    { title: 'Stage 2: mavenpuller', desc: 'Clone semoss-artifacts, download latest SEMOSS build', arrow: '↓ SEMOSS app files' },
                    { title: 'Stage 3: final', desc: 'Copy runtime binaries + app, install Python + Playwright', accent: true },
                ])}
                ${C.code(`# Stage 1: Build tooling (tomcat-builder)
FROM quay.io/semoss/tomcat-builder:9.0.112 AS tomcat_builder
ARG CODEX_VERSION=0.80.0
RUN apt-get update -y && apt-get install -y ca-certificates curl tar
RUN curl -fsSL https://github.com/openai/codex/releases/...
RUN install -m 0755 codex /usr/local/bin/codex

# Stage 2: Pull SEMOSS artifacts
FROM ubuntu:22.04 AS mavenpuller
COPY --from=tomcat_builder /opt /opt
RUN mkdir /opt/semosshome
RUN cd /opt && git clone https://github.com/SEMOSS/semoss-artifacts
RUN /opt/semoss-artifacts/artifacts/scripts/update_latest_dev.sh

# Stage 3: Final runtime image
FROM ubuntu:22.04 AS final
COPY --from=tomcat_builder /usr/lib/jvm/zulu21 /usr/lib/jvm/zulu21
COPY --from=mavenpuller /opt /opt
COPY --from=quay.io/semoss/python-builder:3.12-cpu /usr/lib/python /usr/lib/python
RUN apt-get install -y locales git curl vim nano
USER 1001
CMD ["bash", "-c", "exec $TOMCAT_HOME/bin/start.sh"]`, 'dockerfile', 'docker/Dockerfile.ubuntu22.04 (simplified)')}
                ${C.callout('<strong>Why multi-stage?</strong> Build tools (Maven, git) are <em>not</em> copied to the final image, reducing image size by ~500MB.', 'info')}
            `
        },
        {
            id: "d5-docker-image-layers",
            title: "Image Layers Breakdown",
            content: `
                <h2>What's Inside the SEMOSS Image?</h2>
                ${C.table(
                    ['Layer', 'Purpose', 'Size (Approx)', 'Path'],
                    [
                        ['Ubuntu 22.04', 'Base OS', '~80MB', '/'],
                        ['Java 21 (Zulu)', 'JVM runtime', '~200MB', '/usr/lib/jvm/zulu21'],
                        ['Python 3.12 + venv', 'Python runtime + libs', '~600MB', '/usr/lib/python/semossvenv'],
                        ['Tomcat 9.0.112', 'Servlet container', '~15MB', '/opt/apache-tomcat-9.0.112'],
                        ['SEMOSS Core', 'Java libraries', '~150MB', '/opt/semosshome'],
                        ['SemossWeb', 'React frontend', '~50MB', '/opt/apache-tomcat-9.0.112/webapps/SemossWeb'],
                        ['Playwright', 'Headless browser', '~300MB', 'System libs'],
                        ['Codex CLI', 'AI code tools', '~20MB', '/usr/local/bin/codex'],
                    ]
                )}
                <h3>Total Image Size: ~1.4GB</h3>
                ${C.callout('Use <code>docker images quay.io/semoss/semoss-dev</code> to see actual layer sizes and compressed size on disk.', 'tip')}
            `
        },
        {
            id: "d5-docker-compose-intro",
            title: "Docker Compose for Orchestration",
            content: `
                <h2>Docker Compose — Multi-Container Orchestration</h2>
                <p class="lead"><code>docker-compose.yml</code> defines services, networks, volumes, and environment configuration for SEMOSS and its dependencies.</p>
                ${C.split(
                    {
                        title: 'Why Use Docker Compose?',
                        content: `
                            <ul>
                                <li><strong>Single command</strong>: <code>docker-compose up</code> starts everything</li>
                                <li><strong>Service linking</strong>: SEMOSS, Postgres, MinIO connect via Docker network</li>
                                <li><strong>Environment config</strong>: Centralized env vars for all features</li>
                                <li><strong>Volume persistence</strong>: Data survives container restarts</li>
                                <li><strong>Reproducible</strong>: Same compose file works on any Docker host</li>
                            </ul>
                        `
                    },
                    {
                        title: 'Typical SEMOSS Stack',
                        content: C.code(`services:
  semoss:
    image: quay.io/semoss/semoss-dev:latest
    ports:
      - "9090:8080"
    environment:
      # ... env vars ...
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: postgres
  minio:
    image: minio/minio
    command: server /data
    ports:
      - "9091:9000"`, 'yaml', 'docker-compose.yml (simplified)')
                    }
                )}
            `
        },
        {
            id: "d5-docker-compose-semoss-service",
            title: "docker-compose.yml — SEMOSS Service",
            content: `
                <h2>SEMOSS Service Configuration</h2>
                ${C.code(`version: "3.8"
services:
  semoss:
    image: quay.io/semoss/semoss-dev:5.0.0-alpha-SNAPSHOT-ubuntu22-2025-10-14
    container_name: semoss
    pull_policy: always
    user: "1001:1001"  # non-root for security
    ports:
      - "9090:8080"    # Tomcat HTTP port
      - "5005:5005"    # JDWP debug port (optional)
    volumes:
      # Mount local JAR for hot reload during development
      - ./Semoss/target/semoss-5.0.0-SNAPSHOT.jar:/opt/apache-tomcat-9.0.112/webapps/Monolith/WEB-INF/lib/semoss-5.0.0-SNAPSHOT.jar
    environment:
      # Feature flags
      SETSOCIAL: 'true'
      ENABLE_NATIVE: 'true'
      NETTY_PYTHON: 'true'
      MODEL_INFERENCE_LOGS_ENABLED: 'true'
      CHROOT_ENABLE: 'true'
      # ... see next slide for full env vars
    command: /bin/bash -c "runCS.sh"
    networks:
      - mynetwork`, 'yaml', 'docker-compose-examples/docker-compose-kunal.yml (excerpted)')}
                <h3>Key Fields</h3>
                <ul>
                    <li><code>user: "1001:1001"</code> — Run as non-root (matches Dockerfile USER)</li>
                    <li><code>ports</code> — Map container port 8080 to host port 9090</li>
                    <li><code>volumes</code> — Mount local JARs for dev hot reload (optional in prod)</li>
                    <li><code>networks</code> — Enable inter-container communication</li>
                </ul>
            `
        },
        {
            id: "d5-docker-environment-vars",
            title: "Environment Variables",
            content: `
                <h2>Configuring SEMOSS via Environment Variables</h2>
                <p>SEMOSS reads configuration from environment variables at startup. This enables <strong>12-factor app</strong> principles.</p>
                ${C.table(
                    ['Category', 'Example Variables', 'Purpose'],
                    [
                        ['Auth', 'SETSOCIAL, ENABLE_NATIVE, ENABLE_NATIVE_REGISTRATION', 'Enable social login or native username/password auth'],
                        ['Python', 'NETTY_PYTHON, NATIVE_PY_SERVER, SMSS_PYTHONHOME', 'Enable Python GAAS server and set venv path'],
                        ['Security', 'CHROOT_ENABLE, CHROOT_DIR, CHROOT_SYMLINK_PATHS', 'Enable chroot sandbox for Python execution'],
                        ['Database', 'CUSTOM_LM_CONNECTION_URL, CUSTOM_SECURITY_CONNECTION_URL', 'External Postgres for LocalMaster, Security DB, etc.'],
                        ['Cloud Storage', 'SEMOSS_IS_CLUSTER, MINIO_ENDPOINT, MINIO_BUCKET', 'Use MinIO/S3 for distributed storage'],
                        ['Feature Flags', 'MODEL_INFERENCE_LOGS_ENABLED, USER_TRACKING_ENABLED', 'Enable/disable optional features'],
                        ['Frontend', 'FE_ROUTE, REDIRECT', 'Configure frontend base path and OAuth redirects'],
                    ]
                )}
                ${C.callout('Use <code>.env</code> files with <code>env_file:</code> in docker-compose to keep secrets out of version control.', 'warning')}
            `
        },
        {
            id: "d5-docker-environment-example",
            title: "Environment Variables (Full Example)",
            content: `
                <h2>Full Environment Configuration</h2>
                ${C.code(`environment:
  # Auth & Frontend
  SETSOCIAL: 'true'
  REDIRECT: "http://localhost:9090/#/"
  ENABLE_NATIVE: 'true'
  ENABLE_NATIVE_REGISTRATION: 'true'
  OPTIONAL_COOKIES: 'false'
  FE_ROUTE: /Monolith

  # Python Server
  NETTY_PYTHON: 'true'
  NATIVE_PY_SERVER: 'true'
  SMSS_PYTHONHOME: /usr/lib/python/semossvenv
  R_ON: 'false'

  # Feature Flags
  MODEL_INFERENCE_LOGS_ENABLED: 'true'
  USER_TRACKING_ENABLED: 'true'
  PROMPT_DB_ENABLED: 'false'

  # Chroot Security
  CHROOT_ENABLE: 'true'
  CHROOT_DIR: /opt/chroot
  CHROOT_SYMLINK_PATHS: /usr/lib/python

  # Postgres LocalMaster (shared database, unique schema)
  CUSTOM_LM_RDBMS_TYPE: "postgres"
  CUSTOM_LM_DRIVER: "org.postgresql.Driver"
  CUSTOM_LM_DATABASE: "postgres"
  CUSTOM_LM_SCHEMA: "localmaster"
  CUSTOM_LM_USERNAME: "postgres"
  CUSTOM_LM_PASSWORD: "postgres"
  CUSTOM_LM_CONNECTION_URL: "jdbc:postgresql://host.docker.internal:5432/postgres?currentSchema=localmaster"

  # Postgres Security DB
  CUSTOM_SECURITY_CONNECTION_URL: "jdbc:postgresql://host.docker.internal:5432/postgres?currentSchema=security"

  # MinIO (S3-compatible cloud storage)
  SEMOSS_IS_CLUSTER: 'true'
  SEMOSS_STORAGE_PROVIDER: 'minio'
  MINIO_REGION: 'us-east'
  MINIO_BUCKET: 'semoss'
  MINIO_ACCESS_KEY: 'minioadmin'
  MINIO_SECRET_KEY: 'minioadmin'
  MINIO_ENDPOINT: 'http://host.docker.internal:9091'`, 'yaml', 'docker-compose.yml environment block (annotated)')}
                ${C.callout('Use <code>host.docker.internal</code> to access services running on the host machine from inside the container (Mac/Windows Docker Desktop).', 'tip')}
            `
        },
        {
            id: "d5-docker-volumes",
            title: "Volume Mounts & Persistence",
            content: `
                <h2>Volume Mounts — Development vs Production</h2>
                ${C.split(
                    {
                        title: 'Development Volumes',
                        content: C.code(`volumes:
  # Hot reload for JAR changes
  - ./Semoss/target/semoss-5.0.0.jar:/opt/apache-tomcat-9.0.112/webapps/Monolith/WEB-INF/lib/semoss-5.0.0.jar

  # Optional: Mount source classes
  - ./apache-tomcat-9.0.112/webapps/Monolith/WEB-INF/classes:/opt/apache-tomcat-9.0.112/webapps/Monolith/WEB-INF/classes

# Restart Tomcat after JAR update
# docker-compose restart semoss`, 'yaml', 'Dev: Hot reload with bind mounts')
                    },
                    {
                        title: 'Production Volumes',
                        content: C.code(`volumes:
  # Named volume for data persistence
  semoss-data:
    driver: local

services:
  semoss:
    volumes:
      # Persist /opt/semosshome
      - semoss-data:/opt/semosshome

# Data survives container recreation
# docker-compose down && docker-compose up`, 'yaml', 'Prod: Named volumes for persistence')
                    }
                )}
                ${C.callout('<strong>Bind mounts</strong> (host paths like <code>./Semoss/...</code>) are for dev. <strong>Named volumes</strong> are for prod data persistence.', 'info')}
            `
        },
        {
            id: "d5-docker-networking",
            title: "Docker Networking",
            content: `
                <h2>Container Networking</h2>
                <p>Services in the same docker-compose file can communicate via service names on a private network.</p>
                ${C.sequence(
                    ['Client Browser', 'Docker Host', 'semoss Container', 'postgres Container', 'minio Container'],
                    [
                        { from: 0, to: 1, label: 'HTTP :9090' },
                        { from: 1, to: 2, label: 'Forward to :8080 (Tomcat)' },
                        { from: 2, to: 3, label: 'JDBC postgres:5432' },
                        { from: 3, to: 2, label: 'ResultSet', type: 'response' },
                        { from: 2, to: 4, label: 'S3 API minio:9000' },
                        { from: 4, to: 2, label: 'Object data', type: 'response' },
                        { from: 2, to: 1, label: 'JSON response', type: 'response' },
                        { from: 1, to: 0, label: 'HTTP response', type: 'response' },
                    ]
                )}
                ${C.code(`networks:
  mynetwork:
    driver: bridge  # default, creates private subnet

services:
  semoss:
    networks:
      - mynetwork
  postgres:
    networks:
      - mynetwork
  minio:
    networks:
      - mynetwork

# Inside semoss container, use "postgres" as hostname
# CUSTOM_LM_CONNECTION_URL: "jdbc:postgresql://postgres:5432/postgres"`, 'yaml', 'Docker Compose Network')}
                ${C.callout('Service names (e.g., <code>postgres</code>) are DNS-resolvable within the network. No need for IP addresses.', 'tip')}
            `
        },
        {
            id: "d5-docker-startup-commands",
            title: "Startup Commands",
            content: `
                <h2>Docker Compose Commands</h2>
                ${C.table(
                    ['Command', 'Description'],
                    [
                        ['docker-compose up', 'Start all services (attached, see logs in terminal)'],
                        ['docker-compose up -d', 'Start all services in detached mode (background)'],
                        ['docker-compose down', 'Stop and remove containers (volumes persist unless -v)'],
                        ['docker-compose logs -f semoss', 'Follow logs for the semoss service'],
                        ['docker-compose restart semoss', 'Restart the semoss container'],
                        ['docker-compose exec semoss bash', 'Open a shell inside the running semoss container'],
                        ['docker-compose ps', 'List running services'],
                        ['docker-compose pull', 'Pull latest images from registry'],
                    ]
                )}
                ${C.code(`# Start SEMOSS stack
docker-compose up -d

# View logs
docker-compose logs -f semoss

# Access SEMOSS
# Open browser: http://localhost:9090

# Stop everything
docker-compose down`, 'bash', 'Typical workflow')}
            `
        },
        {
            id: "d5-docker-cloud-deployment",
            title: "Cloud Deployment Options",
            content: `
                <h2>Deploying SEMOSS on Cloud Platforms</h2>
                ${C.cards([
                    {
                        badge: 'AWS',
                        title: 'Amazon ECS / EKS',
                        desc: 'ECS for Docker Compose-like orchestration, EKS for Kubernetes-based scaling. Use ECR for private image registry, RDS for Postgres, S3 for storage.'
                    },
                    {
                        badge: 'Azure',
                        title: 'Azure Container Instances / AKS',
                        desc: 'ACI for simple container runs, AKS for Kubernetes. Use Azure Container Registry, Azure Database for PostgreSQL, Blob Storage for S3-compatible storage.'
                    },
                    {
                        badge: 'GCP',
                        title: 'Cloud Run / GKE',
                        desc: 'Cloud Run for serverless containers, GKE for Kubernetes. Use Artifact Registry, Cloud SQL, GCS for object storage.'
                    },
                    {
                        badge: 'On-Prem',
                        title: 'Kubernetes / OpenShift',
                        desc: 'Self-hosted Kubernetes clusters with Helm charts for SEMOSS. Use persistent volumes for data, ingress controllers for HTTPS.'
                    },
                ])}
                ${C.callout('For production, use managed Kubernetes (EKS, AKS, GKE) for auto-scaling, rolling updates, and health checks. For dev/staging, docker-compose is sufficient.', 'info')}
            `
        },
        {
            id: "d5-docker-scaling",
            title: "Scaling & Load Balancing",
            content: `
                <h2>Horizontal Scaling with Docker</h2>
                <p>SEMOSS can scale horizontally by running multiple container replicas behind a load balancer.</p>
                ${C.flow([
                    { title: 'Load Balancer (NGINX, ALB)', desc: 'Distribute requests across replicas', accent: true, arrow: '↓ round-robin' },
                    { title: 'SEMOSS Replica 1', desc: 'Container running on host A', arrow: '→ shared state' },
                    { title: 'SEMOSS Replica 2', desc: 'Container running on host B', arrow: '→ shared state' },
                    { title: 'SEMOSS Replica 3', desc: 'Container running on host C', arrow: '↓' },
                    { title: 'Shared Storage (S3/MinIO)', desc: 'Engines, projects, assets', arrow: '↓' },
                    { title: 'Shared Database (Postgres/RDS)', desc: 'Security, LocalMaster, Model Logs', },
                ])}
                ${C.code(`# docker-compose scale example (requires swarm mode)
docker-compose up --scale semoss=3

# Kubernetes Deployment with 3 replicas
apiVersion: apps/v1
kind: Deployment
metadata:
  name: semoss
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: semoss
        image: quay.io/semoss/semoss-dev:latest
        ports:
        - containerPort: 8080`, 'yaml', 'Scaling SEMOSS replicas')}
                ${C.callout('<strong>Requirements for scaling:</strong> Use external Postgres (not H2), enable <code>SEMOSS_IS_CLUSTER=true</code>, and configure MinIO/S3 for shared file storage.', 'warning')}
            `
        },
        {
            id: "d5-docker-health-checks",
            title: "Health Checks & Monitoring",
            content: `
                <h2>Container Health Checks</h2>
                ${C.split(
                    {
                        title: 'docker-compose healthcheck',
                        content: C.code(`services:
  semoss:
    image: quay.io/semoss/semoss-dev:latest
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/Monolith/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s`, 'yaml', 'Health check in docker-compose')
                    },
                    {
                        title: 'Kubernetes Liveness/Readiness',
                        content: C.code(`livenessProbe:
  httpGet:
    path: /Monolith/api/health
    port: 8080
  initialDelaySeconds: 60
  periodSeconds: 30

readinessProbe:
  httpGet:
    path: /Monolith/api/ready
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10`, 'yaml', 'Kubernetes probes')
                    }
                )}
                <h3>Monitoring Best Practices</h3>
                <ul>
                    <li><strong>Logs</strong>: Use <code>docker logs</code> or centralized logging (ELK, Splunk, CloudWatch)</li>
                    <li><strong>Metrics</strong>: Expose JMX metrics, scrape with Prometheus, visualize in Grafana</li>
                    <li><strong>Alerts</strong>: Set up alerts for container restarts, OOM kills, high CPU/memory</li>
                </ul>
            `
        },
        {
            id: "d5-docker-security",
            title: "Container Security Best Practices",
            content: `
                <h2>Securing SEMOSS Containers</h2>
                ${C.cards([
                    { badge: 'Practice', title: 'Non-Root User', desc: 'Run as user 1001 (already done in Dockerfile). Never run as root in production.' },
                    { badge: 'Practice', title: 'Read-Only Filesystem', desc: 'Use --read-only flag and tmpfs for /tmp. Prevents malicious writes to container filesystem.' },
                    { badge: 'Practice', title: 'Secrets Management', desc: 'Use Docker secrets, Kubernetes secrets, or AWS Secrets Manager. Never hardcode passwords in env vars.' },
                    { badge: 'Practice', title: 'Image Scanning', desc: 'Scan images for CVEs with Trivy, Snyk, or Clair before deploying to prod.' },
                    { badge: 'Practice', title: 'Network Policies', desc: 'Restrict inter-container communication with Kubernetes NetworkPolicies or firewall rules.' },
                    { badge: 'Practice', title: 'Resource Limits', desc: 'Set CPU/memory limits to prevent noisy neighbor issues in shared environments.' },
                ])}
                ${C.code(`# Resource limits in docker-compose
services:
  semoss:
    deploy:
      resources:
        limits:
          cpus: '4'
          memory: 8G
        reservations:
          cpus: '2'
          memory: 4G`, 'yaml', 'Resource limits example')}
                ${C.callout('<strong>Chroot Security:</strong> SEMOSS supports <code>CHROOT_ENABLE=true</code> to sandbox Python execution. Combined with non-root user, this provides defense-in-depth.', 'tip')}
            `
        },
        {
            id: "d5-docker-handson",
            title: "Hands-on: Deploy SEMOSS with Docker",
            content: `
                <h2>Hands-on: Deploy SEMOSS with Docker</h2>
                ${C.handson('Deploy SEMOSS Stack', `
                    <h4>Step 1: Pull the SEMOSS Image</h4>
                    ${C.code(`docker pull quay.io/semoss/semoss-dev:latest`, 'bash')}
                    <p>This downloads the latest SEMOSS development image (~1.4GB).</p>

                    <h4>Step 2: Create docker-compose.yml</h4>
                    ${C.code(`version: "3.8"
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  minio:
    image: minio/minio
    command: server /data
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9091:9000"
    volumes:
      - minio-data:/data

  semoss:
    image: quay.io/semoss/semoss-dev:latest
    container_name: semoss
    user: "1001:1001"
    ports:
      - "9090:8080"
    environment:
      SETSOCIAL: 'true'
      ENABLE_NATIVE: 'true'
      NETTY_PYTHON: 'true'
      CHROOT_ENABLE: 'true'
      SEMOSS_IS_CLUSTER: 'true'
      SEMOSS_STORAGE_PROVIDER: 'minio'
      MINIO_ENDPOINT: 'http://minio:9000'
      MINIO_BUCKET: 'semoss'
      MINIO_ACCESS_KEY: 'minioadmin'
      MINIO_SECRET_KEY: 'minioadmin'
      CUSTOM_LM_CONNECTION_URL: "jdbc:postgresql://postgres:5432/postgres?currentSchema=localmaster"
      CUSTOM_SECURITY_CONNECTION_URL: "jdbc:postgresql://postgres:5432/postgres?currentSchema=security"
    depends_on:
      - postgres
      - minio
    networks:
      - semoss-network

networks:
  semoss-network:

volumes:
  postgres-data:
  minio-data:`, 'yaml', 'docker-compose.yml')}

                    <h4>Step 3: Start the Stack</h4>
                    ${C.code(`docker-compose up -d`, 'bash')}
                    <p>This starts Postgres, MinIO, and SEMOSS in detached mode.</p>

                    <h4>Step 4: Watch Startup Logs</h4>
                    ${C.code(`docker-compose logs -f semoss`, 'bash')}
                    <p>Wait for "Server startup in [X] milliseconds" — SEMOSS is ready when Tomcat finishes starting.</p>

                    <h4>Step 5: Access SEMOSS</h4>
                    <p>Open your browser: <strong>http://localhost:9090</strong></p>
                    <p>Login with native auth (if ENABLE_NATIVE=true, create an admin user on first launch).</p>

                    <h4>Step 6: Verify Cluster Mode</h4>
                    ${C.code(`# Inside the container, check RDF_Map.prop
docker-compose exec semoss cat /opt/semosshome/RDF_Map.prop | grep SEMOSS_IS_CLUSTER

# Should show: SEMOSS_IS_CLUSTER true`, 'bash')}

                    <h4>Step 7: Stop the Stack</h4>
                    ${C.code(`docker-compose down`, 'bash')}
                    <p>This stops and removes containers, but volumes (postgres-data, minio-data) persist.</p>
                `)}
            `
        },
        {
            id: "d5-docker-recap",
            title: "Chapter Recap",
            content: `
                <h2>Chapter Recap: Docker Deployment</h2>
                ${C.cards([
                    {
                        badge: 'Architecture',
                        title: 'SEMOSS Container',
                        desc: 'Ubuntu 22.04 + Java 21 + Python 3.12 + Tomcat 9 + Playwright + Codex. Total image: ~1.4GB. Runs as user 1001 (non-root).'
                    },
                    {
                        badge: 'Multi-Stage Build',
                        title: 'Dockerfile Strategy',
                        desc: 'Stage 1: tomcat-builder (build tools). Stage 2: mavenpuller (download SEMOSS). Stage 3: final (runtime only).'
                    },
                    {
                        badge: 'docker-compose',
                        title: 'Orchestration',
                        desc: 'Define SEMOSS + Postgres + MinIO in one file. Use <code>docker-compose up</code> to start, <code>docker-compose down</code> to stop.'
                    },
                    {
                        badge: 'Configuration',
                        title: 'Environment Variables',
                        desc: 'Configure auth, Python, chroot, databases, cloud storage via env vars. Follows 12-factor app principles.'
                    },
                    {
                        badge: 'Scaling',
                        title: 'Horizontal Scale',
                        desc: 'Run multiple replicas behind a load balancer. Requires external Postgres, MinIO/S3, and <code>SEMOSS_IS_CLUSTER=true</code>.'
                    },
                    {
                        badge: 'Cloud',
                        title: 'Deployment Platforms',
                        desc: 'AWS ECS/EKS, Azure ACI/AKS, GCP Cloud Run/GKE, or on-prem Kubernetes. Use managed services for Postgres and object storage.'
                    },
                ])}
                <h3>Key Takeaways</h3>
                <ul>
                    <li>SEMOSS Docker images are production-ready and officially supported</li>
                    <li>Use bind mounts for dev hot reload, named volumes for prod persistence</li>
                    <li>Always run containers as non-root (user 1001) for security</li>
                    <li>Enable cluster mode (<code>SEMOSS_IS_CLUSTER=true</code>) for multi-replica deployments</li>
                    <li>Use health checks, resource limits, and secrets management in production</li>
                </ul>
            `
        },
    ]
};
