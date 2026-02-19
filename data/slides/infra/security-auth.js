// Topic: Security & Auth
const slides_security_auth = [
        {
            id: "security-auth-title",
            title: "Security & Auth",
            content: C.titleSlide(
                "Security & Auth",
                `Authentication, authorization, and access control in ${CONFIG.productName}`,
                "90 minutes"
            )
        },
        {
            id: "security-overview",
            title: `${CONFIG.productName} Security Overview`,
            content: `
                <h2>${CONFIG.productName} Security Architecture</h2>
                <p class="lead">${CONFIG.productName} provides enterprise-grade security with <span class="highlight">pluggable authentication</span>, <span class="highlight">role-based authorization</span>, and <span class="highlight">granular permissions</span> for apps and engines.</p>
                ${C.layers([
                    { label: "Authentication", items: [
                        { title: "AuthProvider", desc: "OAuth, SAML, LDAP, Native, CAC" }
                    ]},
                    { label: "User Management", accent: true, items: [
                        { title: "User", desc: "AccessTokens + Groups + Profile", accent: true },
                        { title: "SMSS_USER", desc: "Security database (H2/Postgres)" }
                    ]},
                    { label: "Authorization", items: [
                        { title: "Permissions", desc: "OWNER, EDIT, READ_ONLY" },
                        { title: "Security*Utils", desc: "Permission checks" }
                    ]},
                    { label: "Resources", items: [
                        { title: "Projects (Apps)", desc: "App-level access control" },
                        { title: "Engines", desc: "Database/model access control" }
                    ]}
                ])}
                ${C.callout('<strong>Key principle:</strong> All security checks happen server-side. The backend verifies user identity and permissions before allowing any operation.', 'info')}
            `
        },
        {
            id: "auth-providers",
            title: "Authentication Providers",
            content: `
                <h2>Authentication Providers</h2>
                <p>${CONFIG.productName} supports multiple authentication providers via the <code>AuthProvider</code> enum, enabling SSO, OAuth, and enterprise identity integrations.</p>
                ${C.code(`public enum AuthProvider {
    // OAuth 2.0 Providers
    GOOGLE("GOOGLE", "Google", true, GoogleTokenFiller.class.getName()),
    MICROSOFT("MICROSOFT", "Microsoft", true, MicrosoftTokenFiller.class.getName()),
    GITHUB("GITHUB", "GitHub", true, GithubTokenFiller.class.getName()),
    GITLAB("GITLAB", "GitLab", true, GitLabTokenFiller.class.getName()),
    OKTA("OKTA", "Okta", true, OktaTokenFiller.class.getName()),
    SALESFORCE("SALESFORCE", "Salesforce", true, null),
    KEYCLOAK("KEYCLOAK", "Keycloak", true, GenericTokenFiller.class.getName()),
    FORGEROCK("FORGEROCK", "Forgerock", true, GenericTokenFiller.class.getName()),
    ADFS("ADFS", "ADFS", true, null),

    // Enterprise / Non-OAuth
    NATIVE("NATIVE", "Native", false, null),          // Username + password
    SAML("SAML", "SAML", false, null),                // SAML 2.0
    LDAP("LDAP", "Active Directory", false, null),    // LDAP/AD
    CAC("CAC", "CAC", false, null),                   // Common Access Card
    WINDOWS_USER("WINDOWS_USER", "Windows NLTM", false, null),
    API_USER("API_USER", "API Login", false, null),   // API key authentication

    // Generic fallback
    GENERIC("GENERIC", "Generic", true, GenericTokenFiller.class.getName());

    private String label;
    private String displayName;
    private boolean isOAuth;
    private String tokenFillerClass;  // Handles token refresh
}`, 'java', 'prerna/auth/AuthProvider.java')}
                ${C.callout('OAuth providers use <code>TokenFiller</code> classes to refresh expired access tokens automatically using refresh tokens.', 'tip')}
            `
        },
        {
            id: "user-accesstoken",
            title: "User & AccessToken",
            content: `
                <h2>User & AccessToken Structure</h2>
                <p>The <code>User</code> object represents an authenticated user and stores multiple <code>AccessToken</code> objects (one per AuthProvider).</p>
                ${C.split(
                    {
                        title: 'User Object',
                        content: C.code(`public class User {
    // Authentication
    private Hashtable<AuthProvider, AccessToken> accessTokens;
    private List<AuthProvider> loggedInProfiles;

    // User data
    private ZoneId zoneId;
    private Map<String, Object> roomHash;

    // Execution environments
    private IRUserConnection rcon;
    private ClientProcessWrapper pythonCPW;
    private Process pyProcess;
    private String chrootPath;

    // Methods
    public AccessToken getAccessToken(AuthProvider provider);
    public void addAccessToken(AuthProvider provider, AccessToken token);
}`, 'java', 'prerna/auth/User.java (simplified)')
                    },
                    {
                        title: 'AccessToken Object',
                        content: C.code(`public class AccessToken {
    AuthProvider provider;

    // OAuth tokens
    String id;
    String username;
    String access_token;
    int expires_in;
    String token_type = "Bearer";

    // User profile
    String email;
    String name;
    String phone;
    String locale;

    // Groups (from IDP)
    Collection<String> userGroups;
    String userGroupType;

    // Model usage limits
    int modelMaxTokens;
    double modelMaxResponseTime;
    String modelUsageFrequency;
    String modelUsageRestriction;

    // Account status
    boolean locked;
    SemossDate lastLogin;
    SemossDate lastPasswordReset;
}`, 'java', 'prerna/auth/AccessToken.java (simplified)')
                    }
                )}
            `
        },
        {
            id: "permission-model",
            title: "Permission Model",
            content: `
                <h2>Permission Model — OWNER / EDIT / READ_ONLY</h2>
                <p class="lead">${CONFIG.productName} uses a 3-tier permission model applied to <span class="highlight">Projects</span> (apps) and <span class="highlight">Engines</span> (databases, models).</p>
                ${C.code(`public enum AccessPermissionEnum {
    OWNER (1, "OWNER"),          // Full control: edit, delete, grant permissions
    EDIT (2, "EDIT"),            // Can modify but not delete or manage permissions
    READ_ONLY (3, "READ_ONLY");  // View-only access

    public static boolean isEditor(int permission) {
        return permission == 1 || permission == 2;  // OWNER or EDIT
    }

    public static boolean isOwner(int permission) {
        return permission == 1;
    }
}`, 'java', 'prerna/auth/AccessPermissionEnum.java')}
                ${C.table(
                    ['Permission', 'Projects (Apps)', 'Engines (Databases/Models)'],
                    [
                        [
                            '<code>OWNER</code>',
                            'Create insights, edit app, delete app, manage users, publish',
                            'Run queries, edit schema/smss, delete engine, grant permissions'
                        ],
                        [
                            '<code>EDIT</code>',
                            'Create insights, edit app (cannot delete or manage permissions)',
                            'Run queries, edit data (cannot delete engine or manage permissions)'
                        ],
                        [
                            '<code>READ_ONLY</code>',
                            'View app, create insights (no editing)',
                            'Read-only queries (no writes, no schema changes)'
                        ]
                    ]
                )}
                ${C.callout('Permissions are stored in the <strong>SMSS_USER</strong> security database and checked on every API request via Security*Utils classes.', 'info')}
            `
        },
        {
            id: "security-database",
            title: "Security Database (SMSS_USER)",
            content: `
                <h2>Security Database — SMSS_USER</h2>
                <p>SEMOSS uses a dedicated security database (<code>SMSS_USER</code>) to store users, permissions, and audit logs. Default: H2 embedded database (can be Postgres for production).</p>
                ${C.tree([
                    { name: "SMSS_USER (Security DB)", type: "dir", children: [
                        { name: "SMSSUSER", type: "file", desc: "← User accounts (id, name, email, password_hash)" },
                        { name: "SMSS_USER_GROUP", type: "file", desc: "← User groups" },
                        { name: "PROJECTPERMISSION", type: "file", desc: "← Project (app) permissions per user" },
                        { name: "ENGINEPERMISSION", type: "file", desc: "← Engine (database/model) permissions per user" },
                        { name: "GROUPPROJECTPERMISSION", type: "file", desc: "← Project permissions per group" },
                        { name: "GROUPENGINEPERMISSION", type: "file", desc: "← Engine permissions per group" },
                        { name: "ACCESSKEYS", type: "file", desc: "← API keys and access tokens" },
                        { name: "PASSWORD_RESET_TOKENS", type: "file", desc: "← Password reset tokens" },
                        { name: "USER_LOGIN_ATTEMPTS", type: "file", desc: "← Failed login tracking" }
                    ]}
                ])}
                ${C.code(`// Example: Querying user permissions
SELECT p.PROJECTID, p.PERMISSION, p.USERID
FROM PROJECTPERMISSION p
WHERE p.USERID = 'user@example.com';

// Result:
// PROJECTID            | PERMISSION | USERID
// --------------------+------------+-------------------
// analytics-dashboard  | 1          | user@example.com   (OWNER)
// reports-app          | 2          | user@example.com   (EDIT)
// public-viewer        | 3          | user@example.com   (READ_ONLY)`, 'sql', 'Permission query')}
            `
        },
        {
            id: "permission-checks",
            title: "Permission Checks",
            content: `
                <h2>Permission Checks — Security*Utils Classes</h2>
                <p>Before allowing any operation, SEMOSS checks user permissions via <code>Security*Utils</code> helper classes.</p>
                ${C.flow([
                    { title: 'API Request', desc: 'User sends POST /api/engine/runPixel', accent: true },
                    { title: 'Extract User', desc: 'HttpSession → User object', arrow: '↓' },
                    { title: 'Check Permission', desc: 'SecurityProjectUtils.userCanViewProject(user, projectId)', arrow: '↓' },
                    { title: 'Query SMSS_USER', desc: 'SELECT permission FROM PROJECTPERMISSION WHERE...', arrow: '↓' },
                    { title: 'Authorize or Deny', desc: 'If permission >= required level, continue. Else throw SecurityException.', arrow: '↓' },
                    { title: 'Execute Operation', desc: 'Run Pixel on Insight', accent: true }
                ])}
                ${C.code(`// Example: Security check in a reactor
public class MyReactor extends AbstractReactor {
    @Override
    public NounMetadata execute() {
        User user = this.insight.getUser();
        String projectId = this.insight.getProjectId();

        // Check if user has EDIT permission
        if (!SecurityProjectUtils.userCanEditProject(user, projectId)) {
            throw new IllegalArgumentException("User does not have permission to edit this project");
        }

        // Check if user has access to specific engine
        String engineId = keyValue.get("engineId");
        if (!SecurityEngineUtils.userCanViewEngine(user, engineId)) {
            throw new IllegalArgumentException("User does not have permission to access engine: " + engineId);
        }

        // User is authorized — proceed with operation
        // ...
    }
}`, 'java', 'Permission check in reactor')}
            `
        },
        {
            id: "groups-rbac",
            title: "Groups & Role-Based Access Control",
            content: `
                <h2>Groups & Role-Based Access Control</h2>
                <p>SEMOSS supports group-based permissions, allowing admins to assign permissions to groups rather than individual users.</p>
                ${C.sequence(
                    ["IDP (SAML/OAuth)", "User Logs In", "SEMOSS Backend", "SMSS_USER DB", "Permission Check"],
                    [
                        { from: 0, to: 1, label: 'User authenticates' },
                        { from: 1, to: 2, label: 'SAML assertion with groups: ["analysts", "admins"]' },
                        { from: 2, to: 3, label: 'Query group permissions' },
                        { from: 3, to: 2, label: 'GROUPPROJECTPERMISSION: analysts → EDIT, admins → OWNER', type: 'response' },
                        { from: 2, to: 4, label: 'Merge user + group permissions (highest wins)' },
                        { from: 4, to: 2, label: 'Final permission: OWNER', type: 'response' }
                    ]
                )}
                ${C.code(`// Group permission logic
// 1. User has direct permission: EDIT (2)
// 2. User belongs to group "admins" with permission: OWNER (1)
// Result: User gets OWNER (highest permission wins)

public static int getUserProjectPermission(User user, String projectId) {
    int directPermission = getDirectUserPermission(user, projectId);
    int groupPermission = getHighestGroupPermission(user, projectId);
    return Math.min(directPermission, groupPermission);  // Lower number = higher permission
}`, 'java', 'Group permission merge logic')}
                ${C.callout('Groups are typically synced from external IDPs (SAML, OAuth). SEMOSS also supports local groups managed via admin reactors.', 'tip')}
            `
        },
        {
            id: "admin-operations",
            title: "Admin Operations",
            content: `
                <h2>Admin Operations — Reactors for User Management</h2>
                <p>SEMOSS provides 30+ admin reactors for managing users, permissions, and system configuration.</p>
                ${C.cards([
                    { badge: 'User Management', title: 'AdminExportAllUsersReactor', desc: 'Export all users as CSV/Excel for auditing' },
                    { badge: 'User Management', title: 'AdminUploadUsersReactor', desc: 'Bulk import users from CSV/Excel' },
                    { badge: 'User Management', title: 'AdminLockAccountsReactor', desc: 'Lock/unlock user accounts (suspend access)' },
                    { badge: 'Permissions', title: 'AdminExportUserDatabasePermissionsReactor', desc: 'Export user→engine permission matrix' },
                    { badge: 'Permissions', title: 'AdminUploadDatabasePermissionsReactor', desc: 'Bulk import engine permissions' },
                    { badge: 'Analytics', title: 'AdminGetEngineUsagePerUserReactor', desc: 'Usage analytics per user' },
                    { badge: 'Analytics', title: 'AdminGetProjectUsageReactor', desc: 'App usage statistics' },
                    { badge: 'System', title: 'AdminGetSystemInfoReactor', desc: 'Server info (CPU, memory, disk, version)' },
                    { badge: 'LDAP/AD', title: 'AdminLoadLdapUsersReactor', desc: 'Sync users from LDAP/Active Directory' },
                    { badge: 'Security', title: 'AdminResetPasswordRulesReactor', desc: 'Configure password complexity rules' }
                ])}
                ${C.code(`// Example: Export all users (admin reactor call)
AdminExportAllUsersReactor();

// Example: Lock accounts based on inactivity
AdminLockAccountsReactor(
    thresholdDays=[90],
    excludeAdmins=[true]
);

// Example: Get system info
AdminGetSystemInfoReactor();

// Returns:
{
    "cpuCount": 8,
    "maxMemory": 16384,
    "usedMemory": 4096,
    "diskSpace": 512000,
    "semossVersion": "5.2.1",
    "javaVersion": "17.0.2"
}`, 'pixel', 'Admin reactor usage')}
            `
        },
        {
            id: "api-keys",
            title: "API Keys & Access Tokens",
            content: `
                <h2>API Keys & Programmatic Access</h2>
                <p>SEMOSS supports API keys for headless/programmatic access (e.g., scripts, CI/CD, integrations).</p>
                ${C.split(
                    {
                        title: 'Creating an API Key',
                        content: C.code(`// Create API key for a user
CreateAccessKey(
    userId=["user@example.com"],
    keyName=["ETL Pipeline Key"],
    expiresIn=[90]  // days
);

// Returns:
{
    "keyId": "ak_123abc",
    "accessKey": "sk_live_abcdef1234567890",
    "createdAt": "2026-02-18T10:00:00Z",
    "expiresAt": "2026-05-19T10:00:00Z"
}`, 'pixel')
                    },
                    {
                        title: 'Using an API Key',
                        content: C.code(`// HTTP request with API key
POST /api/engine/runPixel HTTP/1.1
Host: semoss.example.com
Authorization: Bearer sk_live_abcdef1234567890
Content-Type: application/json

{
    "insightId": "new",
    "expression": "Frame(\\"sales-db\\") | Select(revenue) | Sum();"
}`, 'http')
                    }
                )}
                ${C.callout('<strong>Security note:</strong> API keys have the same permissions as the user who created them. Store keys securely (environment variables, secrets managers) — never commit to source control.', 'warning')}
            `
        },
        {
            id: "best-practices",
            title: "Security Best Practices",
            content: `
                <h2>Security Best Practices</h2>
                ${C.table(
                    ['Practice', 'Implementation', 'Why It Matters'],
                    [
                        [
                            '<strong>Use SSO/OAuth</strong>',
                            'Configure AuthProvider (SAML, Okta, Microsoft) instead of NATIVE',
                            'Centralized identity management, MFA support, no password storage'
                        ],
                        [
                            '<strong>Principle of Least Privilege</strong>',
                            'Grant READ_ONLY by default, escalate to EDIT/OWNER only when needed',
                            'Minimize blast radius of compromised accounts'
                        ],
                        [
                            '<strong>Group-Based Permissions</strong>',
                            'Use LDAP/SAML groups instead of per-user permissions',
                            'Easier to manage at scale, aligns with organizational structure'
                        ],
                        [
                            '<strong>Rotate API Keys</strong>',
                            'Set expiration on API keys, rotate every 90 days',
                            'Limits exposure if keys are leaked'
                        ],
                        [
                            '<strong>Audit Logs</strong>',
                            'Enable logging (Log4j), monitor USER_LOGIN_ATTEMPTS table',
                            'Detect suspicious activity, meet compliance requirements'
                        ],
                        [
                            '<strong>Secure SMSS_USER DB</strong>',
                            'Use Postgres instead of H2, enable encryption, restrict network access',
                            'Protects sensitive user data and permissions'
                        ],
                        [
                            '<strong>Password Policies</strong>',
                            'Use AdminResetPasswordRulesReactor to enforce complexity',
                            'Reduces weak password risks (if using NATIVE auth)'
                        ],
                        [
                            '<strong>Chroot Isolation</strong>',
                            'Set chrootPath in User to sandbox file access',
                            'Prevents directory traversal attacks'
                        ]
                    ]
                )}
            `
        },
        {
            id: "security-handson",
            title: "Hands-on: Configure OAuth & Permissions",
            content: `
                <h2>Hands-on: Configure OAuth Authentication</h2>
                ${C.handson('Set up Microsoft OAuth and grant permissions', `
                    <h4>Scenario</h4>
                    <p>Enable Microsoft OAuth for your SEMOSS instance and configure app permissions for a team.</p>

                    <h4>Part 1: Configure Microsoft OAuth</h4>
                    <ol>
                        <li>Register an app in Azure AD:
                            <ul>
                                <li>Go to <strong>Azure Portal</strong> → <strong>App Registrations</strong> → <strong>New Registration</strong></li>
                                <li>Name: "SEMOSS Production"</li>
                                <li>Redirect URI: <code>https://your-semoss.com/callback/microsoft</code></li>
                                <li>Note the <code>Client ID</code> and <code>Client Secret</code></li>
                            </ul>
                        </li>
                        <li>Edit <code>social.properties</code> in SEMOSS config:
                            ${C.code(`# Microsoft OAuth
microsoft=true
ms_oauth_client_id=YOUR_CLIENT_ID
ms_oauth_client_secret=YOUR_CLIENT_SECRET
ms_oauth_redirect_uri=https://your-semoss.com/callback/microsoft
ms_oauth_scopes=openid,profile,email,User.Read`, 'properties', 'social.properties')}
                        </li>
                        <li>Restart SEMOSS server</li>
                        <li>Test: Go to login page → "Sign in with Microsoft" button should appear</li>
                    </ol>

                    <h4>Part 2: Create User Groups</h4>
                    <ol>
                        <li>In SEMOSS Admin Panel:
                            <ul>
                                <li>Navigate to <strong>Users & Groups</strong></li>
                                <li>Click <strong>New Group</strong></li>
                                <li>Name: "Data Analysts"</li>
                                <li>Type: "Local" (or sync from Azure AD groups)</li>
                            </ul>
                        </li>
                        <li>Add users to the group</li>
                    </ol>

                    <h4>Part 3: Grant App Permissions to Group</h4>
                    <ol>
                        <li>Open the app you want to share (e.g., "Sales Dashboard")</li>
                        <li>Click <strong>Settings</strong> → <strong>Permissions</strong></li>
                        <li>Click <strong>Add Group</strong></li>
                        <li>Select "Data Analysts" group</li>
                        <li>Choose permission: <strong>EDIT</strong></li>
                        <li>Save — all users in "Data Analysts" now have EDIT access</li>
                    </ol>

                    <h4>Part 4: Grant Engine (Database) Permissions</h4>
                    <ol>
                        <li>Navigate to <strong>Admin Panel</strong> → <strong>Engines</strong></li>
                        <li>Select your database (e.g., "sales-db")</li>
                        <li>Click <strong>Permissions</strong></li>
                        <li>Click <strong>Add Group</strong> → Select "Data Analysts" → Permission: <strong>READ_ONLY</strong></li>
                        <li>Save — group can now query the database (read-only)</li>
                    </ol>

                    <h4>Part 5: Test Access Control</h4>
                    <ol>
                        <li>Log in as a user in the "Data Analysts" group</li>
                        <li>Verify:
                            <ul>
                                <li>Can open "Sales Dashboard" app ✅</li>
                                <li>Can edit app blocks/cells ✅</li>
                                <li>Can query "sales-db" ✅</li>
                                <li>Cannot delete app ❌ (need OWNER)</li>
                                <li>Cannot modify database schema ❌ (READ_ONLY)</li>
                            </ul>
                        </li>
                    </ol>

                    <h4>Part 6: Create an API Key</h4>
                    <ol>
                        <li>In SEMOSS, navigate to <strong>Settings</strong> → <strong>API Keys</strong></li>
                        <li>Click <strong>Generate New Key</strong></li>
                        <li>Name: "ETL Pipeline"</li>
                        <li>Expires: 90 days</li>
                        <li>Copy the key: <code>sk_live_abc123...</code></li>
                        <li>Test with cURL:
                            ${C.code(`curl -X POST https://your-semoss.com/api/engine/runPixel \\
  -H "Authorization: Bearer sk_live_abc123..." \\
  -H "Content-Type: application/json" \\
  -d '{"insightId":"new","expression":"Echo(\\"Hello\\");"}'`, 'bash')}
                        </li>
                    </ol>

                    <h4>Expected Outcomes</h4>
                    <ul>
                        <li>Microsoft OAuth working — users can log in with Azure AD accounts</li>
                        <li>"Data Analysts" group has EDIT access to "Sales Dashboard"</li>
                        <li>"Data Analysts" group has READ_ONLY access to "sales-db"</li>
                        <li>Permission checks enforced — users cannot exceed granted permissions</li>
                        <li>API key works for programmatic access</li>
                    </ul>
                    ${C.callout('In production, always use <strong>Postgres</strong> for SMSS_USER database instead of H2, and enable <strong>SSL/TLS</strong> for all connections.', 'warning')}
                `)}
            `
        },
        {
            id: "security-summary",
            title: "Summary",
            content: `
                <h2>Summary: Security & Auth</h2>
                ${C.table(
                    ["Component", "Purpose", "Key Features"],
                    [
                        [
                            "AuthProvider",
                            "Authentication method",
                            "OAuth (Google, Microsoft, GitHub), SAML, LDAP, Native, CAC, API keys"
                        ],
                        [
                            "User",
                            "Authenticated user object",
                            "AccessTokens per provider, groups, timezone, R/Python processes"
                        ],
                        [
                            "AccessToken",
                            "Auth credentials + profile",
                            "OAuth tokens, email, groups, model limits, locked status"
                        ],
                        [
                            "AccessPermissionEnum",
                            "Permission levels",
                            "OWNER (1), EDIT (2), READ_ONLY (3)"
                        ],
                        [
                            "SMSS_USER",
                            "Security database",
                            "Users, groups, project/engine permissions, API keys, audit logs"
                        ],
                        [
                            "Security*Utils",
                            "Permission checks",
                            "SecurityProjectUtils, SecurityEngineUtils, SecurityUserUtils"
                        ],
                        [
                            "Groups",
                            "Role-based access control",
                            "LDAP/SAML sync, local groups, group permissions (highest wins)"
                        ],
                        [
                            "Admin Reactors",
                            "User/permission management",
                            "30+ reactors for export, import, lock accounts, usage analytics"
                        ],
                        [
                            "API Keys",
                            "Programmatic access",
                            "Bearer token authentication, expiration, same permissions as user"
                        ]
                    ]
                )}
                <h3>Key Takeaways</h3>
                <ul>
                    <li><strong>Pluggable authentication</strong> — supports OAuth, SAML, LDAP, Native, CAC, and custom providers</li>
                    <li><strong>3-tier permissions</strong> — OWNER, EDIT, READ_ONLY applied to Projects (apps) and Engines (databases/models)</li>
                    <li><strong>Group-based RBAC</strong> — assign permissions to groups, sync from LDAP/SAML/OAuth IDPs</li>
                    <li><strong>Security database</strong> — SMSS_USER stores users, permissions, groups, API keys, audit logs</li>
                    <li><strong>Server-side checks</strong> — all permission checks via Security*Utils before allowing operations</li>
                    <li><strong>API keys</strong> — programmatic access with Bearer token authentication, expiration support</li>
                    <li><strong>Admin reactors</strong> — 30+ reactors for bulk user management, permissions export/import, analytics</li>
                    <li><strong>Best practices</strong> — use SSO, least privilege, group permissions, rotate keys, audit logs</li>
                    <li><strong>OAuth token refresh</strong> — TokenFiller classes automatically refresh expired tokens</li>
                    <li><strong>Password policies</strong> — configurable complexity rules via AdminResetPasswordRulesReactor</li>
                    <li><strong>Chroot isolation</strong> — sandbox file access per user to prevent directory traversal</li>
                    <li><strong>Model usage limits</strong> — enforce maxTokens, maxResponseTime per user in AccessToken</li>
                </ul>
                ${C.callout('Security is not optional in production. Always enable SSO/OAuth, use Postgres for SMSS_USER, enable SSL/TLS, and follow principle of least privilege.', 'warning')}
            `
        }
    ];
