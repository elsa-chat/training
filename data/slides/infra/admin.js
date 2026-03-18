// Topic: Admin & Monitoring
const slides_admin = [
        {
            id: "admin-title",
            title: "Admin & Monitoring",
            content: C.titleSlide(
                "Admin & Monitoring",
                "Managing users, engines, logs, and system health",
                "60 minutes"
            )
        },
        {
            id: "admin-overview",
            title: "Admin Features Overview",
            content: `
                <h2>${CONFIG.productName} Admin Capabilities</h2>
                <p class="lead">${CONFIG.productName} provides a comprehensive admin interface for managing users, engines, permissions, and monitoring system health.</p>
                ${C.cards([
                    { badge: 'Feature', title: 'User Management', desc: 'Create users, set metadata, manage permissions, assign roles' },
                    { badge: 'Feature', title: 'Engine Management', desc: 'View engines, check health, manage permissions, monitor usage' },
                    { badge: 'Feature', title: 'Logging & Audit', desc: 'Server logs, audit logs, model inference logs with JDBC persistence' },
                    { badge: 'Feature', title: 'System Config', desc: 'RDF_Map.prop settings, feature flags, database connections' },
                    { badge: 'Feature', title: 'Performance Tuning', desc: 'JVM settings, connection pools, caching strategies' },
                    { badge: 'Feature', title: 'Backup & Recovery', desc: 'Database backups, cloud sync, git version control' },
                ])}
                ${C.callout('Admin functions require <code>SecurityAdminUtils.getInstance(user)</code> to validate admin privileges. Non-admins cannot access these features.', 'warning')}
            `
        },
        {
            id: "admin-user-management",
            title: "User Management",
            content: `
                <h2>User Management via Admin Reactors</h2>
                <p>Admins can manage users, set metadata, and control access to engines and apps.</p>
                ${C.split(
                    {
                        title: 'Admin User Reactors',
                        content: C.code(`// Set user metadata (admin only)
AdminSetUserMetadata(
    userId="user@example.com",
                    provider="NATIVE",
    meta={
        "role": ["analyst"],
        "department": ["finance"]
    }
);

// Get user metadata
GetUserMetadata(
    userId="user@example.com",
    provider="NATIVE"
);

// Set user metakey options (dropdown values)
AdminSetUserMetakeyOptions(
    metakey="department",
    options=["finance", "engineering", "sales"]
);`, 'pixel', 'Admin User Management')
                    },
                    {
                        title: 'AdminSetUserMetadataReactor.java',
                        content: C.code(`public class AdminSetUserMetadataReactor {
    public NounMetadata execute() {
        organizeKeys();
        String userId = keyValue.get("userId");
        String userType = keyValue.get("provider");

        // Verify admin privileges
        SecurityAdminUtils adminUtils =
            SecurityAdminUtils.getInstance(
                this.insight.getUser());
        if (adminUtils == null) {
            throw new IllegalArgumentException(
                "User must be an admin");
        }

        Map<String, Object> metadata = getMetaMap();
        adminUtils.updateUserMetadata(
            userId,
            AuthProvider.getProviderFromString(userType),
            metadata);
        return new NounMetadata(true, BOOLEAN);
    }
}`, 'java', 'src/prerna/reactor/security/AdminSetUserMetadataReactor.java (simplified)')
                    }
                )}
                ${C.callout('User metadata can be used for role-based access control, departmental filtering, and custom user attributes.', 'info')}
            `
        },
        {
            id: "admin-engine-management",
            title: "Engine Management",
            content: `
                <h2>Engine Management & Monitoring</h2>
                ${C.code(`// List all engines user has access to
MyEngines(
    filterWord="sales",           // search term
    engineType=["DATABASE", "MODEL"],
    onlyFavorites=false,
    permissionFilters=[1, 2],     // 1=OWNER, 2=EDIT
    limit="50",
    offset="0",
    sort={"engine_name": "ASC"}
);

// Get engine health status
EngineHealth(engine="bd1dea64-ec6b-49af-9308-94b05551c83d");

// Get engine metadata
EngineMetadata(engine="bd1dea64-ec6b-49af-9308-94b05551c83d");

// Delete an engine (admin)
DeleteEngine(engine="bd1dea64-ec6b-49af-9308-94b05551c83d");`, 'pixel', 'Engine Management Commands')}
                ${C.table(
                    ['Reactor', 'Purpose', 'Admin Only'],
                    [
                        ['MyEngines', 'List engines accessible to current user', 'No'],
                        ['MyDiscoverableEngines', 'List engines marked as discoverable', 'No'],
                        ['EngineHealth', 'Check engine connection status', 'No'],
                        ['EngineMetadata', 'Get engine configuration and properties', 'No'],
                        ['DeleteEngine', 'Permanently delete an engine', 'Yes (Owner)'],
                        ['AdminGetRDFMap', 'View RDF_Map.prop configuration', 'Yes'],
                    ]
                )}
                ${C.callout('Use <code>EngineHealth</code> regularly to monitor database connections, model endpoints, and vector store availability.', 'tip')}
            `
        },
        {
            id: "admin-myengines-reactor",
            title: "MyEnginesReactor Deep Dive",
            content: `
                <h2>MyEnginesReactor.java</h2>
                ${C.code(`public class MyEnginesReactor extends AbstractReactor {
    public MyEnginesReactor() {
        this.keysToGet = new String[] {
            ReactorKeysEnum.FILTER_WORD.getKey(),
            ReactorKeysEnum.LIMIT.getKey(),
            ReactorKeysEnum.OFFSET.getKey(),
            ReactorKeysEnum.ONLY_FAVORITES.getKey(),
            ReactorKeysEnum.ENGINE_TYPE.getKey(),
            ReactorKeysEnum.PERMISSION_FILTERS.getKey(),
            ReactorKeysEnum.SORT.getKey()
        };
    }

    @Override
    public NounMetadata execute() {
        String searchTerm = getString(ReactorKeysEnum.FILTER_WORD.getKey());
        List<String> engineTypes = getListString(ReactorKeysEnum.ENGINE_TYPE.getKey());
        boolean favoritesOnly = getBoolean(ReactorKeysEnum.ONLY_FAVORITES.getKey(), false);
        List<Integer> permissionFilters = getListInteger(
            ReactorKeysEnum.PERMISSION_FILTERS.getKey());

        // Get engines from security database
        List<Map<String, Object>> engineInfo =
            SecurityEngineUtils.getUserEngineList(
                this.insight.getUser(),
                engineTypes,
                engineIdFilters,
                favoritesOnly,
                engineMetadataFilter,
                permissionFilters,
                searchTerm,
                limit,
                offset,
                sortFields
            );

        return new NounMetadata(engineInfo, PixelDataType.CUSTOM_DATA_STRUCTURE);
    }
}`, 'java', 'src/prerna/reactor/security/MyEnginesReactor.java (simplified)')}
                ${C.callout('This reactor powers the engine catalog UI, filtering by type, permissions, favorites, and metadata.', 'info')}
            `
        },
        {
            id: "admin-logging-architecture",
            title: "Logging Architecture",
            content: `
                <h2>${CONFIG.productName} Logging: Multi-Appender Strategy</h2>
                <p>${CONFIG.productName} uses Log4j2 with multiple appenders for comprehensive logging and auditing.</p>
                ${C.layers([
                    { label: "Application Loggers", accent: true, items: [
                        { title: "EngineLogger", desc: "Engine operations, query execution", accent: true },
                        { title: "prerna.*", desc: `All ${CONFIG.productName} packages`, accent: true },
                        { title: "AsyncRoot", desc: "Third-party libraries (WARN+)", },
                    ]},
                    { label: "Appenders", items: [
                        { title: "Console", desc: "STDOUT for container logs" },
                        { title: "RollingRandomAccessFile", desc: "$CATALINA_BASE/logs/semossLog.log" },
                        { title: "ServerLogsJDBCAppender", desc: "Database table for log persistence" },
                        { title: "AuditLogsJDBCAppender", desc: "Database table for audit trails" },
                    ]},
                    { label: "Storage", items: [
                        { title: "File System", desc: "Rolling logs (250MB per file, 1000 files max)" },
                        { title: "Database", desc: "Centralized logs for multi-container deployments" },
                    ]},
                ])}
                ${C.callout('In Docker, use <code>docker-compose logs -f semoss</code> to stream console output. For historical logs, query the ServerLogsJDBCAppender database table.', 'tip')}
            `
        },
        {
            id: "admin-logging-config",
            title: "Log4j2 Configuration",
            content: `
                <h2>log4j2.xml Configuration</h2>
                ${C.code(`<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO" monitorInterval="30">
    <Appenders>
        <!-- Console Appender -->
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout>
                <Pattern>[%-5level] %d{yyyy-MM-dd HH:mm:ss} %c{1.}:%L [user=%X{userId}] %maskMsg%n</Pattern>
            </PatternLayout>
        </Console>

        <!-- Rolling File Appender -->
        <RollingRandomAccessFile name="RollingRandomAccessFile"
            fileName="\${sys:catalina.base}/logs/semossLog.log"
            filePattern="\${sys:catalina.base}/logs/\${date:yyyy-MM-dd}/semossLog-%d{yyyy-MM-dd}-%i.log"
            immediateFlush="false">
            <PatternLayout>
                <Pattern>[%-5level] %d{yyyy-MM-dd HH:mm:ss} %c{1.}:%L [user=%X{userId}] %maskMsg%n</Pattern>
            </PatternLayout>
            <Policies>
                <TimeBasedTriggeringPolicy interval="1" modulate="true" />
                <SizeBasedTriggeringPolicy size="250MB" />
            </Policies>
            <DefaultRolloverStrategy max="1000" />
        </RollingRandomAccessFile>

        <!-- Database Appender for Server Logs -->
        <ServerLogsJDBCAppender name="ServerLogsJDBCAppender" batchSize="1">
            <PatternLayout>
                <Pattern>[%-5level] %d{yyyy-MM-dd HH:mm:ss} %c{1.}:%L [user=%X{userId}] [session=%X{sessionId}] %maskMsg%n</Pattern>
            </PatternLayout>
        </ServerLogsJDBCAppender>

        <!-- Database Appender for Audit Logs -->
        <AuditLogsJDBCAppender name="AuditLogsJDBCAppender" batchSize="1">
            <PatternLayout>
                <Pattern>[%-5level] %d{yyyy-MM-dd HH:mm:ss} %c{1.}:%L [user=%X{userId}] [reqId=%X{requestId}] %maskMsg%n</Pattern>
            </PatternLayout>
        </AuditLogsJDBCAppender>
    </Appenders>

    <Loggers>
        <AsyncLogger name="EngineLogger" level="INFO" additivity="false">
            <AppenderRef ref="Console" />
            <AppenderRef ref="RollingRandomAccessFile" />
            <AppenderRef ref="ServerLogsJDBCAppender" />
            <AppenderRef ref="AuditLogsJDBCAppender" />
        </AsyncLogger>

        <AsyncLogger name="prerna" level="INFO" includeLocation="true">
            <AppenderRef ref="Console" />
            <AppenderRef ref="RollingRandomAccessFile" />
            <AppenderRef ref="ServerLogsJDBCAppender" />
        </AsyncLogger>

        <AsyncRoot level="WARN">
            <AppenderRef ref="Console" />
            <AppenderRef ref="RollingRandomAccessFile" />
            <AppenderRef ref="ServerLogsJDBCAppender" />
        </AsyncRoot>
    </Loggers>
</Configuration>`, 'xml', 'log4j2.xml')}
            `
        },
        {
            id: "admin-log-patterns",
            title: "Log Patterns & MDC",
            content: `
                <h2>Log Patterns & Mapped Diagnostic Context (MDC)</h2>
                <p>${CONFIG.productName} logs include contextual information via Log4j2's MDC (Mapped Diagnostic Context).</p>
                ${C.table(
                    ['MDC Key', 'Description', 'Example Value'],
                    [
                        ['%X{userId}', 'Authenticated user ID', 'user@example.com'],
                        ['%X{sessionId}', 'HTTP session ID', 'abc-123-session'],
                        ['%X{clientIP}', 'Client IP address', '192.168.1.100'],
                        ['%X{requestId}', 'Unique request ID for tracing', 'req-789-xyz'],
                    ]
                )}
                ${C.code(`// Example log line
[INFO ] 2026-02-18 14:30:45 MyEnginesReactor:78 [user=admin@example.com] Retrieved 42 engines for user

// With full MDC context
[INFO ] 2026-02-18 14:30:45 MyEnginesReactor:78 [user=admin@example.com] [session=abc-123] [ip=192.168.1.100] [reqId=req-789] Retrieved 42 engines`, 'plaintext', 'Log Output Examples')}
                ${C.callout('Use <code>%maskMsg</code> to automatically mask sensitive data (passwords, tokens) in logs before writing.', 'warning')}
            `
        },
        {
            id: "admin-log-monitoring",
            title: "Log Monitoring Strategies",
            content: `
                <h2>Monitoring Logs in Production</h2>
                ${C.cards([
                    {
                        badge: 'Strategy',
                        title: 'Real-Time Streaming',
                        desc: 'Use <code>tail -f</code> on log files or <code>docker logs -f semoss</code> for live monitoring.'
                    },
                    {
                        badge: 'Strategy',
                        title: 'Centralized Logging (ELK Stack)',
                        desc: 'Ship logs to Elasticsearch via Filebeat or Logstash. Visualize in Kibana dashboards.'
                    },
                    {
                        badge: 'Strategy',
                        title: 'Database Queries',
                        desc: 'Query ServerLogsJDBCAppender table for historical analysis. Filter by user, date, log level.'
                    },
                    {
                        badge: 'Strategy',
                        title: 'Cloud Logging (AWS CloudWatch, Azure Monitor)',
                        desc: 'Configure Docker to stream logs to cloud provider log services.'
                    },
                    {
                        badge: 'Strategy',
                        title: 'Alerting (Splunk, Datadog)',
                        desc: 'Set up alerts for ERROR/WARN patterns, high log volume, or specific error messages.'
                    },
                ])}
                ${C.code(`// Query ServerLogs database table (pseudo-SQL)
SELECT timestamp, log_level, logger_name, message
FROM server_logs
WHERE user_id = 'admin@example.com'
  AND log_level IN ('ERROR', 'WARN')
  AND timestamp >= NOW() - INTERVAL '1 day'
ORDER BY timestamp DESC
LIMIT 100;`, 'sql', 'Querying Server Logs')}
            `
        },
        {
            id: "admin-performance-tuning",
            title: "Performance Tuning",
            content: `
                <h2>Performance Tuning for ${CONFIG.productName}</h2>
                ${C.split(
                    {
                        title: 'JVM Settings',
                        content: C.code(`# In docker-compose.yml or Dockerfile
environment:
  JAVA_OPTS: >
    -Xms4g
    -Xmx8g
    -XX:+UseG1GC
    -XX:MaxGCPauseMillis=200
    -XX:+HeapDumpOnOutOfMemoryError
    -XX:HeapDumpPath=/opt/semosshome/logs/heap_dump.hprof

# For debugging (disable in prod)
# -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005`, 'yaml', 'JVM Memory & GC Tuning')
                    },
                    {
                        title: 'Database Connection Pooling',
                        content: C.code(`# In RDF_Map.prop
HIKARI_MAX_POOL_SIZE 50
HIKARI_MIN_IDLE 10
HIKARI_CONNECTION_TIMEOUT 30000
HIKARI_IDLE_TIMEOUT 600000
HIKARI_MAX_LIFETIME 1800000

# For read-heavy workloads
HIKARI_MAX_POOL_SIZE 100`, 'properties', 'HikariCP Connection Pool Settings')
                    }
                )}
                <h3>Performance Checklist</h3>
                <ul>
                    <li><strong>JVM Heap</strong>: Set <code>-Xmx</code> to 50-75% of container memory limit</li>
                    <li><strong>GC Tuning</strong>: Use G1GC for large heaps (>4GB), tune pause times</li>
                    <li><strong>Connection Pools</strong>: Size based on concurrent users × avg queries per request</li>
                    <li><strong>Caching</strong>: Enable query result caching for frequent read patterns</li>
                    <li><strong>Async Logging</strong>: Already enabled via <code>AsyncLogger</code> in log4j2.xml</li>
                </ul>
            `
        },
        {
            id: "admin-backup-recovery",
            title: "Backup & Recovery",
            content: `
                <h2>Backup & Recovery Strategies</h2>
                ${C.flow([
                    { title: 'Database Backups', desc: 'Backup Security DB, LocalMaster, Model Logs (Postgres pg_dump)', accent: true, arrow: '↓' },
                    { title: 'File Storage Backups', desc: 'Backup /opt/semosshome (engines, projects, uploads)', arrow: '↓' },
                    { title: 'Cloud Sync', desc: 'SEMOSS_IS_CLUSTER=true → auto-sync to MinIO/S3', arrow: '↓' },
                    { title: 'Git Version Control', desc: 'App source code auto-committed to app_root/version/.git', accent: true },
                ])}
                ${C.split(
                    {
                        title: 'Postgres Backup',
                        content: C.code(`# Backup all schemas
pg_dump -h postgres -U postgres -d postgres \\
  -n localmaster -n security -n modellogs \\
  > semoss_backup_2026-02-18.sql

# Restore
psql -h postgres -U postgres -d postgres \\
  < semoss_backup_2026-02-18.sql

# Automated daily backups (cron)
0 2 * * * /usr/bin/pg_dump ... > backup_$(date +%Y%m%d).sql`, 'bash', 'Database Backup/Restore')
                    },
                    {
                        title: 'File System Backup',
                        content: C.code(`# Backup ${CONFIG.productName} home directory
tar -czf semosshome_backup.tar.gz /opt/semosshome

# Restore
tar -xzf semosshome_backup.tar.gz -C /opt

# Sync to S3 (if not using cluster mode)
aws s3 sync /opt/semosshome s3://my-bucket/semoss-backup/`, 'bash', 'File System Backup')
                    }
                )}
                ${C.callout('<strong>Disaster Recovery Plan:</strong> Test your restore process quarterly. Backup frequency should match your RPO (Recovery Point Objective).', 'warning')}
            `
        },
        {
            id: "admin-handson",
            title: "Hands-on: Admin Tasks",
            content: `
                <h2>Hands-on: Admin Task Walkthrough</h2>
                ${C.handson('Admin Operations', `
                    <h4>Step 1: List All Engines</h4>
                    ${C.code(`MyEngines(
    engineType=["DATABASE", "MODEL"],
    limit="100",
    sort={"engine_name": "ASC"}
);`, 'pixel')}
                    <p>Review the list of engines. Note the <code>database_id</code> and <code>engine_type</code>.</p>

                    <h4>Step 2: Check Engine Health</h4>
                    ${C.code(`EngineHealth(engine="<engine-id>");

// Returns:
// { "status": "healthy", "message": "Connection successful" }
// or
// { "status": "unhealthy", "message": "Connection timeout" }`, 'pixel')}
                    <p>If unhealthy, check database credentials, network connectivity, and engine configuration.</p>

                    <h4>Step 3: Set User Metadata (Admin Only)</h4>
                    ${C.code(`AdminSetUserMetadata(
    userId="analyst@example.com",
    provider="NATIVE",
    meta={
        "role": ["analyst"],
        "department": ["finance"],
        "region": ["US-West"]
    }
);`, 'pixel')}

                    <h4>Step 4: View Logs</h4>
                    ${C.code(`# In Docker:
docker-compose logs -f semoss | grep ERROR

# On host:
tail -f $CATALINA_BASE/logs/semossLog.log | grep ERROR`, 'bash')}
                    <p>Look for patterns: common errors, user activity, slow queries.</p>

                    <h4>Step 5: Query Server Logs Database</h4>
                    ${C.code(`# Connect to Postgres
docker-compose exec postgres psql -U postgres

# Query recent errors
SELECT timestamp, log_level, logger_name, message
FROM server_logs.logs
WHERE log_level = 'ERROR'
  AND timestamp >= NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC
LIMIT 20;`, 'sql')}

                    <h4>Step 6: Backup Databases</h4>
                    ${C.code(`# Backup all ${CONFIG.productName} schemas
docker-compose exec postgres pg_dump -U postgres -d postgres \\
  -n localmaster -n security -n modellogs \\
  > semoss_backup_$(date +%Y%m%d).sql

# Verify backup file
ls -lh semoss_backup_*.sql`, 'bash')}
                `)}
            `
        },
        {
            id: "admin-recap",
            title: "Chapter Recap",
            content: `
                <h2>Chapter Recap: Admin & Monitoring</h2>
                ${C.cards([
                    {
                        badge: 'User Management',
                        title: 'Admin User Reactors',
                        desc: 'AdminSetUserMetadata, AdminSetUserMetakeyOptions, GetUserMetadata. Requires admin privileges via SecurityAdminUtils.'
                    },
                    {
                        badge: 'Engine Management',
                        title: 'Engine Monitoring',
                        desc: 'MyEngines, EngineHealth, EngineMetadata. Filter by type, permissions, favorites. Monitor health status.'
                    },
                    {
                        badge: 'Logging',
                        title: 'Multi-Appender Strategy',
                        desc: 'Console, RollingFile, ServerLogsJDBC, AuditLogsJDBC. MDC context: userId, sessionId, clientIP, requestId.'
                    },
                    {
                        badge: 'Performance',
                        title: 'Tuning JVM & Pools',
                        desc: 'Set -Xmx/-Xms for heap, use G1GC, configure HikariCP connection pools. Enable async logging.'
                    },
                    {
                        badge: 'Backup',
                        title: 'Backup & Recovery',
                        desc: 'pg_dump for Postgres, tar for file system, cloud sync via MinIO/S3. Test restore process regularly.'
                    },
                ])}
                <h3>Key Takeaways</h3>
                <ul>
                    <li>Admin features require explicit validation via <code>SecurityAdminUtils</code></li>
                    <li>Logs are written to console, file, and database for multi-level monitoring</li>
                    <li>Use <code>EngineHealth</code> proactively to catch connection issues early</li>
                    <li>JVM tuning and connection pooling are critical for performance at scale</li>
                    <li>Automated backups with tested restore procedures are essential for production</li>
                </ul>
            `
        },
    ];
