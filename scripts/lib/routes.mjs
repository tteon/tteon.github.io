export const routeReplacements = new Map([
    ['`docs/README.md`', '[`/docs/`](/docs/)'],
    ['`docs/QUICKSTART.md`', '[`/docs/quickstart/`](/docs/quickstart/)'],
    ['`docs/APPLY_YOUR_DATA.md`', '[`/docs/apply_your_data/`](/docs/apply_your_data/)'],
    ['`docs/PYTHON_INTERFACE_QUICKSTART.md`', '[`/docs/python_sdk/`](/docs/python_sdk/)'],
    ['`docs/ARCHITECTURE.md`', '[`/docs/architecture/`](/docs/architecture/)'],
    ['`docs/WORKFLOW.md`', '[`/docs/workflow/`](/docs/workflow/)'],
    ['`docs/PHILOSOPHY.md`', '[`/docs/philosophy/`](/docs/philosophy/)'],
    ['`docs/TUTORIAL_FIRST_RUN.md`', '[`/docs/tutorial/`](/docs/tutorial/)'],
    ['`docs/OPEN_SOURCE_PLAYBOOK.md`', '[`/docs/open_source_playbook/`](/docs/open_source_playbook/)'],
]);

export function rewriteWebsiteRoutes(content) {
    let rewritten = content;
    for (const [sourceRef, routeLink] of routeReplacements.entries()) {
        rewritten = rewritten.replaceAll(sourceRef, routeLink);
    }
    return rewritten;
}
