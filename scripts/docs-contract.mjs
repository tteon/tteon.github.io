export const SOURCE_REPO = 'tteon/seocho';
export const SOURCE_BLOB_BASE = `https://github.com/${SOURCE_REPO}/blob/main/`;
export const SOURCE_TREE_BASE = `https://github.com/${SOURCE_REPO}/tree/main/`;

function sourceFields(src, sourceCommit) {
  return (
    `source_repo: ${SOURCE_REPO}\n` +
    `source_path: ${src}\n` +
    `source_commit: ${sourceCommit}\n`
  );
}

function docsFrontmatter({ title, description, src, sourceCommit }) {
  return (
    '---\n' +
    `title: ${title}\n` +
    `description: ${description}\n` +
    sourceFields(src, sourceCommit) +
    '---\n\n' +
    `> *Source mirrored from \`seocho/${src}\`*\n\n`
  );
}

function blogFrontmatter({ title, date, excerpt, src, sourceCommit }) {
  return (
    '---\n' +
    `title: "${title}"\n` +
    `date: ${date}\n` +
    'authors:\n' +
    '  - seocho\n' +
    `excerpt: ${excerpt}\n` +
    sourceFields(src, sourceCommit) +
    '---\n\n' +
    `> *Source mirrored from \`seocho/${src}\`*\n\n`
  );
}

