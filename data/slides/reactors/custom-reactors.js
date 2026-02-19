// Topic: Custom Reactors
const slides_custom_reactors = [
        {
            id: "custom-reactors-title",
            title: "Custom Reactors",
            content: C.titleSlide(
                "Custom Reactors",
                `Extending ${CONFIG.productName} with custom Java components`,
                "90 minutes"
            )
        },
        {
            id: "custom-reactors-overview",
            title: "What is a Custom Reactor?",
            content: `
                <h2>What is a Custom Reactor?</h2>
                <p class="lead">A <span class="highlight">Custom Reactor</span> is a user-defined Java class that extends ${CONFIG.productName} functionality by implementing the reactor interface.</p>
                <p>While ${CONFIG.productName} ships with hundreds of built-in reactors, you can create your own for:</p>
                ${C.cards([
                    { badge: 'Use Case', title: 'Business Logic', desc: 'Custom calculations, validation rules, domain-specific transformations' },
                    { badge: 'Use Case', title: 'Integration', desc: 'Connect to proprietary APIs, legacy systems, custom data sources' },
                    { badge: 'Use Case', title: 'Performance', desc: 'Optimized batch operations, specialized algorithms' },
                    { badge: 'Use Case', title: 'Abstraction', desc: 'Wrap complex multi-step operations into reusable commands' },
                ])}
                ${C.callout(`Custom reactors are <strong>first-class citizens</strong> in ${CONFIG.productName} — they work exactly like built-in reactors in Pixel, the REST API, and the UI.`, 'info')}
            `
        },
        {
            id: "custom-reactors-interface",
            title: "Reactor Interface",
            content: `
                <h2>The Reactor Interface</h2>
                <p>All reactors implement the <code>IReactor</code> interface and typically extend <code>AbstractReactor</code> to inherit common functionality.</p>
                ${C.split(
                    {
                        title: 'IReactor Interface',
                        content: C.code(`public interface IReactor {
    // Core execution method
    NounMetadata execute();

    // Noun store management
    void In();
    Object Out();
    void curNoun(String noun);

    // Pixel signature
    void setPixel(String operation, String fullOperation);
    String[] getPixel();

    // Insight context
    void setInsight(Insight insight);
}`, 'java', 'prerna/reactor/IReactor.java (simplified)')
                    },
                    {
                        title: 'Why Extend AbstractReactor?',
                        content: `
                            <p>AbstractReactor provides:</p>
                            <ul>
                                <li><code>organizeKeys()</code> — parameter binding</li>
                                <li><code>getString()</code>, <code>getInt()</code>, <code>getMap()</code> — type-safe accessors</li>
                                <li><code>insight</code> — access to current session</li>
                                <li><code>store</code> — noun store for inputs</li>
                                <li><code>getLogger()</code> — logging utilities</li>
                                <li>Error handling helpers</li>
                            </ul>
                        `
                    }
                )}
            `
        },
        {
            id: "custom-reactors-anatomy",
            title: "Anatomy of a Reactor",
            content: `
                <h2>Anatomy of a Custom Reactor</h2>
                ${C.code(`package prerna.reactor.custom;

import prerna.reactor.AbstractReactor;
import prerna.sablecc2.om.PixelDataType;
import prerna.sablecc2.om.nounmeta.NounMetadata;

public class GreetingReactor extends AbstractReactor {

    // 1. Constructor — define expected parameters
    public GreetingReactor() {
        this.keysToGet = new String[] { "name", "language" };
        this.keyRequired = new int[] { 1, 0 };  // name required, language optional
    }

    // 2. Execute — core logic
    @Override
    public NounMetadata execute() {
        // Bind parameters from Pixel input
        organizeKeys();

        // Get parameter values
        String name = keyValue.get("name");
        String language = keyValue.getOrDefault("language", "en");

        // Business logic
        String greeting = getGreeting(language, name);

        // Return wrapped in NounMetadata
        return new NounMetadata(greeting, PixelDataType.CONST_STRING);
    }

    private String getGreeting(String lang, String name) {
        if (lang.equals("es")) return "Hola, " + name + "!";
        if (lang.equals("fr")) return "Bonjour, " + name + "!";
        return "Hello, " + name + "!";
    }

    // 3. (Optional) Help text for MCP/help command
    @Override
    public String getReactorDescription() {
        return "Greets a user in the specified language";
    }
}`, 'java', 'Example Custom Reactor')}
                <h3>Usage in Pixel</h3>
                ${C.code(`// Named parameters
Greeting(name="Carlos", language="es");

// Positional parameters (maps to keysToGet order)
Greeting("Carlos", "es");

// Required only
Greeting(name="John");  // defaults to English`, 'pixel')}
            `
        },
        {
            id: "custom-reactors-inputs",
            title: "Input Parameters",
            content: `
                <h2>Defining & Accessing Input Parameters</h2>
                ${C.flow([
                    { title: '1. Declare keysToGet', desc: 'String array of parameter names in constructor', accent: true },
                    { title: '2. Mark Required/Optional', desc: 'keyRequired[] — 1=required, 0=optional', arrow: '↓' },
                    { title: '3. Call organizeKeys()', desc: 'Populates keyValue map from Pixel inputs', arrow: '↓' },
                    { title: '4. Access Values', desc: 'Use keyValue.get() or helper methods', arrow: '↓' },
                ])}
                ${C.code(`public class CalculatorReactor extends AbstractReactor {

    public CalculatorReactor() {
        // Parameter names (support aliases with comma separation)
        this.keysToGet = new String[] { "operation,op", "a", "b" };

        // 1 = required, 0 = optional
        this.keyRequired = new int[] { 1, 1, 1 };
    }

    @Override
    public NounMetadata execute() {
        organizeKeys();  // CRITICAL — binds inputs to keyValue map

        // Type-safe accessors from AbstractReactor
        String operation = keyValue.get("operation");
        Double a = getDouble("a");  // helper method
        Double b = getDouble("b");

        Double result = switch(operation) {
            case "add" -> a + b;
            case "subtract" -> a - b;
            case "multiply" -> a * b;
            case "divide" -> a / b;
            default -> throw new IllegalArgumentException("Unknown operation: " + operation);
        };

        return new NounMetadata(result, PixelDataType.CONST_DECIMAL);
    }
}`, 'java', 'src/prerna/reactor/custom/CalculatorReactor.java')}
                ${C.callout('<strong>Key pattern:</strong> Always call <code>organizeKeys()</code> at the start of <code>execute()</code> to bind Pixel inputs to the <code>keyValue</code> map.', 'warning')}
            `
        },
        {
            id: "custom-reactors-outputs",
            title: "Output with NounMetadata",
            content: `
                <h2>Returning Results with NounMetadata</h2>
                <p>Every reactor returns a <code>NounMetadata</code> object that wraps the result value, data type, and operation type.</p>
                ${C.code(`// NounMetadata constructor
new NounMetadata(
    value,              // Object — the actual data
    PixelDataType type, // what kind of data
    PixelOperationType opType  // how it was produced (optional)
);

// Common PixelDataTypes
PixelDataType.CONST_STRING      // String
PixelDataType.CONST_INT         // Integer
PixelDataType.CONST_DECIMAL     // Double
PixelDataType.BOOLEAN           // Boolean
PixelDataType.MAP               // Map<String, Object>
PixelDataType.VECTOR            // List
PixelDataType.FRAME             // ITableDataFrame

// Common PixelOperationTypes
PixelOperationType.OPERATION    // normal data return
PixelOperationType.SUCCESS      // operation succeeded
PixelOperationType.ERROR        // operation failed
PixelOperationType.WARNING      // succeeded with warnings`, 'java', 'NounMetadata Patterns')}
                <h3>Examples</h3>
                ${C.split(
                    {
                        title: 'Return a String',
                        content: C.code(`return new NounMetadata(
    "Operation complete",
    PixelDataType.CONST_STRING
);`, 'java')
                    },
                    {
                        title: 'Return an Error',
                        content: C.code(`return new NounMetadata(
    "Engine not found",
    PixelDataType.CONST_STRING,
    PixelOperationType.ERROR
);`, 'java')
                    }
                )}
            `
        },
        {
            id: "custom-reactors-workflow",
            title: "Development Workflow",
            content: `
                <h2>Java Reactor Development Workflow</h2>
                ${C.flow([
                    { title: '1. Create Java Class', desc: 'Extend AbstractReactor in src/prerna/reactor/', accent: true },
                    { title: '2. Implement Constructor', desc: 'Set keysToGet, keyRequired', arrow: '↓' },
                    { title: '3. Implement execute()', desc: 'organizeKeys(), business logic, return NounMetadata', arrow: '↓' },
                    { title: '4. (Optional) Add Help Text', desc: 'Override getReactorDescription(), getDescriptionForKey()', arrow: '↓' },
                    { title: '5. Compile', desc: 'Maven: mvn clean install', arrow: '↓ build' },
                    { title: '6. Register in ReactorFactory', desc: 'Add to ReactorFactory.getAllReactors() (auto-scan or manual)', arrow: '↓' },
                    { title: '7. Restart Server', desc: 'Deploy to Tomcat, restart', arrow: '↓' },
                    { title: '8. Test in Pixel', desc: 'MyCustomReactor(param="value");', accent: true },
                ])}
                ${C.callout('<strong>Hot tip:</strong> Reactor names map to class names — <code>GreetingReactor</code> becomes <code>Greeting()</code> in Pixel.', 'tip')}
            `
        },
        {
            id: "custom-reactors-registration",
            title: "Auto-Discovery",
            content: `
                <h2>Reactor Auto-Discovery</h2>
                <p>${CONFIG.productName} automatically discovers and registers all custom reactors at startup — no manual registration required.</p>
                ${C.flow([
                    { title: 'Extend AbstractReactor', desc: 'Create your reactor class' },
                    { title: 'Place in prerna.reactor.*', desc: 'Any subpackage under prerna.reactor', arrow: '↓' },
                    { title: 'Rebuild & Deploy', desc: 'Add to classpath', arrow: '↓' },
                    { title: 'Auto-Discovered at Startup', desc: 'ReactorFactory scans for IReactor implementations', accent: true, arrow: '↓' },
                    { title: 'Ready to Use in Pixel', desc: 'Call by class name: MyCustomReactor();', accent: true }
                ])}
                ${C.code(`// ReactorFactory.java — Auto-discovery mechanism
private static void loadFromCP(String... packages) {
    // Scan classpath for all IReactor implementations
    ScanResult sr = new ClassGraph()
        .whitelistPackages(packages)  // e.g., "prerna.reactor"
        .scan();

    ClassInfoList classes = sr.getClassesImplementing(IReactor.class.getName());

    for (ClassInfo classInfo : classes) {
        Class actualClass = classInfo.loadClass();

        // Only register concrete (non-abstract) classes
        if (!Modifier.isAbstract(actualClass.getModifiers())
                && !Arrays.asList(actualClass.getInterfaces()).contains(IEngine.class)) {

            String reactorName = actualClass.getSimpleName();
            REACTOR_REGISTRY.put(reactorName, actualClass);
            // Now callable as: MyCustomReactor() in Pixel
        }
    }
}`, 'java', 'ReactorFactory.java — Auto-discovery at startup')}
                ${C.callout('<strong>Key insight:</strong> If your class extends <code>AbstractReactor</code> (or implements <code>IReactor</code>) and is in the <code>prerna.reactor.*</code> package, it gets automatically discovered and registered at server startup. No configuration files, no manual registration — just extend and deploy.', 'info')}
            `
        },
        {
            id: "custom-reactors-testing",
            title: "Testing & Debugging",
            content: `
                <h2>Testing & Debugging Custom Reactors</h2>
                <h3>1. Unit Testing</h3>
                ${C.code(`import org.junit.Test;
import prerna.om.Insight;
import prerna.reactor.custom.GreetingReactor;
import prerna.sablecc2.om.GenRowStruct;
import prerna.sablecc2.om.nounmeta.NounMetadata;

public class GreetingReactorTest {

    @Test
    public void testEnglishGreeting() {
        GreetingReactor reactor = new GreetingReactor();

        // Mock insight
        Insight mockInsight = new Insight();
        reactor.setInsight(mockInsight);

        // Bind parameters
        GenRowStruct row = reactor.getNounStore().makeGenRowStruct("all");
        row.add(new NounMetadata("John", PixelDataType.CONST_STRING));
        row.add(new NounMetadata("en", PixelDataType.CONST_STRING));
        reactor.getCurRow().addAll(row);

        // Execute
        NounMetadata result = reactor.execute();

        assertEquals("Hello, John!", result.getValue());
    }
}`, 'java', 'test/prerna/reactor/custom/GreetingReactorTest.java')}
                <h3>2. Logging</h3>
                ${C.code(`@Override
public NounMetadata execute() {
    Logger logger = getLogger(GreetingReactor.class.getName());
    logger.info("Greeting reactor invoked");

    organizeKeys();
    String name = keyValue.get("name");
    logger.debug("Name parameter: " + name);

    // ... rest of logic
}`, 'java')}
                <h3>3. Pixel Testing</h3>
                ${C.code(`// Test in Notebook
Greeting(name="Test User", language="es");

// Check server logs at:
// logs/SMSS_Engine.log`, 'pixel')}
            `
        },
        {
            id: "custom-reactors-best-practices",
            title: "Best Practices",
            content: `
                <h2>Best Practices for Reactor Design</h2>
                ${C.cards([
                    {
                        badge: 'Single Responsibility',
                        title: 'Do One Thing Well',
                        desc: 'Each reactor should have a focused purpose. Chain multiple reactors instead of creating monolithic ones.'
                    },
                    {
                        badge: 'Validation',
                        title: 'Validate Inputs Early',
                        desc: 'Use keyRequired[] and check for null/invalid inputs before processing. Throw IllegalArgumentException with clear messages.'
                    },
                    {
                        badge: 'Error Handling',
                        title: 'Handle Errors Gracefully',
                        desc: 'Catch exceptions and return ERROR PixelOperationType. Include context in error messages.'
                    },
                    {
                        badge: 'Documentation',
                        title: 'Provide Help Text',
                        desc: 'Override getReactorDescription() and getDescriptionForKey() — used by Help() command and MCP tools.'
                    },
                    {
                        badge: 'Security',
                        title: 'Check Permissions',
                        desc: 'Use SecurityEngineUtils, SecurityProjectUtils to verify user access before operations.'
                    },
                    {
                        badge: 'Performance',
                        title: 'Avoid Heavy Constructors',
                        desc: 'Reactors are instantiated per-call. Keep constructors lightweight; do heavy lifting in execute().'
                    },
                ])}
                ${C.callout('<strong>Naming convention:</strong> Reactor class names must end with "Reactor" (e.g., MyCustomReactor). The Pixel command name drops the suffix (MyCustom).', 'info')}
            `
        },
        {
            id: "custom-reactors-advanced",
            title: "Advanced Patterns",
            content: `
                <h2>Advanced Reactor Patterns</h2>
                <h3>1. Access Insight Context</h3>
                ${C.code(`@Override
public NounMetadata execute() {
    // Get the current user
    User user = this.insight.getUser();
    String userId = user.getEmail();

    // Get insight metadata
    String insightId = this.insight.getInsightId();
    String projectId = this.insight.getProjectId();

    // ...
}`, 'java')}
                <h3>2. Chain to Engines</h3>
                ${C.code(`@Override
public NounMetadata execute() {
    organizeKeys();
    String engineId = keyValue.get("engine");

    // Get engine from DIHelper via Utility class
    IEngine engine = Utility.getDatabase(engineId);

    if (engine instanceof IDatabaseEngine) {
        IDatabaseEngine db = (IDatabaseEngine) engine;
        // Run a query (execQuery returns Object)
        Object results = db.execQuery("SELECT * FROM table");
        // ...
    }

    return new NounMetadata(results, PixelDataType.FRAME);
}`, 'java', 'Reactor interacting with engines')}
                <h3>3. Multi-value Parameters</h3>
                ${C.code(`// Allow lists of values
this.keysToGet = new String[] { "ids" };

@Override
public NounMetadata execute() {
    organizeKeys();

    // Get all values for "ids" parameter
    List<String> ids = getListString("ids");

    // Process each ID
    for (String id : ids) {
        // ...
    }
}`, 'java')}
            `
        },
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
            id: "custom-reactors-recap",
            title: "Recap",
            content: `
                <h2>Custom Reactors Recap</h2>
                ${C.cards([
                    {
                        badge: 'Core Concept',
                        title: 'Reactors = Pixel Commands',
                        desc: 'Every custom reactor becomes a first-class Pixel command automatically.'
                    },
                    {
                        badge: 'Pattern',
                        title: 'Extend AbstractReactor',
                        desc: 'Provides parameter binding, type-safe accessors, logging, error handling.'
                    },
                    {
                        badge: 'Input',
                        title: 'keysToGet + organizeKeys()',
                        desc: 'Declare parameters in constructor, call organizeKeys() to bind values.'
                    },
                    {
                        badge: 'Output',
                        title: 'Return NounMetadata',
                        desc: 'Wrap value + PixelDataType + PixelOperationType for proper chaining.'
                    },
                    {
                        badge: 'Lifecycle',
                        title: 'Create → Compile → Register → Test',
                        desc: 'ReactorFactory auto-discovers reactors on classpath.'
                    },
                    {
                        badge: 'Best Practice',
                        title: 'Single Responsibility',
                        desc: 'Keep reactors focused, validate inputs, handle errors gracefully.'
                    },
                ])}
                ${C.callout(`<strong>Next:</strong> Custom Python reactors via GAAS — extend ${CONFIG.productName} with Python instead of Java.`, 'info')}
            `
        }
    ];
