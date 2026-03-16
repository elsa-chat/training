// Topic: Docker Deployment
const slides_docker = [
        {
            id: "docker-title",
            title: "Infrastructure & Deployment",
            content: C.titleSlide(
                "Infrastructure & Deployment",
                `CI/CD, Docker builds, and production deployment`,
                "90 minutes"
            )
        },
        {
            id: "cicd-overview",
            title: "CI/CD Pipeline",
            content: `
                <h2>Continuous Integration & Deployment</h2>
                <p class="lead">Automated build pipeline using GitHub Actions</p>
                ${C.flow([
                    { title: 'GitHub Push', desc: 'Code pushed to repository', accent: true, arrow: '↓ triggers' },
                    { title: 'Build SEMOSS Core', desc: 'Compile Java libraries, run tests', arrow: '↓ publish' },
                    { title: 'Build Monolith WAR', desc: 'Package servlet application', arrow: '↓ publish' },
                    { title: 'Build SemossWeb', desc: 'Build React frontend', arrow: '↓ publish' },
                    { title: 'Publish to Maven', desc: 'Opensource Maven repository', accent: true },
                ])}
                ${C.callout('All artifacts are published to <strong>opensource Maven repository</strong> for downstream consumption by Docker builds.', 'info')}
            `
        },
        {
            id: "github-actions",
            title: "GitHub Actions Workflows",
            content: `
                <h2>GitHub Actions</h2>
                <p>Three primary build workflows automate the CI/CD pipeline:</p>
                ${C.table(
                    ['Workflow', 'Purpose', 'Output'],
                    [
                        ['Build SEMOSS', 'Compile SEMOSS core Java libraries and run unit tests', 'semoss-5.0.0-SNAPSHOT.jar published to Maven'],
                        ['Build Monolith', 'Package Monolith servlet WAR with dependencies', 'Monolith.war published to Maven'],
                        ['Build SemossWeb', 'Build React frontend with npm/webpack', 'SemossWeb static assets published to Maven'],
                    ]
                )}
                ${C.code(`# Example GitHub Actions workflow
name: Build SEMOSS Core
on:
  push:
    branches: [main, dev]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 21
        uses: actions/setup-java@v4
      - name: Build with Maven
        run: mvn clean install
      - name: Publish to Maven
        run: mvn deploy`, 'yaml', '.github/workflows/build-semoss.yml (simplified)')}
            `
        },
        {
            id: "docker-builds-overview",
            title: "Docker Build Strategy",
            content: `
                <h2>Docker Builds</h2>
                <p class="lead">Three specialized builder images create the final ${CONFIG.productName} container</p>
                ${C.cards([
                    {
                        badge: 'Builder',
                        title: 'Python Builder',
                        desc: 'Creates Python 3.12 virtual environment with all required packages (pandas, numpy, torch, transformers, etc.). Separate CPU and GPU variants.'
                    },
                    {
                        badge: 'Builder',
                        title: 'Tomcat Builder',
                        desc: 'Installs Java 21 (Azul Zulu), Tomcat 9.0.112, Maven 3.8.5, and build tooling. Provides foundation for application layer.'
                    },
                    {
                        badge: 'Final',
                        title: 'SEMOSS Image',
                        desc: 'Combines artifacts from builders with application code. Pulls latest SEMOSS artifacts from Maven, installs Playwright, configures runtime.'
                    },
                ])}
                ${C.callout('Builder images are tagged and versioned separately (e.g., <code>python-builder:3.12-cpu</code>, <code>tomcat-builder:9.0.112</code>) to enable caching and faster rebuilds.', 'info')}
            `
        },
        {
            id: "docker-architecture",
            title: `SEMOSS Container Architecture`,
            content: `
                <h2>SEMOSS Container Architecture</h2>
                <p>A ${CONFIG.productName} container packages all runtime dependencies into a single deployable unit.</p>
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
            id: "system-architecture",
            title: "System Architecture",
            content: `
                <h2>SEMOSS System Architecture</h2>
                <div style="text-align: center; margin: 20px 0;">
                    <img src="images/architecture.svg" alt="SEMOSS Architecture" style="max-width: 90%; height: auto; border: 1px solid #ddd; border-radius: 8px;">
                </div>
                <h3>Architecture Components</h3>
                ${C.table(
                    ['Component', 'Purpose', 'Technology'],
                    [
                        ['Azure Load Balancer', 'Entry point for user traffic, SSL termination', 'Azure ALB'],
                        ['API/WebSocket', 'RESTful API and real-time WebSocket connections', 'Tomcat + Spring'],
                        ['SEMOSS Pods', 'Container instances running application logic (2K-1, 2K-2, 2K-3)', 'Kubernetes Pods'],
                        ['Zookeeper Pods', 'Distributed coordination and configuration management', 'Apache Zookeeper'],
                        ['Azure Disk PVC', 'Optional self-hosted model storage (large models)', 'Azure Disk'],
                        ['Databases', 'User data, security, metadata storage', 'PostgreSQL'],
                        ['Azure Blob Storage', 'Object storage for projects, engines, assets', 'Azure Storage Account'],
                        ['Google-Hosted Models', 'External LLM APIs (Gemini, etc.)', 'Google AI'],
                        ['AWS-Hosted Models', 'External LLM APIs (Bedrock, etc.)', 'AWS Bedrock'],
                        ['Other External Models', 'OpenAI, Anthropic, and other providers', 'External APIs'],
                    ]
                )}
                ${C.callout('The architecture supports <strong>horizontal scaling</strong> with multiple SEMOSS pods behind a load balancer, shared state in databases and blob storage.', 'info')}
            `
        },
        {
            id: "docker-multi-stage-build",
            title: "Multi-Stage Build Strategy",
            content: `
                <h2>Multi-Stage Build Strategy</h2>
                <p>${CONFIG.productName} uses a multi-stage Dockerfile to minimize final image size and separate build tools from runtime.</p>
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
            id: "docker-local-testing",
            title: "Local Development with Docker Compose",
            content: `
                <h2>Docker Compose — For Local Testing Only</h2>
                <p class="lead"><code>docker-compose.yml</code> provides a quick way to run ${CONFIG.productName} locally for development and testing.</p>
                ${C.split(
                    {
                        title: 'Local Development',
                        content: `
                            <ul>
                                <li><strong>Single command</strong>: <code>docker-compose up</code> starts everything</li>
                                <li><strong>Service linking</strong>: SEMOSS, Postgres, MinIO connect automatically</li>
                                <li><strong>Volume mounting</strong>: Mount local code for hot reload</li>
                                <li><strong>Rapid iteration</strong>: Test changes without full deployment</li>
                            </ul>
                        `
                    },
                    {
                        title: 'Not For Production',
                        content: `
                            <ul>
                                <li><strong>No auto-scaling</strong>: Single container, no horizontal scale</li>
                                <li><strong>No high availability</strong>: Container restarts lose state</li>
                                <li><strong>Limited orchestration</strong>: Use Kubernetes for production</li>
                                <li><strong>Dev-optimized</strong>: Bind mounts, debug ports, relaxed security</li>
                            </ul>
                        `
                    }
                )}
                ${C.callout('<strong>Production deployments</strong> use Kubernetes with proper ingress, secrets management, auto-scaling, and monitoring.', 'warning')}
            `
        },
        {
            id: "docker-environment-overview",
            title: "Environment Variable Categories",
            content: `
                <h2>Configuration via Environment Variables</h2>
                <p>SEMOSS uses 150+ environment variables organized into categories. The <code>runCS.sh</code> script processes these at startup.</p>
                ${C.cards([
                    { badge: 'Category', title: 'Database Connections', desc: 'Security, LocalMaster, Themes, Scheduler, User Tracking, Model Logs, Prompt DB, Audit Logs' },
                    { badge: 'Category', title: 'Authentication & SSO', desc: 'Microsoft SSO, Native auth, API users, access keys, CSRF/CORS protection' },
                    { badge: 'Category', title: 'Python & R Runtime', desc: 'Python virtual env, Netty Python server, R configuration, chroot sandboxing' },
                    { badge: 'Category', title: 'Storage & Clustering', desc: 'Azure Blob, Zookeeper, cluster mode, shared file paths' },
                    { badge: 'Category', title: 'Admin Permissions', desc: 'Admin-only operations for projects, databases, models, storage, functions, vectors' },
                    { badge: 'Category', title: 'Performance & Limits', desc: 'File upload limits, frame size limits, memory settings, session timeouts' },
                    { badge: 'Category', title: 'Security Features', desc: 'Virus scanning, secrets management, header security, terminal access' },
                    { badge: 'Category', title: 'Feature Flags', desc: 'User tracking, model inference logs, audit logs, activity tracking, widget restrictions' },
                    { badge: 'Category', title: 'Frontend Config', desc: 'Routes, redirects, cookies, CORS origins, default pages' },
                ])}
                ${C.callout('The <code>runCS.sh</code> script checks each variable and calls specific configuration scripts to apply settings to Tomcat, RDF_Map.prop, and web.xml.', 'info')}
            `
        },
        {
            id: "env-database-connections",
            title: "Database Connections",
            content: `
                <h2>Database Environment Variables</h2>
                <p>SEMOSS supports external PostgreSQL databases for all system components.</p>
                ${C.table(
                    ['Database', 'Required Variables', 'Purpose'],
                    [
                        ['Security DB', 'CUSTOM_SECURITY_CONNECTION_URL<br>CUSTOM_SECURITY_USERNAME<br>CUSTOM_SECURITY_PASSWORD<br>CUSTOM_SECURITY_SCHEMA', 'User authentication, roles, permissions'],
                        ['LocalMaster', 'CUSTOM_LM_CONNECTION_URL<br>CUSTOM_LM_USERNAME<br>CUSTOM_LM_PASSWORD<br>CUSTOM_LM_SCHEMA', 'Project metadata, engines, models'],
                        ['Themes', 'CUSTOM_THEMES_CONNECTION_URL<br>CUSTOM_THEMES_USERNAME<br>CUSTOM_THEMES_PASSWORD', 'UI themes and branding'],
                        ['Scheduler', 'CUSTOM_SCHEDULER_CONNECTION_URL<br>CUSTOM_SCHEDULER_USERNAME<br>CUSTOM_SCHEDULER_PASSWORD', 'Scheduled jobs, cron tasks'],
                        ['User Tracking', 'CUSTOM_USER_TRACKING_CONNECTION_URL<br>CUSTOM_USER_TRACKING_USERNAME<br>USER_TRACKING_ENABLED=true', 'User activity analytics'],
                        ['Model Logs', 'CUSTOM_MODEL_INFERENCE_LOGS_CONNECTION_URL<br>MODEL_INFERENCE_LOGS_ENABLED=true', 'LLM inference logging'],
                        ['Prompt DB', 'CUSTOM_PROMPT_CONNECTION_URL<br>PROMPT_DB_ENABLED=true', 'Prompt templates library'],
                        ['Audit Logs', 'CUSTOM_AUDITLOGS_CONNECTION_URL<br>AUDIT_LOGS_ENABLED=true', 'Compliance audit trail'],
                    ]
                )}
                ${C.code(`# Example: Security Database Configuration
CUSTOM_SECURITY_DRIVER=org.postgresql.Driver
CUSTOM_SECURITY_RDBMS_TYPE=POSTGRES
CUSTOM_SECURITY_USERNAME=postgres
CUSTOM_SECURITY_PASSWORD=<secret>
CUSTOM_SECURITY_SCHEMA=public
CUSTOM_SECURITY_DATABASE=security
CUSTOM_SECURITY_CONNECTION_URL=jdbc:postgresql://db.example.com:5432/security`, 'bash', 'Database connection pattern')}
            `
        },
        {
            id: "env-authentication",
            title: "Authentication & SSO",
            content: `
                <h2>Authentication Configuration</h2>
                ${C.split(
                    {
                        title: 'Social Login (Microsoft SSO)',
                        content: `
                            ${C.code(`SETSOCIAL=true
ENABLE_MS=true
MS_DISPLAY_NAME="Deloitte Login"
MS_AUTHORITY=https://login.microsoftonline.com/<tenant>/
MS_CLIENT_ID=<client-id>
MS_REDIRECT=https://example.com/Monolith/api/auth/login/ms
MS_SECRET_KEY=<secret>
MS_TENANT=example.onmicrosoft.com
MS_SCOPE="User.Read openid email"
MS_ACCESS_KEY_ALLOWED=true
MS_GRAPHAPI_LOOKUP=false`, 'bash', 'Microsoft SSO variables')}
                        `
                    },
                    {
                        title: 'Native & API Authentication',
                        content: `
                            ${C.code(`ENABLE_NATIVE=true
ENABLE_NATIVE_REGISTRATION=false
ENABLE_NATIVE_ACCESS_KEY_ALLOWED=false

# API Users
ENABLE_API_USER=true
API_USER_DYNAMIC=false

# Anonymous Access
ANONYMOUS_USERS=false
ANONYMOUS_USER_UPLOAD=false`, 'bash', 'Native auth & API users')}
                        `
                    }
                )}
                ${C.callout('<strong>Best Practice:</strong> Store secrets in Kubernetes secrets, not in plain environment variables. Use <code>valueFrom.secretKeyRef</code> in deployment YAML.', 'warning')}
            `
        },
        {
            id: "env-python-runtime",
            title: "Python & R Runtime",
            content: `
                <h2>Python & R Configuration</h2>
                ${C.table(
                    ['Variable', 'Value', 'Purpose'],
                    [
                        ['SMSS_PYTHONHOME', '/usr/lib/python/semossvenv', 'Path to Python virtual environment'],
                        ['NETTY_PYTHON', 'true', 'Enable Netty-based Python server (recommended)'],
                        ['NATIVE_PY_SERVER', 'true', 'Use native Python server instead of TCP sockets'],
                        ['USE_TCP_PY', 'false', 'Deprecated: Use TCP sockets for Python (legacy)'],
                        ['USE_PY_FILE', 'false', 'Deprecated: Use file-based communication (legacy)'],
                        ['CHROOT_ENABLE', 'true', 'Enable chroot sandbox for Python execution'],
                        ['CHROOT_DIR', '/opt/chroot', 'Chroot directory for sandbox'],
                        ['CHROOT_SYMLINK_PATHS', '/usr/lib/python', 'Paths to symlink into chroot'],
                        ['R_ON', 'false', 'Enable R runtime (optional)'],
                        ['NETTY_R', 'false', 'Enable Netty-based R server'],
                        ['R_HOME', '/usr/lib/R', 'Path to R installation'],
                        ['R_CONNECTION_TYPE', 'JRI', 'R connection method (JRI or Rserve)'],
                    ]
                )}
                ${C.callout('<strong>Chroot Security:</strong> Chroot sandboxing isolates Python execution, preventing access to sensitive files. Requires <code>fakechroot</code> and proper symlinks.', 'tip')}
            `
        },
        {
            id: "env-storage-clustering",
            title: "Storage & Clustering",
            content: `
                <h2>Cloud Storage & Cluster Configuration</h2>
                <h3>Azure Blob Storage</h3>
                ${C.code(`SEMOSS_STORAGE_PROVIDER=AZURE
SEMOSS_IS_CLUSTER=true

# Azure Connection
AZ_NAME=<storage-account-name>
AZ_KEY=<storage-account-key>
AZ_CONN_STRING="DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net"
AZ_GENERATE_DYNAMIC_SAS=false`, 'bash', 'Azure Blob configuration')}

                <h3>Zookeeper Clustering</h3>
                ${C.code(`SEMOSS_IS_CLUSTER_ZK=true
ZK_SERVER=10.0.90.82:2181

# Pod Identity (Kubernetes)
POD_IP:
  valueFrom:
    fieldRef:
      fieldPath: status.podIP
HOST_NAME:
  valueFrom:
    fieldRef:
      fieldPath: metadata.name`, 'yaml', 'Zookeeper cluster coordination')}
                ${C.callout('<strong>Cluster Mode:</strong> When <code>SEMOSS_IS_CLUSTER=true</code>, all file operations use cloud storage (Azure Blob, S3, MinIO) instead of local disk.', 'info')}
            `
        },
        {
            id: "env-admin-permissions",
            title: "Admin Permission Controls",
            content: `
                <h2>Admin-Only Operation Flags</h2>
                <p>Control which operations require admin privileges. Set to <code>true</code> to restrict to admins only.</p>
                ${C.table(
                    ['Resource Type', 'Admin-Only Variables', 'Operations Controlled'],
                    [
                        ['Projects', 'ADMIN_ONLY_PROJECT_SET_PUBLIC', 'Make projects public'],
                        ['Databases', 'ADMIN_ONLY_DB_ADD<br>ADMIN_ONLY_DB_DELETE<br>ADMIN_ONLY_DB_ADD_ACCESS<br>ADMIN_ONLY_DB_SET_PUBLIC<br>ADMIN_ONLY_DB_SET_DISCOVERABLE', 'Add, delete, share, publish databases'],
                        ['Models', 'ADMIN_ONLY_MODEL_ADD<br>ADMIN_ONLY_MODEL_DELETE<br>ADMIN_ONLY_MODEL_ADD_ACCESS<br>ADMIN_ONLY_MODEL_SET_PUBLIC<br>ADMIN_ONLY_MODEL_SET_DISCOVERABLE', 'Add, delete, share, publish models'],
                        ['Storage', 'ADMIN_ONLY_STORAGE_ADD<br>ADMIN_ONLY_STORAGE_DELETE<br>ADMIN_ONLY_STORAGE_ADD_ACCESS<br>ADMIN_ONLY_STORAGE_SET_PUBLIC', 'Add, delete, share storage connections'],
                        ['Functions', 'ADMIN_ONLY_FUNCTION_ADD<br>ADMIN_ONLY_FUNCTION_DELETE<br>ADMIN_ONLY_FUNCTION_ADD_ACCESS<br>ADMIN_ONLY_FUNCTION_SET_PUBLIC', 'Add, delete, share functions'],
                        ['Vectors', 'ADMIN_ONLY_VECTOR_ADD<br>ADMIN_ONLY_VECTOR_DELETE<br>ADMIN_ONLY_VECTOR_ADD_ACCESS<br>ADMIN_ONLY_VECTOR_SET_PUBLIC', 'Add, delete, share vector DBs'],
                    ]
                )}
                ${C.code(`# Example: Lock down model and database operations
ADMIN_ONLY_MODEL_ADD=true
ADMIN_ONLY_MODEL_DELETE=true
ADMIN_ONLY_DB_ADD=false           # Allow users to add databases
ADMIN_ONLY_DB_DELETE=true         # But only admins can delete`, 'bash', 'Admin permission example')}
            `
        },
        {
            id: "env-performance-limits",
            title: "Performance & Resource Limits",
            content: `
                <h2>Performance & Limit Configuration</h2>
                ${C.table(
                    ['Category', 'Variable', 'Default/Example', 'Purpose'],
                    [
                        ['File Uploads', 'FILE_UPLOAD_LIMIT', '500 (MB)', 'Max file upload size'],
                        ['File Uploads', 'FILE_TRANSFER_LIMIT', '500 (MB)', 'Max file transfer size'],
                        ['File Uploads', 'SEMOSS_MAX_POST_SIZE', '524288000', 'Max POST request size (bytes)'],
                        ['Frame Limits', 'FRAME_SIZE_LIMIT', '100000', 'Max rows in generic frame'],
                        ['Frame Limits', 'FRAME_SIZE_LIMIT_NATIVE', '100000', 'Max rows in native SQL frame'],
                        ['Frame Limits', 'DEFAULT_FRAME_TYPE', 'NATIVE', 'Default frame implementation (NATIVE or H2)'],
                        ['Session', 'SESSION_TIMEOUT', '30 (minutes)', 'HTTP session timeout'],
                        ['Session', 'SESSION_LIMIT', 'unlimited', 'Max concurrent sessions per user'],
                        ['Memory', 'RESERVED_JAVA_MEM', '2G', 'Reserved memory for JVM'],
                        ['Memory', 'USER_MEM_LIMIT', '4G', 'Max memory per user'],
                        ['Memory', 'R_MEM_LIMIT', '2G', 'Max memory for R processes'],
                        ['Pivot', 'PIVOT_ROW_MAX', '10000', 'Max rows in pivot table'],
                        ['Pivot', 'PIVOT_COL_MAX', '100', 'Max columns in pivot table'],
                    ]
                )}
            `
        },
        {
            id: "env-security-features",
            title: "Security Features",
            content: `
                <h2>Security & Compliance Configuration</h2>
                ${C.table(
                    ['Feature', 'Variables', 'Purpose'],
                    [
                        ['Virus Scanning', 'VIRUS_SCANNING_ENABLED=true<br>VIRUS_SCANNING_METHOD=APACHE_TIKA', 'Scan uploaded files for malware'],
                        ['Secrets Management', 'SECRETS_MANAGER_ENABLED=true<br>SECRETS_MANAGER_TYPE=AZURE_KEY_VAULT', 'Store credentials in Azure Key Vault'],
                        ['CSRF Protection', 'ENABLE_CSRF=true', 'Enable CSRF tokens for state-changing requests'],
                        ['CORS', 'ENABLE_CORS=true<br>CORS_ALLOWED_ORIGINS=https://example.com', 'Configure cross-origin requests'],
                        ['Secure Cookies', 'SAMESITE_COOKIE=Lax<br>MONOLITH_COOKIE_SET_SECURE=true', 'Set cookie security attributes'],
                        ['Header Security', 'HEADER_SECURITY_ENABLED=true', 'Add security headers (CSP, X-Frame-Options, etc.)'],
                        ['Git Terminal', 'DISABLE_GIT_TERMINAL=true', 'Disable terminal access in Git operations'],
                        ['Encryption', 'ENCRYPT_SMSS=true<br>PM_SEMOSS_EXECUTE_SQL_ENCRYPTION_PASSWORD=<secret>', 'Encrypt SMSS files and SQL params'],
                        ['Trusted Tokens', 'TRUSTED_TOKEN_DOMAIN=example.com', 'Allow JWT tokens from trusted domain'],
                    ]
                )}
                ${C.callout('<strong>Defense in Depth:</strong> Combine chroot sandboxing, virus scanning, CSRF protection, and secrets management for comprehensive security.', 'tip')}
            `
        },
        {
            id: "env-feature-flags",
            title: "Feature Flags & Tracking",
            content: `
                <h2>Feature Flags & Analytics</h2>
                ${C.split(
                    {
                        title: 'Feature Toggles',
                        content: `
                            ${C.code(`# Logging & Analytics
USER_TRACKING_ENABLED=true
MODEL_INFERENCE_LOGS_ENABLED=true
AUDIT_LOGS_ENABLED=true
ACTIVITY_TRACKING_ENABLED=true

# Feature Controls
PROMPT_DB_ENABLED=true
ERROR_REPORT_VALVE_ENABLED=true
USER_EXISTS_FILTER=true
SHOW_WELCOME_BANNER=true

# Widget Restrictions
WIDGET_RESTRICTIONS_ENABLED=true

# External Permission Management
EXTERNAL_PERMISSION_MANAGEMENT=true`, 'bash', 'Feature flags')}
                        `
                    },
                    {
                        title: 'Analytics & Monitoring',
                        content: `
                            ${C.code(`# Google Analytics
GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X

# Memory Profiling
CHECK_MEM=true
MEM_PROFILE_SETTINGS=detailed

# Cache Settings
X_CACHE=true
T_ON=true`, 'bash', 'Monitoring configuration')}
                        `
                    }
                )}
            `
        },
        {
            id: "env-frontend-routing",
            title: "Frontend Configuration",
            content: `
                <h2>Frontend Routes & Redirects</h2>
                ${C.table(
                    ['Variable', 'Example Value', 'Purpose'],
                    [
                        ['FE_ROUTE', '/Monolith', 'Base path for backend API'],
                        ['CUSTOM_DEFAULT_PAGE', 'Monolith/login', 'Default landing page'],
                        ['CUSTOM_DEFAULT_PAGE_URL', 'https://example.com/SemossWeb/#/login', 'Full URL for login redirect'],
                        ['REDIRECT', 'https://example.com/SemossWeb/#/login', 'OAuth redirect URL after authentication'],
                        ['MONOLITH_COOKIE', 'ai-core-prd', 'Session cookie name'],
                        ['MONOLITH_ROUTE', '/Monolith', 'Monolith servlet route'],
                        ['LOAD_BALANCER_COOKIE_NAME', 'lb-cookie', 'Load balancer affinity cookie'],
                        ['OPTIONAL_COOKIES', 'false', 'Make cookies optional (privacy mode)'],
                        ['WHITE_LIST_DOMAINS', 'example.com,trusted.com', 'Allowed domains for CORS'],
                    ]
                )}
                ${C.code(`# Example: Production Frontend Configuration
FE_ROUTE=/Monolith
CUSTOM_DEFAULT_PAGE_URL=https://prod.eu.aicore.deloitte.com/SemossWeb/#/login
REDIRECT=https://prod.eu.aicore.deloitte.com/SemossWeb/#/login
MONOLITH_COOKIE=ai-core-prd
OPTIONAL_COOKIES=false`, 'bash', 'Frontend routing example')}
                ${C.callout('<strong>Note:</strong> The <code>updateFEIndexHtml.sh</code> script updates the frontend index.html with FE_ROUTE at startup.', 'info')}
            `
        },
        {
            id: "env-deployment-example",
            title: "Kubernetes Deployment Example",
            content: `
                <h2>Kubernetes Deployment with Environment Variables</h2>
                ${C.code(`apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-core-prd
  namespace: ai-core-prd
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ai-core-prd
  template:
    spec:
      containers:
      - name: ai-core
        image: docker.cfg.deloitte.com/ai_core/ai_core:latest
        command: ["/bin/bash", "-c", "runCS.sh"]
        env:
        # Chroot Security
        - name: CHROOT_ENABLE
          value: "true"
        - name: CHROOT_DIR
          value: /opt/chroot

        # Python Runtime
        - name: NETTY_PYTHON
          value: "true"
        - name: SMSS_PYTHONHOME
          value: /usr/lib/python/semossvenv

        # Database - use secrets
        - name: CUSTOM_SECURITY_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: username
        - name: CUSTOM_SECURITY_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
        - name: CUSTOM_SECURITY_CONNECTION_URL
          value: jdbc:postgresql://db.example.com:5432/security

        # Storage
        - name: SEMOSS_IS_CLUSTER
          value: "true"
        - name: SEMOSS_STORAGE_PROVIDER
          value: "AZURE"
        - name: AZ_CONN_STRING
          valueFrom:
            secretKeyRef:
              name: azure-storage
              key: connection-string

        # Zookeeper
        - name: SEMOSS_IS_CLUSTER_ZK
          value: "true"
        - name: ZK_SERVER
          value: "zk-1.svc:2181,zk-2.svc:2181,zk-3.svc:2181"

        # Pod Identity
        - name: POD_IP
          valueFrom:
            fieldRef:
              fieldPath: status.podIP
        - name: HOST_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name

        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "8"
            memory: 24Gi
        securityContext:
          runAsUser: 1001
          capabilities:
            drop: [NET_RAW]`, 'yaml', 'Kubernetes deployment snippet (sanitized)')}
                ${C.callout('<strong>Best Practice:</strong> Use Kubernetes secrets for all sensitive values (passwords, keys, connection strings). Never commit secrets to Git.', 'warning')}
            `
        },
        {
            id: "docker-recap",
            title: "Chapter Recap",
            content: `
                <h2>Chapter Recap: Infrastructure & Deployment</h2>
                ${C.cards([
                    {
                        badge: 'CI/CD',
                        title: 'GitHub Actions',
                        desc: 'Automated builds for SEMOSS core, Monolith WAR, and SemossWeb frontend. All artifacts published to opensource Maven repository.'
                    },
                    {
                        badge: 'Docker Builds',
                        title: 'Multi-Stage Strategy',
                        desc: 'Python builder (3.12 venv), Tomcat builder (Java 21 + Tomcat 9), and final SEMOSS image combining all components.'
                    },
                    {
                        badge: 'Architecture',
                        title: 'System Components',
                        desc: 'Load balancer, SEMOSS pods, Zookeeper, databases, blob storage, and external LLM providers. Supports horizontal scaling.'
                    },
                    {
                        badge: 'Container',
                        title: 'SEMOSS Container',
                        desc: 'Ubuntu 22.04 + Java 21 + Python 3.12 + Tomcat 9 + Playwright. Runs as user 1001 (non-root) for security.'
                    },
                    {
                        badge: 'Configuration',
                        title: '150+ Environment Variables',
                        desc: '9 categories: Databases, Auth/SSO, Python/R, Storage/Clustering, Admin Permissions, Performance Limits, Security, Feature Flags, Frontend.'
                    },
                    {
                        badge: 'Local Development',
                        title: 'Docker Compose',
                        desc: 'Use docker-compose for local testing only. Production deployments use Kubernetes with proper orchestration and scaling.'
                    },
                ])}
                <h3>Key Takeaways</h3>
                <ul>
                    <li>CI/CD pipeline automates builds and publishes to Maven for reproducibility</li>
                    <li>Multi-stage Docker builds separate build tools from runtime, reducing image size</li>
                    <li>Production architecture supports horizontal scaling with shared state in databases and blob storage</li>
                    <li>150+ environment variables provide fine-grained control over all SEMOSS features</li>
                    <li>runCS.sh startup script processes env vars and configures Tomcat, RDF_Map.prop, and web.xml</li>
                    <li>Always use Kubernetes secrets for sensitive values (passwords, API keys, connection strings)</li>
                    <li>Docker Compose is for local development only — use Kubernetes for production</li>
                </ul>
            `
        },
    ];