export function createFileMappings({ sourceDateFor, sourceCommit }) {
  return [
    {
      src: 'docs/WHY_SEOCHO.md',
      dest: 'why_seocho.md',
      frontmatter: docsFrontmatter({
        title: 'Why SEOCHO',
        description:
          'Why SEOCHO is ontology-first and graph-native instead of generic memory-first.',
        src: 'docs/WHY_SEOCHO.md',
        sourceCommit,
      }),
    },
    {
      src: 'docs/README.md',
      dest: '../docs.md',
      frontmatter: docsFrontmatter({
        title: 'Docs Home',
        description: 'Central Documentation Index for SEOCHO',
        src: 'docs/README.md',
        sourceCommit,
      }),
    },
    {
      src: 'QUICKSTART.md',
      dest: 'quickstart.md',
      frontmatter: docsFrontmatter({
        title: 'Quickstart',
        description: 'Get SEOCHO up and running in 5 minutes.',
        src: 'QUICKSTART.md',
        sourceCommit,
      }),
    },
    {
      src: 'docs/RUNTIME_DEPLOYMENT.md',
      dest: 'runtime_deployment.md',
      frontmatter: docsFrontmatter({
        title: 'Runtime Deployment',
        description:
          'Full local runtime deployment guide for the Docker stack, services, and environment setup.',
        src: 'docs/RUNTIME_DEPLOYMENT.md',
        sourceCommit,
      }),
    },
    {
      src: 'docs/APPLY_YOUR_DATA.md',
      dest: 'apply_your_data.md',
      frontmatter: docsFrontmatter({
        title: 'Bring Your Data',
        description: 'How to load your own records into SEOCHO and query them safely.',
        src: 'docs/APPLY_YOUR_DATA.md',
        sourceCommit,
      }),
    },
    {
      src: 'docs/PYTHON_INTERFACE_QUICKSTART.md',
      dest: 'python_sdk.md',
      frontmatter: docsFrontmatter({
        title: 'Python SDK',
        description:
          'Developer-first guide to ingest data and query SEOCHO through the Python SDK.',
        src: 'docs/PYTHON_INTERFACE_QUICKSTART.md',
        sourceCommit,
      }),
    },
    {
      src: 'docs/FILES_AND_ARTIFACTS.md',
      dest: 'files_and_artifacts.md',
      frontmatter: docsFrontmatter({
        title: 'Files and Artifacts',
        description:
          'Where ontology files, graph state, rule profiles, semantic artifacts, and traces live.',
        src: 'docs/FILES_AND_ARTIFACTS.md',
        sourceCommit,
      }),
    },
    {
      src: 'docs/RUN_SPECS.md',
      dest: 'run_specs.md',
      frontmatter: docsFrontmatter({
        title: 'Run Specs',
        description: 'Declare ontology, documents, questions, models, and sweeps in YAML.',
        src: 'docs/RUN_SPECS.md',
        sourceCommit,
      }),
    },
    {
      src: 'docs/ARCHITECTURE.md',
      dest: 'architecture.md',
      frontmatter: docsFrontmatter({
        title: 'Architecture',
        description: 'System Architecture and Module Map.',
        src: 'docs/ARCHITECTURE.md',
        sourceCommit,
      }),
    },
    {
      src: 'docs/WORKFLOW.md',
      dest: 'workflow.md',
      frontmatter: docsFrontmatter({
        title: 'Workflow',
        description: 'End-to-end Operational Workflow.',
        src: 'docs/WORKFLOW.md',
        sourceCommit,
      }),
    },
    {
      src: 'docs/TUTORIAL_FIRST_RUN.md',
      dest: 'tutorial.md',
      frontmatter: docsFrontmatter({
        title: 'First Run Tutorial',
        description: 'End-to-end tutorial to start services, verify APIs, and run agent chat.',
        src: 'docs/TUTORIAL_FIRST_RUN.md',
        sourceCommit,
      }),
    },
    {
      src: 'docs/OPEN_SOURCE_PLAYBOOK.md',
      dest: 'open_source_playbook.md',
      frontmatter: docsFrontmatter({
        title: 'Open Source Playbook',
        description: 'Extension guide for ontology, data, agent, and runtime integration.',
        src: 'docs/OPEN_SOURCE_PLAYBOOK.md',
        sourceCommit,
      }),
    },
    {
      src: 'docs/RELEASE_AND_COMMUNITY_OPERATIONS.md',
      dest: 'release_and_community_operations.md',
      frontmatter: docsFrontmatter({
        title: 'Release And Community Operations',
        description:
          'Release gates, Discord update policy, and open-source community operating rules.',
        src: 'docs/RELEASE_AND_COMMUNITY_OPERATIONS.md',
        sourceCommit,
      }),
    },
    {
      src: 'docs/PHILOSOPHY.md',
      dest: 'philosophy.md',
      frontmatter: docsFrontmatter({
        title: 'Philosophy',
        description: 'Core Design Philosophy Charter and Operating Principles.',
        src: 'docs/PHILOSOPHY.md',
        sourceCommit,
      }),
    },
    {
      src: 'docs/PHILOSOPHY.md',
      dest: 'philosophy.md',
      isBlog: true,
      frontmatter: blogFrontmatter({
        title: 'SEOCHO Design Philosophy & Operating Principles',
        date: sourceDateFor('docs/PHILOSOPHY.md'),
        excerpt:
          'Extract domain rules and high-value semantics from heterogeneous data into a SHACL-like semantic layer.',
        src: 'docs/PHILOSOPHY.md',
        sourceCommit,
      }),
    },
    {
      src: 'docs/PHILOSOPHY_FEASIBILITY_REVIEW.md',
      dest: 'feasibility-review-framework.md',
      isBlog: true,
      frontmatter: blogFrontmatter({
        title: 'Feasibility Review Framework & Rubrics',
        date: sourceDateFor('docs/PHILOSOPHY_FEASIBILITY_REVIEW.md'),
        excerpt:
          'Multi-role feasibility review framework and Go/No-Go rubric for graph data implementations.',
        src: 'docs/PHILOSOPHY_FEASIBILITY_REVIEW.md',
        sourceCommit,
      }),
    },
  ];
}

