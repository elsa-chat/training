// Topic: Security & RBAC
const slides_security_auth = [
    {
        id: "security-title",
        title: "Security & RBAC",
        content: C.titleSlide(
            "Security & RBAC",
            "Who can access what, and how to control it",
            "30 minutes"
        )
    },
    {
        id: "security-physical-vs-logical",
        title: "Physical vs Logical Security",
        content: `
            <h2>Two Layers of Security  -  Only One Is Yours to Manage</h2>
            ${C.split(
                {
                    title: "Physical (Infrastructure)",
                    content: `
                        <ul>
                            <li>Network configuration and firewalls</li>
                            <li>Server hosting and OS hardening</li>
                            <li>Data center and cloud environment</li>
                            <li>TLS/SSL certificates</li>
                        </ul>
                        <p><em>Managed by your ${CONFIG.productName} admin. Not covered today.</em></p>
                    `
                },
                {
                    title: "Logical (RBAC inside ${CONFIG.productName})",
                    content: `
                        <ul>
                            <li>Who can see which engines and apps</li>
                            <li>Who can edit vs. only view</li>
                            <li>Who can delete or manage permissions</li>
                            <li>Group memberships and inherited access</li>
                        </ul>
                        <p><em>This is what you work with day to day.</em></p>
                    `
                }
            )}
            ${C.callout('Everything in this section is about the Logical layer  -  the controls you work with day to day.', 'info')}
        `
    },
    {
        id: "security-permission-levels",
        title: "Permission Levels",
        content: `
            <h2>Permission Levels  -  What Each One Means</h2>
            ${C.table(
                ['Level', 'Can Do', 'Cannot Do'],
                [
                    ['<strong>Owner</strong>', 'Create, edit, delete, manage permissions  -  full control', 'N/A  -  full control'],
                    ['<strong>Edit</strong>', 'Use and modify engines and apps', 'Cannot delete or change who has access'],
                    ['<strong>Read-Only</strong>', 'View and use', 'Cannot modify anything']
                ]
            )}
            <h3>Permissions Apply Per Resource  -  Not Globally</h3>
            ${C.table(
                ['Resource Type', 'Permissions Are Set Independently'],
                [
                    ['Engines (models, databases, vector stores)', 'Owner / Edit / Read-Only  -  set per engine'],
                    ['Apps', 'Owner / Edit / Read-Only  -  set per app']
                ]
            )}
            ${C.callout('You can be Owner of an engine but Read-Only on an app. Permissions are per resource, not global.', 'info')}
        `
    },
    {
        id: "security-groups",
        title: "Groups",
        content: `
            <h2>Groups  -  Team-Based Access Control</h2>
            <p>Instead of assigning permissions to each person individually, you assign them to a group. Everyone in the group inherits those permissions automatically.</p>
            ${C.flow([
                { title: 'Create a Group', desc: 'e.g., "FDA-DevTeam"' },
                { title: 'Add Users to the Group', desc: 'Any user can belong to multiple groups', arrow: '↓' },
                { title: 'Assign Group Permissions to an Engine or App', desc: 'e.g., Edit on the shared model engine', arrow: '↓' },
                { title: 'All Group Members Inherit Those Permissions', desc: 'New users added to the group get access immediately' }
            ])}
            ${C.callout('Use groups for team-based access. "FDA-DevTeam" with Edit on shared engines is easier to manage than individual assignments.', 'tip')}
        `
    },
    {
        id: "security-guardrails",
        title: "Guardrails",
        content: `
            <h2>Guardrails  -  Safety Checks on Every Model Call</h2>
            <p>Guardrails sit between user input and the model. They run automatically on every call  -  you configure them once in <code>pipeline.json</code> and they apply to all requests to that engine.</p>
            ${C.cards([
                {
                    badge: 'Guardrail',
                    title: 'PII Detection (GLiNER)',
                    desc: 'Classifies and flags personally identifiable information in prompts or responses before they reach the model or the user.'
                },
                {
                    badge: 'Guardrail',
                    title: 'Toxicity Detection (Detoxify)',
                    desc: 'Blocks harmful or inappropriate content from passing through the pipeline in either direction.'
                },
                {
                    badge: 'Guardrail',
                    title: 'Prompt Injection Detection',
                    desc: 'Catches attempts to override the model\'s instructions  -  e.g., "Ignore all previous instructions and..."'
                }
            ])}
            <h3>How You Attach a Guardrail</h3>
            ${C.code(`{
  "pipelines": {
    "askRoom": {
      "input": [{
        "reactorClass": "prerna.reactor.interceptor.GenericGuardrailInputReactor",
        "params": {
          "blockOnGuardrailFailure": true,
          "guardrailEngineId": "<guardrail-engine-id>"
        }
      }]
    }
  }
}`, 'json', 'pipeline.json  -  attached to a model engine')}
            ${C.callout('Guardrails sit between the user input and the model. You attach them to a model engine via pipeline.json  -  they run on every call.', 'info')}
        `
    },
    {
        id: "security-audit-logs",
        title: "Audit Logs",
        content: `
            <h2>Audit Logs  -  Who Did What and When</h2>
            <p>Every significant action in ${CONFIG.productName} is logged. The audit log captures enough context to answer compliance questions and diagnose access issues.</p>
            ${C.table(
                ['User', 'Action', 'Resource', 'Timestamp', 'IP Address'],
                [
                    ['user@fda.gov', 'Granted Edit permission', 'Model engine: GPT-4', '2026-05-10 09:14:22', '10.0.1.55'],
                    ['analyst@fda.gov', 'Viewed app', 'Regulatory Q&A App', '2026-05-10 09:31:07', '10.0.1.62'],
                    ['admin@fda.gov', 'Deleted engine', 'Test vector store', '2026-05-10 10:02:45', '10.0.1.11']
                ]
            )}
            ${C.callout('Useful for compliance reviews and troubleshooting. "Why can\'t this user see that engine?"  -  audit logs usually have the answer.', 'tip')}
            <p><em>[Presenter will open the audit log UI to show a live example]</em></p>
        `
    }
];
