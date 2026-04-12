import { test } from 'node:test';
import assert from 'node:assert';
import { rewriteWebsiteRoutes } from './routes.mjs';

test('rewriteWebsiteRoutes replaces standard routes', () => {
    const input = 'Check out `docs/README.md` for more info.';
    const expected = 'Check out [`/docs/`](/docs/) for more info.';
    assert.strictEqual(rewriteWebsiteRoutes(input), expected);
});

test('rewriteWebsiteRoutes replaces multiple routes in one string', () => {
    const input = 'Read `docs/QUICKSTART.md` and then `docs/ARCHITECTURE.md`.';
    const expected = 'Read [`/docs/quickstart/`](/docs/quickstart/) and then [`/docs/architecture/`](/docs/architecture/).';
    assert.strictEqual(rewriteWebsiteRoutes(input), expected);
});

test('rewriteWebsiteRoutes returns same string if no matches found', () => {
    const input = 'This string has no matching routes.';
    assert.strictEqual(rewriteWebsiteRoutes(input), input);
});

test('rewriteWebsiteRoutes handles all defined route replacements', () => {
    const inputs = [
        ['`docs/APPLY_YOUR_DATA.md`', '[`/docs/apply_your_data/`](/docs/apply_your_data/)'],
        ['`docs/PYTHON_INTERFACE_QUICKSTART.md`', '[`/docs/python_sdk/`](/docs/python_sdk/)'],
        ['`docs/WORKFLOW.md`', '[`/docs/workflow/`](/docs/workflow/)'],
        ['`docs/PHILOSOPHY.md`', '[`/docs/philosophy/`](/docs/philosophy/)'],
        ['`docs/TUTORIAL_FIRST_RUN.md`', '[`/docs/tutorial/`](/docs/tutorial/)'],
        ['`docs/OPEN_SOURCE_PLAYBOOK.md`', '[`/docs/open_source_playbook/`](/docs/open_source_playbook/)']
    ];

    for (const [input, expected] of inputs) {
        assert.strictEqual(rewriteWebsiteRoutes(input), expected);
    }
});