export const routeReplacements = [
  ['`docs/WHY_SEOCHO.md`', '[`/docs/why_seocho/`](/docs/why_seocho/)'],
  ['`docs/README.md`', '[`/docs/`](/docs/)'],
  ['`QUICKSTART.md`', '[`/docs/quickstart/`](/docs/quickstart/)'],
  ['`docs/RUNTIME_DEPLOYMENT.md`', '[`/docs/runtime_deployment/`](/docs/runtime_deployment/)'],
  ['`docs/APPLY_YOUR_DATA.md`', '[`/docs/apply_your_data/`](/docs/apply_your_data/)'],
  ['`docs/PYTHON_INTERFACE_QUICKSTART.md`', '[`/docs/python_sdk/`](/docs/python_sdk/)'],
  ['`docs/FILES_AND_ARTIFACTS.md`', '[`/docs/files_and_artifacts/`](/docs/files_and_artifacts/)'],
  ['`docs/RUN_SPECS.md`', '[`/docs/run_specs/`](/docs/run_specs/)'],
  ['`docs/ARCHITECTURE.md`', '[`/docs/architecture/`](/docs/architecture/)'],
  ['`docs/WORKFLOW.md`', '[`/docs/workflow/`](/docs/workflow/)'],
  ['`docs/TUTORIAL_FIRST_RUN.md`', '[`/docs/tutorial/`](/docs/tutorial/)'],
  ['`docs/OPEN_SOURCE_PLAYBOOK.md`', '[`/docs/open_source_playbook/`](/docs/open_source_playbook/)'],
  ['`docs/RELEASE_AND_COMMUNITY_OPERATIONS.md`', '[`/docs/release_and_community_operations/`](/docs/release_and_community_operations/)'],
  ['`docs/PHILOSOPHY.md`', '[`/docs/philosophy/`](/docs/philosophy/)'],
  ['`docs/PHILOSOPHY_FEASIBILITY_REVIEW.md`', '[`/blog/feasibility-review-framework/`](/blog/feasibility-review-framework/)'],
  ['(../README.md#execution-surfaces)', `(${SOURCE_BLOB_BASE}README.md#execution-surfaces)`],
  ['(../README.md#choose-a-mode)', `(${SOURCE_BLOB_BASE}README.md#choose-a-mode)`],
  ['(../README.md)', `(${SOURCE_BLOB_BASE}README.md)`],
  ['(README.md)', `(${SOURCE_BLOB_BASE}README.md)`],
  ['(../QUICKSTART.md)', '(/docs/quickstart/)'],
  ['(RELEASE_AND_COMMUNITY_OPERATIONS.md)', '(/docs/release_and_community_operations/)'],
  ['(RUN_SPECS.md)', '(/docs/run_specs/)'],
  ['(WHY_SEOCHO.md)', '(/docs/why_seocho/)'],
  ['(QUICKSTART.md)', '(/docs/quickstart/)'],
  ['(docs/RUNTIME_DEPLOYMENT.md)', '(/docs/runtime_deployment/)'],
  ['(RUNTIME_DEPLOYMENT.md)', '(/docs/runtime_deployment/)'],
  ['(docs/APPLY_YOUR_DATA.md)', '(/docs/apply_your_data/)'],
  ['(docs/PYTHON_INTERFACE_QUICKSTART.md)', '(/docs/python_sdk/)'],
  ['(docs/FILES_AND_ARTIFACTS.md)', '(/docs/files_and_artifacts/)'],
  ['(docs/RUN_SPECS.md)', '(/docs/run_specs/)'],
  ['(docs/RELEASE_AND_COMMUNITY_OPERATIONS.md)', '(/docs/release_and_community_operations/)'],
  ['(PYTHON_INTERFACE_QUICKSTART.md)', '(/docs/python_sdk/)'],
  ['(APPLY_YOUR_DATA.md)', '(/docs/apply_your_data/)'],
  ['(FILES_AND_ARTIFACTS.md)', '(/docs/files_and_artifacts/)'],
  ['(ARCHITECTURE.md)', '(/docs/architecture/)'],
  ['(WORKFLOW.md)', '(/docs/workflow/)'],
  ['(TUTORIAL_FIRST_RUN.md)', '(/docs/tutorial/)'],
  ['(OPEN_SOURCE_PLAYBOOK.md)', '(/docs/open_source_playbook/)'],
  ['(PHILOSOPHY.md)', '(/docs/philosophy/)'],
  ['(PHILOSOPHY_FEASIBILITY_REVIEW.md)', '(/blog/feasibility-review-framework/)'],
  ['(BENCHMARKS.md)', `(${SOURCE_BLOB_BASE}docs/BENCHMARKS.md)`],
  ['(AGENT_DESIGN_SPECS.md)', `(${SOURCE_BLOB_BASE}docs/AGENT_DESIGN_SPECS.md)`],
  ['(INDEXING_DESIGN_SPECS.md)', `(${SOURCE_BLOB_BASE}docs/INDEXING_DESIGN_SPECS.md)`],
  ['(BEGINNER_GUIDE.md)', `(${SOURCE_BLOB_BASE}docs/BEGINNER_GUIDE.md)`],
  ['(BEGINNER_PIPELINES_DEMO.md)', `(${SOURCE_BLOB_BASE}docs/BEGINNER_PIPELINES_DEMO.md)`],
  ['(REPOSITORY_LAYOUT.md)', `(${SOURCE_BLOB_BASE}docs/REPOSITORY_LAYOUT.md)`],
  ['(GITHUB_AUTOMATION.md)', `(${SOURCE_BLOB_BASE}docs/GITHUB_AUTOMATION.md)`],
  ['(ARCHITECTURE_HEALTH.md)', `(${SOURCE_BLOB_BASE}docs/ARCHITECTURE_HEALTH.md)`],
  ['(INTERNAL_CLASS_DESIGN.md)', `(${SOURCE_BLOB_BASE}docs/INTERNAL_CLASS_DESIGN.md)`],
  ['(MODULE_OWNERSHIP_MAP.md)', `(${SOURCE_BLOB_BASE}docs/MODULE_OWNERSHIP_MAP.md)`],
  ['(USECASES.md)', `(${SOURCE_BLOB_BASE}docs/USECASES.md)`],
  ['(presentations/SEOCHO_OVERVIEW_DEEP_DIVE.md)', `(${SOURCE_BLOB_BASE}docs/presentations/SEOCHO_OVERVIEW_DEEP_DIVE.md)`],
  ['(RUNTIME_PACKAGE_MIGRATION.md)', `(${SOURCE_BLOB_BASE}docs/RUNTIME_PACKAGE_MIGRATION.md)`],
  ['(GRAPH_RAG_AGENT_HANDOFF_SPEC.md)', `(${SOURCE_BLOB_BASE}docs/GRAPH_RAG_AGENT_HANDOFF_SPEC.md)`],
  ['(ONTOLOGY_RUN_CONTEXT_STRATEGY.md)', `(${SOURCE_BLOB_BASE}docs/ONTOLOGY_RUN_CONTEXT_STRATEGY.md)`],
  ['(PROPERTY_GRAPH_LENS_STRATEGY.md)', `(${SOURCE_BLOB_BASE}docs/PROPERTY_GRAPH_LENS_STRATEGY.md)`],
  ['(ISSUE_TASK_SYSTEM.md)', `(${SOURCE_BLOB_BASE}docs/ISSUE_TASK_SYSTEM.md)`],
  ['(REPOSITORY_HIERARCHY_REVIEW.md)', `(${SOURCE_BLOB_BASE}docs/REPOSITORY_HIERARCHY_REVIEW.md)`],
  ['(KNOWN_ISSUE.md)', `(${SOURCE_BLOB_BASE}docs/KNOWN_ISSUE.md)`],
  ['(BEADS_OPERATING_MODEL.md)', `(${SOURCE_BLOB_BASE}docs/BEADS_OPERATING_MODEL.md)`],
  ['(decisions/DECISION_LOG.md)', `(${SOURCE_BLOB_BASE}docs/decisions/DECISION_LOG.md)`],
  ['(reference/README.md)', `(${SOURCE_BLOB_BASE}docs/reference/README.md)`],
  ['(archive/README.md)', `(${SOURCE_BLOB_BASE}docs/archive/README.md)`],
  ['(maintainers/README.md)', `(${SOURCE_BLOB_BASE}docs/maintainers/README.md)`],
  ['(../CONTRIBUTING.md)', `(${SOURCE_BLOB_BASE}CONTRIBUTING.md)`],
  ['(../examples/agent_designs/)', `(${SOURCE_TREE_BASE}examples/agent_designs)`],
  ['(../examples/indexing_designs/)', `(${SOURCE_TREE_BASE}examples/indexing_designs)`],
  ['(../examples/agent_designs/planning_multi_agent_finance.yaml)', `(${SOURCE_BLOB_BASE}examples/agent_designs/planning_multi_agent_finance.yaml)`],
  ['(../examples/agent_designs/reflection_chain_finance.yaml)', `(${SOURCE_BLOB_BASE}examples/agent_designs/reflection_chain_finance.yaml)`],
  ['(../examples/agent_designs/memory_tool_use_finance.yaml)', `(${SOURCE_BLOB_BASE}examples/agent_designs/memory_tool_use_finance.yaml)`],
  ['(../examples/indexing_designs/lpg_finance_provenance.yaml)', `(${SOURCE_BLOB_BASE}examples/indexing_designs/lpg_finance_provenance.yaml)`],
  ['(../examples/indexing_designs/rdf_deductive_finance.yaml)', `(${SOURCE_BLOB_BASE}examples/indexing_designs/rdf_deductive_finance.yaml)`],
  ['(../examples/indexing_designs/hybrid_inquiry_finance.yaml)', `(${SOURCE_BLOB_BASE}examples/indexing_designs/hybrid_inquiry_finance.yaml)`],
  ['(/tmp/seocho-land-finder-e2e/examples/agent_designs)', `(${SOURCE_TREE_BASE}examples/agent_designs)`],
  ['(/tmp/seocho-land-finder-e2e/examples/indexing_designs)', `(${SOURCE_TREE_BASE}examples/indexing_designs)`],
  ['(/tmp/seocho-land-finder-e2e/examples/agent_designs/planning_multi_agent_finance.yaml)', `(${SOURCE_BLOB_BASE}examples/agent_designs/planning_multi_agent_finance.yaml)`],
  ['(/tmp/seocho-land-finder-e2e/examples/agent_designs/reflection_chain_finance.yaml)', `(${SOURCE_BLOB_BASE}examples/agent_designs/reflection_chain_finance.yaml)`],
  ['(/tmp/seocho-land-finder-e2e/examples/agent_designs/memory_tool_use_finance.yaml)', `(${SOURCE_BLOB_BASE}examples/agent_designs/memory_tool_use_finance.yaml)`],
  ['(/tmp/seocho-land-finder-e2e/examples/indexing_designs/lpg_finance_provenance.yaml)', `(${SOURCE_BLOB_BASE}examples/indexing_designs/lpg_finance_provenance.yaml)`],
  ['(/tmp/seocho-land-finder-e2e/examples/indexing_designs/rdf_deductive_finance.yaml)', `(${SOURCE_BLOB_BASE}examples/indexing_designs/rdf_deductive_finance.yaml)`],
  ['(/tmp/seocho-land-finder-e2e/examples/indexing_designs/hybrid_inquiry_finance.yaml)', `(${SOURCE_BLOB_BASE}examples/indexing_designs/hybrid_inquiry_finance.yaml)`],
  ['(../website/public/images/docs-core-loop.svg)', '(/images/docs-core-loop.svg)'],
  ['src="../website/public/images/docs-core-loop.svg"', 'src="/images/docs-core-loop.svg"'],
  ['(../website/public/images/docs-reader-map.svg)', '(/images/docs-reader-map.svg)'],
  ['src="../website/public/images/docs-reader-map.svg"', 'src="/images/docs-reader-map.svg"'],
  ['(../website/public/images/docs-evidence-loop.svg)', '(/images/docs-evidence-loop.svg)'],
  ['src="../website/public/images/docs-evidence-loop.svg"', 'src="/images/docs-evidence-loop.svg"'],
];

export function rewriteWebsiteRoutes(content) {
  let rewritten = content;
  for (const [sourceRef, routeLink] of routeReplacements) {
    rewritten = rewritten.replaceAll(sourceRef, routeLink);
  }
  return rewritten;
}

export function renderMirroredContent(mapping, sourceContent) {
  const withoutTitle = sourceContent.replace(/^#\s(.*?)\n/m, '');
  return mapping.frontmatter + rewriteWebsiteRoutes(withoutTitle);
}
