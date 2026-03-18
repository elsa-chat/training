// Topic: Capstone Project
const slides_capstone_project = [
        {
            id: "capstone-title",
            title: "Capstone Project",
            content: C.titleSlide(
                "Capstone Project",
                "Build an AI-powered sales analytics application from scratch",
                "120 minutes"
            )
        },
        {
            id: "capstone-overview",
            title: "Project Overview",
            content: `
                <h2>Capstone Project: AI Sales Analytics Platform</h2>
                <p class="lead">Build a complete ${CONFIG.productName} application that combines data ingestion, LLM-powered analysis, custom business logic, and interactive visualizations.</p>

                <h3>Project Requirements</h3>
                ${C.cards([
                    { badge: 'Day 1', title: 'Engines & Data', desc: 'Connect to sales database, configure LLM model engine, set up vector store for RAG' },
                    { badge: 'Day 2', title: 'Custom Logic', desc: 'Build custom reactor for forecasting, create Python script for anomaly detection' },
                    { badge: 'Day 3', title: 'AI Integration', desc: 'Create Room for conversational analytics, implement message chaining' },
                    { badge: 'Day 4', title: 'UI & Workflow', desc: 'Build multi-cell notebook for ETL, create dashboard with blocks, add visualizations' },
                    { badge: 'Day 5', title: 'Production', desc: 'Configure OAuth, set permissions, deploy with Docker, monitor usage' }
                ])}

                <h3>Scenario</h3>
                <p>You're tasked with building a sales analytics platform for Acme Corp. The platform must:</p>
                <ul>
                    <li>Import sales data from CSV and database sources</li>
                    <li>Detect anomalies and forecast trends using Python</li>
                    <li>Provide conversational analytics via LLM (e.g., "Show me top products in Q4")</li>
                    <li>Display interactive dashboards with filters and charts</li>
                    <li>Support role-based access (Sales team: READ_ONLY, Managers: EDIT, Admins: OWNER)</li>
                    <li>Run in production with monitoring and logging</li>
                </ul>

                ${C.callout(`This capstone integrates <strong>all major ${CONFIG.productName} concepts</strong> covered this week. Work through each phase sequentially.`, 'tip')}
            `
        },
        {
            id: "capstone-architecture",
            title: "Solution Architecture",
            content: `
                <h2>Solution Architecture</h2>
                <p>High-level architecture of the sales analytics platform.</p>
                ${C.layers([
                    { label: "Frontend", items: [
                        { title: "Dashboard App", desc: "Blocks: filters, charts, grids, KPIs" },
                        { title: "Playground Room", desc: "Conversational analytics" }
                    ]},
                    { label: "Application Layer", accent: true, items: [
                        { title: "Notebooks", desc: "ETL, forecasting, reporting", accent: true },
                        { title: "Custom Reactors", desc: "ForecastReactor, AnomalyDetector" },
                        { title: "Python GAAS", desc: "ML models, data science" }
                    ]},
                    { label: "Data & AI", items: [
                        { title: "Sales DB", desc: "Postgres: transactions, customers, products" },
                        { title: "Vector Store", desc: "Chroma: product embeddings" },
                        { title: "LLM Engine", desc: "GPT-4/Claude: conversational analytics" }
                    ]},
                    { label: "Security & Ops", items: [
                        { title: "OAuth", desc: "Microsoft SSO" },
                        { title: "RBAC", desc: "Sales/Manager/Admin groups" },
                        { title: "Docker", desc: "Containerized deployment" }
                    ]}
                ])}
            `
        },
        {
            id: "capstone-phase1",
            title: "Phase 1: Setup Engines",
            content: `
                <h2>Phase 1: Setup Engines & Data Sources</h2>
                ${C.handson('Configure engines and load data', `
                    <h4>Step 1: Create Sales Database Engine</h4>
                    <ol>
                        <li>Navigate to <strong>Admin Panel</strong> → <strong>Engines</strong> → <strong>New Engine</strong></li>
                        <li>Engine Type: <strong>Database (Postgres)</strong></li>
                        <li>Engine ID: <code>sales-db</code></li>
                        <li>Connection:
                            ${C.code("Host: localhost\nPort: 5432\nDatabase: acme_sales\nUsername: semoss_user\nPassword: [secure_password]", 'properties')}
                        </li>
                        <li>Test connection → Save</li>
                        <li>Load sample data:
                            ${C.code("-- Sample tables\nCREATE TABLE transactions (\n    id SERIAL PRIMARY KEY,\n    date DATE,\n    customer_id INT,\n    product_id INT,\n    quantity INT,\n    revenue DECIMAL(10,2),\n    region VARCHAR(50)\n);\n\nCREATE TABLE products (\n    id SERIAL PRIMARY KEY,\n    name VARCHAR(100),\n    category VARCHAR(50),\n    price DECIMAL(10,2)\n);\n\nCREATE TABLE customers (\n    id SERIAL PRIMARY KEY,\n    name VARCHAR(100),\n    segment VARCHAR(50),\n    region VARCHAR(50)\n);", 'sql')}
                        </li>
                    </ol>

                    <h4>Step 2: Configure LLM Model Engine</h4>
                    <ol>
                        <li>New Engine → <strong>Model (OpenAI / Anthropic)</strong></li>
                        <li>Engine ID: <code>gpt4-analytics</code></li>
                        <li>API Key: Set in environment or .smss properties</li>
                        <li>Model: <code>gpt-4-turbo</code> or <code>claude-3-opus</code></li>
                        <li>Test with simple prompt</li>
                    </ol>

                    <h4>Step 3: Create Vector Store (Optional for RAG)</h4>
                    <ol>
                        <li>New Engine → <strong>Vector (Chroma)</strong></li>
                        <li>Engine ID: <code>product-vectors</code></li>
                        <li>Collection: <code>product_descriptions</code></li>
                        <li>Embed product data:
                            ${C.code("// Pixel to embed products\nFrame(engine=[\"sales-db\"])\n    | Query(\"SELECT id, name, description FROM products\")\n    | EmbedData(\n        textColumn=[\"description\"],\n        vectorEngine=[\"product-vectors\"],\n        embeddingModel=[\"text-embedding-3-large\"]\n    );", 'pixel')}
                        </li>
                    </ol>
                `)}
            `
        },
        {
            id: "capstone-phase2",
            title: "Phase 2: Custom Business Logic",
            content: `
                <h2>Phase 2: Build Custom Reactors & Python Scripts</h2>
                ${C.handson('Implement forecasting and anomaly detection', `
                    <h4>Step 1: Create ForecastReactor (Java)</h4>
                    <ol>
                        <li>Create <code>src/prerna/reactor/custom/ForecastReactor.java</code>:
                            ${C.code(`package prerna.reactor.custom;

import prerna.reactor.AbstractReactor;
import prerna.sablecc2.om.PixelDataType;
import prerna.sablecc2.om.nounmeta.NounMetadata;
import prerna.algorithm.api.ITableDataFrame;

public class ForecastReactor extends AbstractReactor {

    public ForecastReactor() {
        this.keysToGet = new String[] { "frame", "metric", "periods" };
        this.keyRequired = new int[] { 1, 1, 1 };
    }

    @Override
    public NounMetadata execute() {
        organizeKeys();

        String frameName = keyValue.get("frame");
        String metric = keyValue.get("metric");
        int periods = Integer.parseInt(keyValue.get("periods"));

        // Get frame from VarStore
        ITableDataFrame frame = getFrame(frameName);

        // Simple linear regression forecast (simplified)
        // In production, use Prophet, ARIMA, etc.
        List<Map<String, Object>> forecast = performForecast(frame, metric, periods);

        return new NounMetadata(forecast, PixelDataType.VECTOR);
    }

    private List<Map<String, Object>> performForecast(
        ITableDataFrame frame, String metric, int periods
    ) {
        // Implement forecasting logic
        // For demo: linear trend extrapolation
        // ...
        return forecastedData;
    }
}`, 'java', 'Custom ForecastReactor')}
                        </li>
                        <li>Register reactor in DIHelper</li>
                        <li>Rebuild ${CONFIG.productName}</li>
                    </ol>

                    <h4>Step 2: Create Python Anomaly Detection Script</h4>
                    <ol>
                        <li>Create <code>py/custom/anomaly_detection.py</code>:
                            ${C.code(`import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

def detect_anomalies(data, contamination=0.1):
    """
    Detect anomalies in sales data using Isolation Forest

    Args:
        data: DataFrame with 'date', 'revenue' columns
        contamination: Expected proportion of outliers

    Returns:
        DataFrame with 'is_anomaly' column added
    """
    # Extract features
    df = pd.DataFrame(data)
    features = df[['revenue']].values

    # Train Isolation Forest
    model = IsolationForest(contamination=contamination, random_state=42)
    predictions = model.fit_predict(features)

    # -1 = anomaly, 1 = normal
    df['is_anomaly'] = (predictions == -1)
    df['anomaly_score'] = model.score_samples(features)

    return df.to_dict('records')

# Make available to ${CONFIG.productName}
__all__ = ['detect_anomalies']`, 'python', 'py/custom/anomaly_detection.py')}
                        </li>
                        <li>Call from Pixel:
                            ${C.code("// Call Python function\nPy(\"<encode>\nimport sys\nsys.path.append('py/custom')\nfrom anomaly_detection import detect_anomalies\n\n# Get data from frame\nsales_data = <salesFrame>.to_dict('records')\nresult = detect_anomalies(sales_data, contamination=0.05)\n\n# Return to ${CONFIG.productName}\nresult\n</encode>\") | As(frame=[\"anomaliesFrame\"]);", 'pixel')}
                        </li>
                    </ol>
                `)}
            `
        },
        {
            id: "capstone-phase3",
            title: "Phase 3: Conversational Analytics",
            content: `
                <h2>Phase 3: Create Room for Conversational Analytics</h2>
                ${C.handson('Set up LLM-powered natural language queries', `
                    <h4>Step 1: Create a Workspace</h4>
                    <ol>
                        <li>Navigate to <strong>Playground</strong> → <strong>Workspaces</strong></li>
                        <li>New Workspace: "Sales Analytics AI"</li>
                        <li>System Prompt:
                            ${C.code("You are a sales analytics assistant for Acme Corp. You have access to:\n- sales-db: Postgres database with transactions, products, customers\n- product-vectors: Vector store with product embeddings\n\nWhen users ask questions about sales data:\n1. Use SQL queries via QueryDatabase tool to fetch data\n2. Analyze trends, calculate metrics, identify patterns\n3. Provide clear, actionable insights\n4. Format numbers as currency when appropriate\n\nAlways cite your data sources.", 'markdown')}
                        </li>
                        <li>Add Resources:
                            <ul>
                                <li>Database: <code>sales-db</code></li>
                                <li>Vector Store: <code>product-vectors</code></li>
                                <li>Model: <code>gpt4-analytics</code></li>
                            </ul>
                        </li>
                    </ol>

                    <h4>Step 2: Create a Room</h4>
                    <ol>
                        <li>New Room → Name: "Q4 Sales Analysis"</li>
                        <li>Attach Workspace: "Sales Analytics AI"</li>
                        <li>Test queries:
                            <ul>
                                <li>"What were total sales in Q4 2025?"</li>
                                <li>"Show me top 10 products by revenue"</li>
                                <li>"Which region has the highest growth?"</li>
                                <li>"Find similar products to 'Laptop Pro'"</li>
                            </ul>
                        </li>
                        <li>Verify LLM uses QueryDatabase tool correctly</li>
                    </ol>

                    <h4>Step 3: Integrate Room with App (Optional)</h4>
                    <ol>
                        <li>In your dashboard app, add a block to trigger Room queries:
                            ${C.code("// Button block to ask LLM\n{\n    \"widget\": \"button\",\n    \"data\": { \"label\": \"Ask AI\" },\n    \"listeners\": {\n        \"onClick\": {\n            \"order\": [{\n                \"action\": \"RunPixel\",\n                \"pixel\": \"RunRoomPixel(roomId=[\\\\\"q4-analysis\\\\\"], message=[<userQuestion>]);\"\n            }]\n        }\n    }\n}", 'json')}
                        </li>
                        <li>Display response in Text block bound to <code>{{ aiResponse }}</code></li>
                    </ol>
                `)}
            `
        },
        {
            id: "capstone-phase4",
            title: "Phase 4: Build Notebook & Dashboard",
            content: `
                <h2>Phase 4: Create Data Workflow & UI</h2>
                ${C.handson('Build notebook and interactive dashboard', `
                    <h4>Step 1: Create ETL Notebook</h4>
                    <ol>
                        <li>New Notebook: "Sales ETL Pipeline"</li>
                        <li><strong>Cell 1</strong> — Import Data:
                            ${C.code("// Query sales data\nFrame(engine=[\"sales-db\"])\n    | Query(\"\n        SELECT t.*, p.name as product_name, p.category, c.segment\n        FROM transactions t\n        JOIN products p ON t.product_id = p.id\n        JOIN customers c ON t.customer_id = c.id\n        WHERE t.date >= '2025-01-01'\n    \")\n    | As(frame=[\"salesFrame\"]);", 'pixel')}
                        </li>
                        <li><strong>Cell 2</strong> — Calculate KPIs:
                            ${C.code("// Total revenue\ntotalRevenue = <salesFrame> | Select(revenue) | Sum();\n\n// Average order value\navgOrderValue = <salesFrame> | Select(revenue) | Average();\n\n// Unique customers\nuniqueCustomers = <salesFrame> | Select(customer_id) | Unique() | Count();\n\n// Top product\ntopProduct = <salesFrame>\n    | GroupBy(product_name)\n    | Aggregate(revenue, SUM)\n    | Sort(revenue, DESC)\n    | Limit(1)\n    | Select(product_name);", 'pixel')}
                        </li>
                        <li><strong>Cell 3</strong> — Detect Anomalies (Python):
                            ${C.code("// Call Python anomaly detection\nPy(\"<encode>\nfrom anomaly_detection import detect_anomalies\nsales_data = <salesFrame>[['date', 'revenue']].to_dict('records')\nanomalies = detect_anomalies(sales_data)\nanomalies\n</encode>\") | As(frame=[\"anomaliesFrame\"]);", 'pixel')}
                        </li>
                        <li><strong>Cell 4</strong> — Forecast (Custom Reactor):
                            ${C.code("// Run forecast\nForecast(frame=[\"salesFrame\"], metric=[\"revenue\"], periods=[30])\n    | As(frame=[\"forecastFrame\"]);", 'pixel')}
                        </li>
                        <li><strong>Cell 5</strong> — Create Visualization:
                            ${C.code("// Time series chart with anomalies\nFrame(frame=[\"salesFrame\"])\n    | Select(date, revenue)\n    | Panel(0)\n    | AddPanelOrnaments(panel=[\"0\"], layout=[\"LineChart\"])\n    | SetPanelView(panel=[\"0\"], view=[\"visualization\"])\n    | Visualize();\n\n// Add anomaly markers\nFrame(frame=[\"anomaliesFrame\"])\n    | Filter(is_anomaly, ==, true)\n    | Panel(1)\n    | AddPanelOrnaments(panel=[\"1\"], layout=[\"ScatterChart\"])\n    | LayerPanel(panel=[\"1\"], basePanel=[\"0\"])\n    | Visualize();", 'pixel')}
                        </li>
                    </ol>

                    <h4>Step 2: Build Dashboard UI</h4>
                    <ol>
                        <li>New App: "Sales Analytics Dashboard"</li>
                        <li><strong>Add Filters</strong> (top of page):
                            <ul>
                                <li>Select Block: Region filter → <code>{{ selectedRegion }}</code></li>
                                <li>Date Range Picker → <code>{{ startDate }}, {{ endDate }}</code></li>
                                <li>Button: "Refresh" → onClick: RunQuery("Sales ETL Pipeline")</li>
                            </ul>
                        </li>
                        <li><strong>Add KPI Cards</strong>:
                            ${C.code(`<Container layout="grid" columns={4}>
    <Card>
        <Text>Total Revenue</Text>
        <Text style="fontSize:32px">\${{ totalRevenue }}</Text>
    </Card>
    <Card>
        <Text>Avg Order Value</Text>
        <Text style="fontSize:32px">\${{ avgOrderValue }}</Text>
    </Card>
    <Card>
        <Text>Customers</Text>
        <Text style="fontSize:32px">{{ uniqueCustomers }}</Text>
    </Card>
    <Card>
        <Text>Top Product</Text>
        <Text style="fontSize:32px">{{ topProduct }}</Text>
    </Card>
</Container>`, 'jsx', 'KPI cards (pseudo-code)')}
                        </li>
                        <li><strong>Add Charts</strong>:
                            <ul>
                                <li>VegaVisualization Block → Panel ID: <code>0</code> (time series)</li>
                                <li>VegaVisualization Block → Panel ID: <code>1</code> (anomalies overlay)</li>
                            </ul>
                        </li>
                        <li><strong>Add Data Grid</strong>:
                            <ul>
                                <li>GridDynamicFrame Block → Frame: <code>{{ salesFrame }}</code></li>
                                <li>Enable sorting, filtering, export</li>
                            </ul>
                        </li>
                    </ol>

                    <h4>Step 3: Wire Up Interactivity</h4>
                    <ol>
                        <li>Region Select onChange:
                            <ul>
                                <li>ModifyVariable: <code>selectedRegion</code></li>
                                <li>RunCell: "Cell 1" (re-query with filter)</li>
                            </ul>
                        </li>
                        <li>Refresh Button onClick:
                            <ul>
                                <li>RunQuery: "Sales ETL Pipeline"</li>
                            </ul>
                        </li>
                        <li>Test: Change region → observe KPIs/charts update</li>
                    </ol>
                `)}
            `
        },
        {
            id: "capstone-phase5",
            title: "Phase 5: Security & Deployment",
            content: `
                <h2>Phase 5: Configure Security & Deploy</h2>
                ${C.handson('Set up authentication and deploy to production', `
                    <h4>Step 1: Configure OAuth (Microsoft)</h4>
                    <ol>
                        <li>Edit <code>social.properties</code>:
                            ${C.code("microsoft=true\nms_oauth_client_id=YOUR_CLIENT_ID\nms_oauth_client_secret=YOUR_SECRET\nms_oauth_redirect_uri=https://analytics.acmecorp.com/callback/microsoft", 'properties')}
                        </li>
                        <li>Restart ${CONFIG.productName}</li>
                        <li>Test login with Microsoft account</li>
                    </ol>

                    <h4>Step 2: Create User Groups & Permissions</h4>
                    <ol>
                        <li>Admin Panel → Users & Groups → New Group:
                            <ul>
                                <li>"Sales Team" (READ_ONLY)</li>
                                <li>"Sales Managers" (EDIT)</li>
                                <li>"Sales Admins" (OWNER)</li>
                            </ul>
                        </li>
                        <li>Assign App Permissions:
                            <ul>
                                <li>Sales Analytics Dashboard → Sales Team: READ_ONLY</li>
                                <li>Sales Analytics Dashboard → Sales Managers: EDIT</li>
                                <li>Sales Analytics Dashboard → Sales Admins: OWNER</li>
                            </ul>
                        </li>
                        <li>Assign Engine Permissions:
                            <ul>
                                <li>sales-db → Sales Team: READ_ONLY</li>
                                <li>sales-db → Sales Managers: READ_ONLY</li>
                                <li>sales-db → Sales Admins: EDIT</li>
                            </ul>
                        </li>
                    </ol>

                    <h4>Step 3: Deploy with Docker</h4>
                    <ol>
                        <li>Create <code>Dockerfile</code>:
                            ${C.code("FROM semoss/semoss:5.2.1\n\n# Copy custom reactors\nCOPY src/prerna/reactor/custom/ /opt/semoss/Semoss/src/prerna/reactor/custom/\n\n# Copy Python scripts\nCOPY py/custom/ /opt/semoss/py/custom/\n\n# Copy configuration\nCOPY social.properties /opt/semoss/Semoss/\nCOPY RDF_Map.prop /opt/semoss/Semoss/\n\n# Expose ports\nEXPOSE 8080\n\nCMD [\"./start.sh\"]", 'dockerfile')}
                        </li>
                        <li>Create <code>docker-compose.yml</code>:
                            ${C.code("version: '3.8'\nservices:\n  semoss:\n    build: .\n    ports:\n      - \"8080:8080\"\n    environment:\n      - JAVA_OPTS=-Xmx8g\n      - DB_HOST=postgres\n      - DB_PORT=5432\n    volumes:\n      - ./data:/opt/semoss/data\n      - ./logs:/opt/semoss/logs\n    depends_on:\n      - postgres\n\n  postgres:\n    image: postgres:15\n    environment:\n      POSTGRES_DB: acme_sales\n      POSTGRES_USER: semoss_user\n      POSTGRES_PASSWORD: secure_password\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n    ports:\n      - \"5432:5432\"\n\nvolumes:\n  postgres_data:", 'yaml')}
                        </li>
                        <li>Build and run:
                            ${C.code("docker-compose build\ndocker-compose up -d\ndocker-compose logs -f semoss", 'bash')}
                        </li>
                    </ol>

                    <h4>Step 4: Enable Monitoring</h4>
                    <ol>
                        <li>Configure Log4j for application logging</li>
                        <li>Set up usage tracking:
                            ${C.code("// Enable usage analytics in settings\nAdminGetEngineUsagePerUserReactor();\nAdminGetProjectUsageReactor(projectId=[\"sales-analytics-dashboard\"]);", 'pixel')}
                        </li>
                        <li>Monitor system resources:
                            ${C.code("AdminGetSystemInfoReactor();", 'pixel')}
                        </li>
                    </ol>
                `)}
            `
        },
        {
            id: "capstone-demo",
            title: "Demo & Testing",
            content: `
                <h2>Demo & Testing Checklist</h2>
                <p>Verify all components are working correctly before presenting to stakeholders.</p>

                <h3>✅ Data Layer</h3>
                ${C.table(
                    ['Component', 'Test', 'Expected Result'],
                    [
                        ['Sales DB', 'Query transactions table', 'Returns 1000+ rows'],
                        ['LLM Engine', 'Send test prompt', 'Response received within 5s'],
                        ['Vector Store', 'Search for "laptop"', 'Returns top 5 similar products']
                    ]
                )}

                <h3>✅ Business Logic</h3>
                ${C.table(
                    ['Component', 'Test', 'Expected Result'],
                    [
                        ['ForecastReactor', 'Forecast(frame, metric, 30)', 'Returns 30-day forecast array'],
                        ['Anomaly Detection', 'Python script with test data', 'Identifies 2-3 anomalies'],
                        ['ETL Notebook', 'Run all cells', 'All cells complete without errors']
                    ]
                )}

                <h3>✅ User Interface</h3>
                ${C.table(
                    ['Component', 'Test', 'Expected Result'],
                    [
                        ['KPI Cards', 'Refresh dashboard', 'KPIs update with correct values'],
                        ['Charts', 'Change region filter', 'Charts re-render with filtered data'],
                        ['Data Grid', 'Sort by revenue', 'Grid sorts correctly'],
                        ['AI Chat', 'Ask "Top products?"', 'LLM queries DB and responds']
                    ]
                )}

                <h3>✅ Security</h3>
                ${C.table(
                    ['Component', 'Test', 'Expected Result'],
                    [
                        ['OAuth Login', 'Sign in with Microsoft', 'Successfully authenticated'],
                        ['Permissions', 'Login as Sales Team user', 'Can view, cannot edit'],
                        ['Permissions', 'Login as Manager', 'Can edit, cannot delete'],
                        ['API Key', 'curl with Bearer token', 'Request succeeds']
                    ]
                )}

                <h3>✅ Deployment</h3>
                ${C.table(
                    ['Component', 'Test', 'Expected Result'],
                    [
                        ['Docker', 'docker-compose up', 'All containers healthy'],
                        ['Health Check', 'curl /api/health', 'HTTP 200 OK'],
                        ['Logs', 'Check logs', 'No errors, all reactors loaded'],
                        ['Performance', 'Load test 100 requests', 'Avg response time < 1s']
                    ]
                )}
            `
        },
        {
            id: "capstone-extensions",
            title: "Optional Extensions",
            content: `
                <h2>Optional Extensions & Next Steps</h2>
                <p>Additional features to enhance the sales analytics platform.</p>

                ${C.cards([
                    { badge: 'Extension', title: 'Automated Reports', desc: 'Schedule notebook execution daily, email PDF reports to stakeholders via SendEmailReactor' },
                    { badge: 'Extension', title: 'Real-Time Alerts', desc: 'Monitor anomaly detection, send Slack/email alerts when anomalies detected' },
                    { badge: 'Extension', title: 'Mobile App', desc: 'Build responsive mobile view with smaller widgets, touch-optimized charts' },
                    { badge: 'Extension', title: 'Multi-Tenancy', desc: 'Isolate data by tenant, use row-level security in Postgres' },
                    { badge: 'Extension', title: 'Advanced ML', desc: 'Integrate Prophet for forecasting, AutoML for churn prediction' },
                    { badge: 'Extension', title: 'Data Catalog', desc: 'Document all tables/columns, add metadata, enable data discovery' },
                    { badge: 'Extension', title: 'Audit Trail', desc: 'Log all queries, track who accessed what data, meet compliance requirements' },
                    { badge: 'Extension', title: 'A/B Testing', desc: 'Experiment with different forecasting models, measure accuracy' }
                ])}

                <h3>Production Hardening</h3>
                <ul>
                    <li><strong>High Availability:</strong> Run multiple ${CONFIG.productName} instances behind load balancer</li>
                    <li><strong>Database Backups:</strong> Automated Postgres backups to S3, point-in-time recovery</li>
                    <li><strong>Monitoring:</strong> Prometheus + Grafana for metrics, alerting on errors/latency</li>
                    <li><strong>SSL/TLS:</strong> Configure HTTPS, enforce TLS 1.2+</li>
                    <li><strong>Rate Limiting:</strong> Protect API endpoints from abuse</li>
                    <li><strong>Secrets Management:</strong> Use Vault or AWS Secrets Manager for credentials</li>
                    <li><strong>CI/CD:</strong> GitHub Actions pipeline for automated testing and deployment</li>
                </ul>
            `
        },
        {
            id: "capstone-summary",
            title: "Capstone Summary",
            content: `
                <h2>Capstone Project Summary</h2>
                <p class="lead">Congratulations! You've built a production-ready AI-powered sales analytics platform using ${CONFIG.productName}.</p>

                <h3>What You Built</h3>
                ${C.table(
                    ['Component', 'Technologies Used', 'Key Learnings'],
                    [
                        [
                            '<strong>Data Layer</strong>',
                            'Postgres, Chroma Vector Store, GPT-4',
                            'Engine configuration, connection management, SQL queries'
                        ],
                        [
                            '<strong>Business Logic</strong>',
                            'Custom Java Reactor, Python GAAS, Isolation Forest',
                            `Extending ${CONFIG.productName}, integrating ML models, reactor development`
                        ],
                        [
                            '<strong>AI Integration</strong>',
                            'Playground Rooms, Workspaces, MCP tools',
                            'Conversational analytics, prompt engineering, tool calling'
                        ],
                        [
                            '<strong>User Interface</strong>',
                            'Blocks (40+ types), Cells, Notebooks, StateStore',
                            'Reactive UI, event handling, state management, data binding'
                        ],
                        [
                            '<strong>Security</strong>',
                            'Microsoft OAuth, RBAC, SMSS_USER database',
                            'SSO configuration, permission management, access control'
                        ],
                        [
                            '<strong>Deployment</strong>',
                            'Docker, docker-compose, Postgres container',
                            'Containerization, orchestration, production deployment'
                        ]
                    ]
                )}

                <h3>Skills Mastered</h3>
                <ul>
                    <li><strong>Platform Architecture</strong> — Understanding ${CONFIG.productName} layers (engines, reactors, UI)</li>
                    <li><strong>Data Engineering</strong> — ETL pipelines, data transformation, notebook workflows</li>
                    <li><strong>AI/ML Integration</strong> — LLM tool calling, vector search, anomaly detection, forecasting</li>
                    <li><strong>Full-Stack Development</strong> — Backend reactors, frontend blocks, state management</li>
                    <li><strong>Security & Governance</strong> — Authentication, authorization, audit logging</li>
                    <li><strong>DevOps</strong> — Docker deployment, monitoring, production best practices</li>
                </ul>

                <h3>Key Takeaways</h3>
                ${C.callout(`<strong>${CONFIG.productName} is a platform, not just a tool.</strong> It provides the building blocks (engines, reactors, blocks, cells) to create sophisticated data applications without writing thousands of lines of code. The key is understanding how components fit together.`, 'tip')}

                <p><strong>Think in layers:</strong></p>
                <ul>
                    <li>Data layer (engines) provides connectivity</li>
                    <li>Logic layer (reactors, Pixel, Python) transforms data</li>
                    <li>Presentation layer (blocks, cells) displays results</li>
                    <li>Security layer (OAuth, permissions) controls access</li>
                </ul>

                <p><strong>Leverage existing components:</strong> ${CONFIG.productName} ships with hundreds of reactors and 40+ block types. Always check if a component exists before building custom.</p>

                <p><strong>Prototype fast, refine later:</strong> Use notebooks for rapid prototyping, then convert to custom reactors for production performance.</p>

                <h3>Next Steps</h3>
                <ol>
                    <li>Deploy your capstone project to a production environment</li>
                    <li>Gather user feedback and iterate</li>
                    <li>Explore advanced features (MCP servers, custom engines, R integration)</li>
                    <li>Join the ${CONFIG.productName} community, contribute reactors/blocks</li>
                    <li>Build more applications — ${CONFIG.productName} scales from prototypes to enterprise</li>
                </ol>

                ${C.callout(`<strong>Thank you for completing ${CONFIG.productName} Training!</strong> You now have the skills to build production AI applications. Keep building, keep learning.`, 'tip')}
            `
        }
    ];
