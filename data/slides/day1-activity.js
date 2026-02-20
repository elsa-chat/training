// Topic: Day 1 Activity — Pro-Code App Build
const slides_day1_activity = [
        {
            id: "custom-reactors-handson",
            title: "Hands-on: Build a Reactor",
            content: `
                <h2>Hands-on: Build a Custom Reactor</h2>
                ${C.handson('Create a Temperature Converter Reactor', `
                    <h4>Goal</h4>
                    <p>Create a reactor that converts temperatures between Celsius, Fahrenheit, and Kelvin.</p>

                    <h4>Step 1: Create the Reactor Class</h4>
                    <p>Create <code>src/prerna/reactor/custom/TemperatureConverterReactor.java</code></p>
                    ${C.code(`package prerna.reactor.custom;

import prerna.reactor.AbstractReactor;
import prerna.sablecc2.om.PixelDataType;
import prerna.sablecc2.om.nounmeta.NounMetadata;

public class TemperatureConverterReactor extends AbstractReactor {

    public TemperatureConverterReactor() {
        this.keysToGet = new String[] { "temperature", "from", "to" };
        this.keyRequired = new int[] { 1, 1, 1 };
    }

    @Override
    public NounMetadata execute() {
        organizeKeys();

        Double temp = getDouble("temperature");
        String from = keyValue.get("from").toLowerCase();
        String to = keyValue.get("to").toLowerCase();

        // Convert to Celsius first (normalize)
        Double celsius = toCelsius(temp, from);

        // Convert from Celsius to target
        Double result = fromCelsius(celsius, to);

        return new NounMetadata(result, PixelDataType.CONST_DECIMAL);
    }

    private Double toCelsius(Double temp, String unit) {
        return switch(unit) {
            case "c", "celsius" -> temp;
            case "f", "fahrenheit" -> (temp - 32) * 5/9;
            case "k", "kelvin" -> temp - 273.15;
            default -> throw new IllegalArgumentException("Unknown unit: " + unit);
        };
    }

    private Double fromCelsius(Double celsius, String unit) {
        return switch(unit) {
            case "c", "celsius" -> celsius;
            case "f", "fahrenheit" -> (celsius * 9/5) + 32;
            case "k", "kelvin" -> celsius + 273.15;
            default -> throw new IllegalArgumentException("Unknown unit: " + unit);
        };
    }

    @Override
    public String getReactorDescription() {
        return "Converts temperature between Celsius, Fahrenheit, and Kelvin";
    }
}`, 'java')}

                    <h4>Step 2: Compile</h4>
                    ${C.code(`cd /path/to/Semoss
mvn clean install -DskipTests`, 'bash')}

                    <h4>Step 3: Deploy & Restart</h4>
                    <p>Copy the compiled JAR to Tomcat and restart the server.</p>

                    <h4>Step 4: Test in Pixel</h4>
                    ${C.code(`// Convert 100°C to Fahrenheit
TemperatureConverter(temperature=100, from="c", to="f");
// Returns: 212.0

// Convert 32°F to Celsius
TemperatureConverter(temperature=32, from="f", to="c");
// Returns: 0.0

// Convert 273.15K to Celsius
TemperatureConverter(temperature=273.15, from="k", to="c");
// Returns: 0.0`, 'pixel')}
                `)}
            `
        },
        {
            id: "python-handson",
            title: "Hands-on: Python Integration",
            content: `
                <h2>Hands-on: Custom Python Functions</h2>
                ${C.handson('Build a Python MCP Tool', `
                    <h4>Step 1: Create Python Module</h4>
                    <p>In your app's <code>assets/py/</code> folder, create <code>mcp_driver.py</code>:</p>
                    ${C.code(`# assets/py/mcp_driver.py
def calculate_stats(numbers: list) -> dict:
    """Calculate statistics for a list of numbers."""
    import statistics

    return {
        'mean': statistics.mean(numbers),
        'median': statistics.median(numbers),
        'stdev': statistics.stdev(numbers) if len(numbers) > 1 else 0,
        'min': min(numbers),
        'max': max(numbers),
    }

def fetch_data_from_api(url: str) -> dict:
    """Fetch JSON data from an API."""
    import requests
    response = requests.get(url)
    return response.json()`, 'python')}

                    <h4>Step 2: Load the Module in ${CONFIG.productName}</h4>
                    ${C.code(`// Load the Python file
LoadPyFromFileProjectPy(
    space="<your-app-project-id>",
    filePath="mcp_driver.py"
);

// Call a function
result = Py("<encode>calculate_stats([1, 2, 3, 4, 5])</encode>");
result;`, 'pixel')}

                    <h4>Step 3: Generate MCP Manifest</h4>
                    ${C.code(`// Generate MCP tool definition
MakePythonMCP("<your-app-project-id>");

// Output: assets/mcp/py_mcp.json`, 'pixel')}

                    <h4>Step 4: Use from Python Console</h4>
                    <p>Open the Python console in ${CONFIG.productName} and run:</p>
                    ${C.code(`>>> import mcp_driver
>>> stats = mcp_driver.calculate_stats([10, 20, 30, 40, 50])
>>> print(stats)
{'mean': 30.0, 'median': 30.0, 'stdev': 15.8..., 'min': 10, 'max': 50}`, 'python')}

                    <h4>Step 5: Call Java from Python</h4>
                    ${C.code(`# Add to mcp_driver.py
import gaas_server_proxy as gsp
import uuid

def query_database(engine_id: str, table: str, insight_id: str = None):
    """Query a database from Python."""
    sql = f"SELECT * FROM {table} LIMIT 10"
    epoc = str(uuid.uuid4())
    result = gsp.callEngine(
        epoc=epoc,
        engine_type="DATABASE",
        engine_id=engine_id,
        method_name="query",
        method_args=[sql],
        method_arg_types=["java.lang.String"],
        insight_id=insight_id
    )
    return result

# In console:
>>> data = mcp_driver.query_database("my_db", "users")
>>> print(len(data))
10`, 'python')}
                `)}
            `
        },
        {
            id: "procode-handson",
            title: "Hands-on: Build a Portal",
            content: `
                <h2>Hands-on: Build a React Portal</h2>
                ${C.handson('Create a Pro-Code App', `
                    <h4>Step 1: Set Up the Project</h4>
                    <p>In your app's <code>assets/</code> folder, create a <code>client/</code> directory:</p>
                    ${C.code(`cd project/MyApp__<projectId>/app_root/version/assets/
mkdir client
cd client
npm init -y
npm install react react-dom @mui/material @emotion/react @emotion/styled
npm install @semoss/sdk
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom`, 'bash')}

                    <h4>Step 2: Create App Structure</h4>
                    <p>Create the following files:</p>
                    ${C.code(`client/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── components/
├── package.json
├── tsconfig.json
└── vite.config.ts`, 'text')}

                    <h4>Step 3: Write App.tsx</h4>
                    ${C.code(`import { InsightProvider, Env } from '@semoss/sdk/react';
import { Button } from '@mui/material';

const env = JSON.parse(
    document.getElementById('semoss-env')?.textContent || '{}'
);
Env.update({
    MODULE: env.MODULE || '/Monolith',
    APP: env.APP || ''
});

export function App() {
    return (
        <InsightProvider>
            <div style={{ padding: '2rem' }}>
                <h1>My Pro-Code App</h1>
                <Button
                    variant="contained"
                    onClick={() => alert('Hello from React!')}
                >
                    Click Me
                </Button>
            </div>
        </InsightProvider>
    );
}`, 'typescript')}

                    <h4>Step 4: Configure Vite</h4>
                    ${C.code(`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    root: 'src',
    base: './',
    build: {
        outDir: '../../portals',
        emptyOutDir: true,
    },
    resolve: {
        alias: { '@': resolve(__dirname, './src') },
    },
    plugins: [react()],
});`, 'typescript', 'vite.config.ts')}

                    <h4>Step 5: Build & Publish</h4>
                    ${C.code(`npm run build
# Output written to ../portals/

# In ${CONFIG.productName} UI, click "Publish files"
# Visit: <base-url>/public_home/<projectId>/portals/index.html`, 'bash')}

                    <h4>Bonus: Add Pixel Integration</h4>
                    ${C.code(`import { runPixel, useInsight } from '@semoss/sdk/react';

function DataFetcher() {
    const [data, setData] = useState(null);
    const { insightId } = useInsight();

    const fetchData = async () => {
        const { pixelReturn } = await runPixel(
            'MyEngines();',
            insightId
        );
        setData(pixelReturn[0].output);
    };

    return (
        <button onClick={fetchData}>
            Fetch My Engines
        </button>
    );
}`, 'typescript')}
                `)}
            `
        }
    ];
