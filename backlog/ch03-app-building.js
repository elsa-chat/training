// Day 4, Chapter 3: App Building & Publishing (90 min)
const day4_ch03 = {
    title: "App Building & Publishing",
    slides: [
        {
            id: "d4-app-building-title",
            title: "App Building & Publishing",
            content: C.titleSlide(
                "App Building & Publishing",
                "From development to production — compiling, versioning, and publishing apps",
                "90 minutes"
            )
        },
        {
            id: "d4-app-building-overview",
            title: "App Lifecycle",
            content: `
                <h2>App Development Lifecycle</h2>
                <p class="lead">Building and publishing a ${CONFIG.productName} app involves several stages from local development to production deployment.</p>
                ${C.flow([
                    { title: 'Develop', desc: 'Write custom reactors (Java), Python functions, and React UI', accent: true, arrow: '↓' },
                    { title: 'Compile', desc: 'CompileAppReactors — compile Java, generate classes', arrow: '↓ generates bytecode' },
                    { title: 'Build Blocks', desc: 'SaveAppBlocksJson — save frontend configuration', arrow: '↓ saves blocks.json' },
                    { title: 'Version', desc: 'Git commit — track changes with version control', arrow: '↓ commits to git' },
                    { title: 'Publish', desc: 'PublishProject — deploy to public URL', accent: true, arrow: '↓ release=true' },
                    { title: 'Share', desc: 'Grant permissions — enable catalog discovery', },
                ])}
                ${C.callout('Each stage has a corresponding Pixel reactor. The UI orchestrates these behind the scenes, but you can call them directly for automation or CI/CD.', 'info')}
            `
        },
        {
            id: "d4-app-building-structure-recap",
            title: "App Structure Recap",
            content: `
                <h2>App Structure (Quick Recap)</h2>
                <p>Before we dive into building, let's recall the key app folder structure:</p>
                ${C.tree([
                    { name: "project/", type: "dir", children: [
                        { name: "<AppName>__<UUID>/", type: "dir", desc: "← unique folder per app", children: [
                            { name: "app_root/", type: "dir", desc: "← Constants.APP_ROOT_FOLDER", children: [
                                { name: "version/", type: "dir", desc: "← git repo root (Constants.VERSION_FOLDER)", children: [
                                    { name: "assets/", type: "dir", desc: "← Constants.ASSETS_FOLDER — your workspace", children: [
                                        { name: "portals/", type: "dir", desc: "← published UI + blocks.json" },
                                        { name: "java/", type: "dir", desc: "← custom reactor source" },
                                        { name: "classes/", type: "dir", desc: "← compiled .class files + compileerror.out" },
                                        { name: "py/", type: "dir", desc: "← Python functions" },
                                        { name: "client/", type: "dir", desc: "← React/Vite source (if using build tools)" },
                                    ]}
                                ]}
                            ]}
                        ]},
                        { name: "<AppName>__<UUID>.smss", type: "file", desc: "← project metadata" }
                    ]}
                ])}
                ${C.callout('Key paths are defined in <code>prerna.util.Constants</code> and managed by <code>AssetUtility.java</code>.', 'tip')}
            `
        },
        {
            id: "d4-app-building-compile-reactors",
            title: "Compiling Custom Reactors",
            content: `
                <h2>CompileAppReactors — Compile Java Code</h2>
                <p>When you write custom reactors in <code>assets/java/</code>, they need to be compiled to bytecode before ${CONFIG.productName} can execute them.</p>
                ${C.code(`CompileAppReactors(project="<projectId>", release=false);`, 'pixel', 'Compile Reactors for Local Testing')}
                ${C.flow([
                    { title: 'Clear Class Cache', desc: 'project.clearClassCache() — unload old classes', arrow: '↓' },
                    { title: 'Compile Source', desc: 'project.compileReactors() — javac on assets/java/', arrow: '↓ generates .class files' },
                    { title: 'Load Compiler Output', desc: 'Read assets/classes/compileerror.out for errors', arrow: '↓ if compilation fails' },
                    { title: 'Push to Cloud (Optional)', desc: 'ClusterUtil.pushProjectFolder() — sync if release=true', },
                ])}
                <h3>Parameters</h3>
                <ul>
                    <li><code>project</code> — project ID to compile</li>
                    <li><code>release</code> (optional) — if <strong>true</strong>, pushes compiled code to cloud storage and propagates to other containers. Default: false.</li>
                </ul>
                ${C.callout('<strong>Compiler Output:</strong> Check <code>assets/classes/compileerror.out</code> for compilation errors. If it exists and has content, your Java code failed to compile.', 'warning')}
            `
        },
        {
            id: "d4-app-building-compile-reactor-code",
            title: "CompileAppReactorsReactor Code",
            content: `
                <h2>CompileAppReactorsReactor.java</h2>
                ${C.code(`public class CompileAppReactorsReactor extends AbstractReactor {
    public CompileAppReactorsReactor() {
        this.keysToGet = new String[] {
            ReactorKeysEnum.PROJECT.getKey(),
            ReactorKeysEnum.RELEASE.getKey()
        };
    }

    @Override
    public NounMetadata execute() {
        organizeKeys();
        String projectId = this.keyValue.get(this.keysToGet[0]);
        Boolean release = Boolean.parseBoolean(this.keyValue.get(this.keysToGet[1]) + "");

        IProject project = Utility.getProject(projectId);
        clearProjectAssets(project, release);

        return new NounMetadata(messages, PixelDataType.VECTOR);
    }

    private void clearProjectAssets(IProject project, boolean release) {
        project.clearClassCache();
        project.compileReactors();

        if (release) {
            String projectVersionFolder = AssetUtility.getProjectVersionFolder(
                project.getProjectName(), projectId);
            ClusterUtil.pushProjectFolder(project, projectVersionFolder,
                Constants.ASSETS_FOLDER + "/" + "java");
            // Also push compiled classes if they exist
            ClusterUtil.pushProjectFolder(project, projectVersionFolder,
                Constants.ASSETS_FOLDER + "/" + "classes");

            SecurityProjectUtils.setReactorCompilation(user, projectId);
        }
    }
}`, 'java', 'src/prerna/reactor/project/CompileAppReactorsReactor.java')}
                ${C.callout('The <code>release</code> flag controls cloud sync. Use <code>false</code> for local dev, <code>true</code> when deploying to production.', 'info')}
            `
        },
        {
            id: "d4-app-building-blocks-json",
            title: "blocks.json — Frontend Configuration",
            content: `
                <h2>blocks.json — The App Manifest</h2>
                <p class="lead">The <code>blocks.json</code> file in <code>assets/portals/</code> defines your app's frontend structure, cells, and configuration.</p>
                <p>This file is generated by the App Builder UI when you add blocks/cells to your app. It's the blueprint for how the frontend renders.</p>
                ${C.split(
                    {
                        title: 'What blocks.json Contains',
                        content: `
                            <ul>
                                <li><strong>Blocks</strong>: High-level page layouts</li>
                                <li><strong>Cells</strong>: Individual UI components (grids, charts, forms)</li>
                                <li><strong>Config</strong>: Cell properties, data bindings, styles</li>
                                <li><strong>Dependencies</strong>: Engine connections (databases, models)</li>
                                <li><strong>Metadata</strong>: App name, version, description</li>
                            </ul>
                        `
                    },
                    {
                        title: 'blocks.json Structure (Simplified)',
                        content: C.code(`{
  "blocks": [
    {
      "id": "page-1",
      "name": "Dashboard",
      "cells": [
        {
          "type": "Grid",
          "config": { "engine": "sales-db", "query": "..." }
        },
        {
          "type": "BarChart",
          "config": { "data": "..." }
        }
      ]
    }
  ],
  "dependencies": {
    "sales-db": "<engineId>"
  }
}`, 'json', 'assets/portals/blocks.json (simplified)')
                    }
                )}
                ${C.callout(`The <code>IProject.BLOCK_FILE_NAME</code> constant is <code>"blocks.json"</code>. This is the standard name for all ${CONFIG.productName} apps.`, 'tip')}
            `
        },
        {
            id: "d4-app-building-save-blocks",
            title: "SaveAppBlocksJson",
            content: `
                <h2>SaveAppBlocksJson — Persist Frontend Config</h2>
                <p>When you modify your app's UI in the App Builder, the changes are saved to <code>blocks.json</code> via the <code>SaveAppBlocksJson</code> reactor.</p>
                ${C.code(`SaveAppBlocksJson(
    project="<projectId>",
    json={"blocks": [...], "dependencies": {...}},
    comment="Added dashboard page"
);`, 'pixel', 'Save Frontend Blocks')}
                ${C.flow([
                    { title: 'Validate JSON', desc: 'Ensure blocks JSON is valid and not empty', arrow: '↓' },
                    { title: 'Write blocks.json', desc: 'GsonUtility.writeObjectToJsonFile() to portals/', arrow: '↓ overwrites existing file' },
                    { title: 'Git Commit', desc: 'GitRepoUtils.addSpecificFiles() → commitAddedFiles()', arrow: '↓ version control' },
                    { title: 'Sync to Cloud', desc: 'ClusterUtil.pushProjectFolder() — if cluster mode', arrow: '↓ cloud backup' },
                    { title: 'Update Dependencies', desc: 'SecurityProjectUtils.updateProjectDependenciesWithoutType()', },
                ])}
                ${C.callout(`<strong>Git Integration:</strong> Every time you save blocks.json, ${CONFIG.productName} commits it to the local git repo. This gives you full version history of your UI changes.`, 'info')}
            `
        },
        {
            id: "d4-app-building-save-blocks-code",
            title: "SaveAppBlocksJsonReactor Code",
            content: `
                <h2>SaveAppBlocksJsonReactor.java</h2>
                ${C.code(`public class SaveAppBlocksJsonReactor extends AbstractReactor {
    @Override
    public NounMetadata execute() {
        String projectId = this.keyValue.get(ReactorKeysEnum.PROJECT.getKey());
        Map<String, Object> json = getBlocksJSON();
        String comment = this.keyValue.get(ReactorKeysEnum.COMMENT_KEY.getKey());

        IProject project = Utility.getProject(projectId);
        String portalsFolder = AssetUtility.getProjectPortalsFolder(projectId);
        File blocksJsonFile = new File(portalsFolder + "/" + IProject.BLOCK_FILE_NAME);

        // Write JSON to file
        GsonUtility.writeObjectToJsonFile(blocksJsonFile, GSON, json);

        // Git commit
        String projectVersionFolder = AssetUtility.getProjectVersionFolder(
            project.getProjectName(), projectId);
        List<String> files = new Vector<>();
        files.add(blocksJsonFile.getAbsolutePath());
        GitRepoUtils.addSpecificFiles(projectVersionFolder, files);
        GitRepoUtils.commitAddedFiles(projectVersionFolder, comment, user);

        // Sync to cloud
        if (ClusterUtil.IS_CLUSTER) {
            ClusterUtil.pushProjectFolder(project, projectVersionFolder);
            SecurityProjectUtils.setPortalPublish(user, projectId);
        }

        // Update engine dependencies
        Set<String> engineDependencyIds = new HashSet<>(
            project.getEngineDependencies().values());
        SecurityProjectUtils.updateProjectDependenciesWithoutType(
            user, projectId, engineDependencyIds);
        SecurityProjectUtils.updateProjectLastEditedDate(projectId);

        return new NounMetadata(true, PixelDataType.MAP);
    }
}`, 'java', 'src/prerna/reactor/project/SaveAppBlocksJsonReactor.java (simplified)')}
            `
        },
        {
            id: "d4-app-building-versioning",
            title: "App Versioning & Git",
            content: `
                <h2>App Versioning with Git</h2>
                <p>Every ${CONFIG.productName} app is backed by a Git repository in the <code>app_root/version/</code> folder. This provides automatic version control for your code and configuration.</p>
                ${C.cards([
                    { badge: 'Feature', title: 'Auto-Commit', desc: 'SaveAppBlocksJson and other reactors auto-commit changes' },
                    { badge: 'Feature', title: 'Commit History', desc: 'View past versions with ProjectGitDetails reactor' },
                    { badge: 'Feature', title: 'Restore', desc: 'Roll back to previous commits with ProjectCommitRestore' },
                    { badge: 'Feature', title: 'Collaboration', desc: 'Clone, pull, push for team development' },
                ])}
                ${C.split(
                    {
                        title: 'View Git History',
                        content: C.code(`ProjectGitDetails(project="<projectId>");

// Returns:
// - Commit hash
// - Author
// - Timestamp
// - Comment message`, 'pixel', 'Get Commit History')
                    },
                    {
                        title: 'Restore Previous Version',
                        content: C.code(`ProjectCommitRestore(
    project="<projectId>",
    commitId="abc123..."
);

// Rolls back the app to the
// specified commit`, 'pixel', 'Restore to Previous Commit')
                    }
                )}
                ${C.callout(`The git repo is managed internally by ${CONFIG.productName}. You can access it via <code>ProjectGitDetails</code> and <code>ProjectCommitRestore</code> reactors, but avoid manually editing <code>.git/</code> files.`, 'warning')}
            `
        },
        {
            id: "d4-app-building-publishing",
            title: "Publishing to Catalog",
            content: `
                <h2>PublishProject — Deploy to Production</h2>
                <p class="lead">Once your app is ready, use <code>PublishProject</code> to make it publicly accessible via a web URL.</p>
                ${C.code(`PublishProject(project="<projectId>", release=false);

// Returns:
// https://your-instance-dns.com/public/<projectId>/portals/`, 'pixel', 'Publish App (Local Only)')}
                ${C.code(`PublishProject(project="<projectId>", release=true);

// Returns:
// https://your-instance-dns.com/public/<projectId>/portals/
// + Syncs to cloud storage
// + Updates catalog visibility`, 'pixel', 'Publish App (With Cloud Sync)')}
                ${C.flow([
                    { title: 'Set Republish Flag', desc: 'project.setRepublish(true) — mark as published', accent: true, arrow: '↓' },
                    { title: 'Push Portals Folder', desc: 'ClusterUtil.pushProjectFolder() — sync assets/portals/', arrow: '↓ if release=true' },
                    { title: 'Update Catalog', desc: 'SecurityProjectUtils.setPortalPublish() — enable discovery', arrow: '↓' },
                    { title: 'Return Public URL', desc: 'Construct URL: /public/<projectId>/portals/', accent: true },
                ])}
                ${C.callout('<strong>release=true vs false:</strong> Use <code>false</code> for preview/staging deployments (local container only). Use <code>true</code> for production (syncs to cloud and updates catalog).', 'info')}
            `
        },
        {
            id: "d4-app-building-publish-reactor-code",
            title: "PublishProjectReactor Code",
            content: `
                <h2>PublishProjectReactor.java</h2>
                ${C.code(`public class PublishProjectReactor extends AbstractReactor {
    public PublishProjectReactor() {
        this.keysToGet = new String[]{
            ReactorKeysEnum.PROJECT.getKey(),
            ReactorKeysEnum.RELEASE.getKey()
        };
    }

    @Override
    public NounMetadata execute() {
        organizeKeys();
        String projectId = this.keyValue.get(this.keysToGet[0]);
        Boolean release = Boolean.parseBoolean(this.keyValue.get(this.keysToGet[1])+"");

        User user = this.insight.getUser();
        if(!SecurityProjectUtils.userIsOwner(user, projectId)) {
            throw new IllegalArgumentException(
                "Project does not exist or user is not an owner of the project");
        }

        IProject project = Utility.getProject(projectId);
        project.setRepublish(true);

        if(release) {
            SecurityProjectUtils.setPortalPublish(user, projectId);
            ClusterUtil.pushProjectFolder(project,
                AssetUtility.getProjectVersionFolder(project.getProjectName(), projectId),
                Constants.ASSETS_FOLDER + "/" + Constants.PORTALS_FOLDER);
        }

        String url = Utility.getApplicationUrl() + "/"
            + Utility.getPublicHomeFolder() + "/" + projectId + "/"
            + Constants.PORTALS_FOLDER + "/";

        NounMetadata noun = new NounMetadata(url, PixelDataType.CONST_STRING);
        if(release) {
            noun.addAdditionalReturn(NounMetadata.getSuccessNounMessage(
                "Successfully published and released the project"));
        } else {
            noun.addAdditionalReturn(NounMetadata.getSuccessNounMessage(
                "Successfully published the project"));
        }
        return noun;
    }
}`, 'java', 'src/prerna/reactor/project/PublishProjectReactor.java')}
                ${C.callout('Only <strong>project owners</strong> can publish. The reactor checks <code>SecurityProjectUtils.userIsOwner()</code> before proceeding.', 'warning')}
            `
        },
        {
            id: "d4-app-building-permissions",
            title: "App Permissions & Sharing",
            content: `
                <h2>App Permissions & Catalog Discovery</h2>
                <p>After publishing, you control who can access your app via ${CONFIG.productName}'s permission system.</p>
                ${C.table(
                    ['Permission Level', 'Capabilities'],
                    [
                        ['Owner', 'Full control — edit, compile, publish, delete, manage permissions'],
                        ['Editor', 'Edit app code and blocks, compile reactors, cannot publish or delete'],
                        ['Viewer', 'View published app, cannot edit or access source code'],
                        ['Discoverable', 'App appears in catalog for users with viewer+ permissions'],
                    ]
                )}
                ${C.split(
                    {
                        title: 'Grant Access via Pixel',
                        content: C.code(`// Grant viewer access
AddProjectUserPermission(
    project="<projectId>",
    userId="user@example.com",
    permission="READ_ONLY"
);

// Grant editor access
AddProjectUserPermission(
    project="<projectId>",
    userId="developer@example.com",
    permission="EDIT"
);`, 'pixel', 'Add User Permissions')
                    },
                    {
                        title: 'Enable Catalog Discovery',
                        content: C.code(`SetProjectGlobal(
    project="<projectId>",
    global=true
);

// Makes app visible in catalog
// for all users with view permission`, 'pixel', 'Publish to Catalog')
                    }
                )}
                ${C.callout('Use the <strong>Discoverable</strong> flag to control whether your app appears in the public catalog. Even if discoverable, users need explicit view permissions to access it.', 'tip')}
            `
        },
        {
            id: "d4-app-building-workflow-summary",
            title: "Complete Build & Publish Workflow",
            content: `
                <h2>Putting It All Together</h2>
                <p>Here's the complete end-to-end workflow for building and publishing a ${CONFIG.productName} app:</p>
                ${C.sequence(
                    ['Developer', `${CONFIG.productName} Backend`, 'Git Repo', 'Cloud Storage', 'Catalog'],
                    [
                        { from: 0, to: 1, label: '1. Write code (Java/Python/React)' },
                        { from: 0, to: 1, label: '2. CompileAppReactors(release=false)' },
                        { from: 1, to: 2, label: '3. Compile & clear cache' },
                        { from: 2, to: 1, label: 'Compiled classes', type: 'response' },
                        { from: 0, to: 1, label: '4. SaveAppBlocksJson(json=...)' },
                        { from: 1, to: 2, label: '5. Git commit blocks.json' },
                        { from: 0, to: 1, label: '6. PublishProject(release=true)' },
                        { from: 1, to: 2, label: '7. Set republish flag' },
                        { from: 1, to: 3, label: '8. Push portals/ to cloud' },
                        { from: 1, to: 4, label: '9. Update catalog metadata' },
                        { from: 1, to: 0, label: 'Public URL', type: 'response' },
                    ]
                )}
                ${C.callout('<strong>Pro Tip:</strong> Use <code>release=false</code> during development to iterate quickly without syncing to cloud. Only use <code>release=true</code> for final production deployments.', 'tip')}
            `
        },
        {
            id: "d4-app-building-handson",
            title: "Hands-on: Build & Publish",
            content: `
                <h2>Hands-on: Build and Publish an App</h2>
                ${C.handson('Complete App Build & Publish', `
                    <h4>Step 1: Create a Simple App</h4>
                    <p>In the ${CONFIG.productName} UI, create a new app called <strong>"My First App"</strong>. Add a simple page with a Grid cell connected to a database.</p>

                    <h4>Step 2: Add a Custom Reactor</h4>
                    <p>Create a Java reactor in <code>assets/java/</code>:</p>
                    ${C.code(`package prerna.reactor.custom;

import prerna.reactor.AbstractReactor;
import prerna.sablecc2.om.PixelDataType;
import prerna.sablecc2.om.nounmeta.NounMetadata;

public class HelloReactor extends AbstractReactor {
    @Override
    public NounMetadata execute() {
        return new NounMetadata("Hello from My First App!", PixelDataType.CONST_STRING);
    }
}`, 'java', 'assets/java/prerna/reactor/custom/HelloReactor.java')}

                    <h4>Step 3: Compile the Reactor</h4>
                    <p>Run in the Pixel console:</p>
                    ${C.code(`CompileAppReactors(project="<your-project-id>", release=false);`, 'pixel')}
                    <p>Check for errors in <code>assets/classes/compileerror.out</code>. If empty or missing, compilation succeeded.</p>

                    <h4>Step 4: Test the Reactor</h4>
                    ${C.code(`HelloReactor();
// Should return: "Hello from My First App!"`, 'pixel')}

                    <h4>Step 5: Save Frontend Changes</h4>
                    <p>If you modified the UI, the App Builder will call <code>SaveAppBlocksJson</code> automatically. You can also call it manually:</p>
                    ${C.code(`SaveAppBlocksJson(
    project="<your-project-id>",
    json={...},  // your blocks structure
    comment="Added custom reactor test"
);`, 'pixel')}

                    <h4>Step 6: Publish (Local Preview)</h4>
                    ${C.code(`PublishProject(project="<your-project-id>", release=false);`, 'pixel')}
                    <p>Visit the returned URL to preview your app.</p>

                    <h4>Step 7: Release to Production (Optional)</h4>
                    <p>Once satisfied, publish with <code>release=true</code> to sync to cloud:</p>
                    ${C.code(`PublishProject(project="<your-project-id>", release=true);`, 'pixel')}

                    <h4>Step 8: Share with Others</h4>
                    ${C.code(`AddProjectUserPermission(
    project="<your-project-id>",
    userId="colleague@example.com",
    permission="READ_ONLY"
);

SetProjectGlobal(project="<your-project-id>", global=true);`, 'pixel')}
                    <p>Your app is now discoverable in the catalog for users with view permissions!</p>
                `)}
            `
        },
        {
            id: "d4-app-building-recap",
            title: "Chapter Recap",
            content: `
                <h2>Chapter Recap: App Building & Publishing</h2>
                ${C.cards([
                    {
                        badge: 'CompileAppReactors',
                        title: 'Compile Custom Code',
                        desc: 'Compiles Java reactors from <code>assets/java/</code> to <code>assets/classes/</code>. Use <code>release=true</code> to sync to cloud.'
                    },
                    {
                        badge: 'SaveAppBlocksJson',
                        title: 'Save Frontend Config',
                        desc: 'Persists <code>blocks.json</code> to <code>assets/portals/</code>, commits to git, and updates engine dependencies.'
                    },
                    {
                        badge: 'Git Integration',
                        title: 'Version Control',
                        desc: 'Every app change is auto-committed to the local git repo. View history with <code>ProjectGitDetails</code>, restore with <code>ProjectCommitRestore</code>.'
                    },
                    {
                        badge: 'PublishProject',
                        title: 'Deploy to Production',
                        desc: 'Generates a public URL for your app. Use <code>release=true</code> to sync to cloud and update catalog.'
                    },
                    {
                        badge: 'Permissions',
                        title: 'Sharing & Discovery',
                        desc: 'Control access with <code>AddProjectUserPermission</code>. Enable catalog discovery with <code>SetProjectGlobal</code>.'
                    },
                ])}
                <h3>Key Takeaways</h3>
                <ul>
                    <li>Use <code>release=false</code> for dev/staging, <code>release=true</code> for prod</li>
                    <li>Check <code>assets/classes/compileerror.out</code> for Java compilation errors</li>
                    <li>Every app change is git-backed — leverage version history!</li>
                    <li>Only project owners can publish; editors can compile but not release</li>
                    <li>The public URL pattern is <code>/public/&lt;projectId&gt;/portals/</code></li>
                </ul>
            `
        },
    ]
};
